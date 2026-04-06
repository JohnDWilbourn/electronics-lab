package com.electronicslab.labnotebook;

import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.DownloadListener;
import android.webkit.URLUtil;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        setSupportActionBar(findViewById(R.id.toolbar));
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle(R.string.app_name);
        }

        webView = findViewById(R.id.webview);
        configureWebView(webView);
        webView.loadUrl("file:///android_asset/schematic_editor.html");
    }

    private void configureWebView(WebView wv) {
        WebSettings settings = wv.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setDomStorageEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);

        wv.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return false;
            }
        });

        wv.setWebChromeClient(new WebChromeClient());

        // ── DOWNLOAD LISTENER ──────────────────────────────────────────────
        // Catches blob: URLs created by exportJSON() and exportSVG() in the
        // editor. Saves the file to Downloads via MediaStore (API 29+) or
        // legacy external storage (API 24-28).
        wv.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent,
                                        String contentDisposition,
                                        String mimetype, long contentLength) {

                // Derive filename from Content-Disposition or URL
                String filename = URLUtil.guessFileName(url, contentDisposition, mimetype);

                // Enforce sensible extensions
                if (mimetype != null && mimetype.contains("json") && !filename.endsWith(".json")) {
                    filename = filename + ".json";
                }
                if (mimetype != null && mimetype.contains("svg") && !filename.endsWith(".svg")) {
                    filename = filename + ".svg";
                }

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    // API 29+ — MediaStore, no storage permission needed
                    saveViaMediaStore(url, filename, mimetype);
                } else {
                    // API 24-28 — legacy path, requires WRITE_EXTERNAL_STORAGE
                    saveLegacy(url, filename);
                }
            }
        });
    }

    // ── API 29+ SAVE ───────────────────────────────────────────────────────

    private void saveViaMediaStore(String blobUrl, String filename, String mimetype) {
        new Thread(() -> {
            try {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Downloads.DISPLAY_NAME, filename);
                values.put(MediaStore.Downloads.MIME_TYPE,
                        mimetype != null ? mimetype : "application/octet-stream");
                values.put(MediaStore.Downloads.RELATIVE_PATH,
                        Environment.DIRECTORY_DOWNLOADS + "/LabNotebook");
                values.put(MediaStore.Downloads.IS_PENDING, 1);

                Uri collection = MediaStore.Downloads.getContentUri(
                        MediaStore.VOLUME_EXTERNAL_PRIMARY);
                Uri fileUri = getContentResolver().insert(collection, values);

                if (fileUri == null) {
                    showToast("Export failed — could not create file");
                    return;
                }

                // Read blob URL
                URL url = new URL(blobUrl);
                try (InputStream in = url.openStream();
                     OutputStream out = getContentResolver().openOutputStream(fileUri)) {
                    if (out == null) throw new IOException("null output stream");
                    byte[] buf = new byte[8192];
                    int n;
                    while ((n = in.read(buf)) != -1) out.write(buf, 0, n);
                }

                values.clear();
                values.put(MediaStore.Downloads.IS_PENDING, 0);
                getContentResolver().update(fileUri, values, null, null);

                showToast("Saved to Downloads/LabNotebook/" + filename);

            } catch (Exception e) {
                // blob: URLs can't be fetched from a background thread —
                // fall back to evaluating JS to get the data directly.
                runOnUiThread(() -> exportViaJavascript(filename));
            }
        }).start();
    }

    // ── JAVASCRIPT FALLBACK ────────────────────────────────────────────────
    // blob: URLs are origin-bound and can't be fetched off the main thread.
    // This asks the JS to re-encode the data as a base64 data URI which we
    // can then decode and write.

    private void exportViaJavascript(String filename) {
        boolean isJson = filename.endsWith(".json");
        String jsCall = isJson
                ? "(function(){ var d=JSON.stringify({project:window._projectId||'schematic',components:components,wires:wires},null,2); return btoa(unescape(encodeURIComponent(d))); })()"
                : "(function(){ /* SVG export returns base64 via exportSVGBase64() */ return typeof exportSVGBase64==='function'?exportSVGBase64():''; })()";

        webView.evaluateJavascript(jsCall, base64 -> {
            if (base64 == null || base64.equals("null") || base64.isEmpty()) {
                showToast("Export failed");
                return;
            }
            // Strip surrounding quotes from JS string result
            String b64 = base64.replaceAll("^\"|\"$", "");
            try {
                byte[] data = android.util.Base64.decode(b64, android.util.Base64.DEFAULT);
                writeToDownloads(filename, data,
                        isJson ? "application/json" : "image/svg+xml");
            } catch (Exception e) {
                showToast("Export failed: " + e.getMessage());
            }
        });
    }

    private void writeToDownloads(String filename, byte[] data, String mime) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Downloads.DISPLAY_NAME, filename);
                values.put(MediaStore.Downloads.MIME_TYPE, mime);
                values.put(MediaStore.Downloads.RELATIVE_PATH,
                        Environment.DIRECTORY_DOWNLOADS + "/LabNotebook");

                Uri uri = getContentResolver().insert(
                        MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY),
                        values);
                if (uri == null) throw new IOException("insert failed");
                try (OutputStream out = getContentResolver().openOutputStream(uri)) {
                    if (out == null) throw new IOException("null stream");
                    out.write(data);
                }
                showToast("Saved to Downloads/LabNotebook/" + filename);
            } else {
                java.io.File dir = new java.io.File(
                        Environment.getExternalStoragePublicDirectory(
                                Environment.DIRECTORY_DOWNLOADS), "LabNotebook");
                dir.mkdirs();
                java.io.File file = new java.io.File(dir, filename);
                try (OutputStream out = new java.io.FileOutputStream(file)) {
                    out.write(data);
                }
                showToast("Saved to Downloads/LabNotebook/" + filename);
            }
        } catch (Exception e) {
            showToast("Save failed: " + e.getMessage());
        }
    }

    // ── LEGACY SAVE (API 24-28) ────────────────────────────────────────────

    private void saveLegacy(String blobUrl, String filename) {
        // On API 24-28 blob: URLs also can't be fetched directly —
        // use the JS fallback path.
        runOnUiThread(() -> exportViaJavascript(filename));
    }

    private void showToast(String msg) {
        runOnUiThread(() ->
                Toast.makeText(this, msg, Toast.LENGTH_LONG).show());
    }

    // ── MENU ──────────────────────────────────────────────────────────────

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.menu_help)        { openHelp();      return true; }
        if (id == R.id.menu_new)         { newSchematic();  return true; }
        if (id == R.id.menu_export_json) { exportJSON();    return true; }
        if (id == R.id.menu_export_svg)  { exportSVG();     return true; }
        if (id == R.id.menu_import)      { importJSON();    return true; }
        if (id == R.id.menu_about)       { openAbout();     return true; }
        return super.onOptionsItemSelected(item);
    }

    // ── MENU ACTIONS ──────────────────────────────────────────────────────

    private void openHelp() {
        startActivity(new Intent(this, HelpActivity.class));
    }

    private void newSchematic() {
        webView.evaluateJavascript("clearAll();", null);
    }

    private void exportJSON() {
        webView.evaluateJavascript("exportJSON();", null);
    }

    private void exportSVG() {
        webView.evaluateJavascript("exportSVG();", null);
    }

    private void importJSON() {
        webView.evaluateJavascript("importJSON();", null);
    }

    private void openAbout() {
        new androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle(R.string.about_title)
                .setMessage(R.string.about_message)
                .setPositiveButton(android.R.string.ok, null)
                .show();
    }

    // ── BACK / LIFECYCLE ──────────────────────────────────────────────────

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override protected void onPause()   { super.onPause();   webView.onPause();   }
    @Override protected void onResume()  { super.onResume();  webView.onResume();  }
    @Override protected void onDestroy() { webView.destroy(); super.onDestroy();   }
}
