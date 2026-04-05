package com.electronicslab.labnotebook;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Toolbar
        setSupportActionBar(findViewById(R.id.toolbar));
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle(R.string.app_name);
        }

        // WebView setup
        webView = findViewById(R.id.webview);
        configureWebView(webView);

        // Load the schematic editor from assets
        webView.loadUrl("file:///android_asset/schematic_editor.html");
    }

    private void configureWebView(WebView wv) {
        WebSettings settings = wv.getSettings();

        // JavaScript required for the editor
        settings.setJavaScriptEnabled(true);

        // Allow local file access within assets
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);

        // DOM storage for future local persistence
        settings.setDomStorageEnabled(true);

        // Responsive layout
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        // Zoom
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);

        // Stay within the app on link clicks
        wv.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Keep navigation inside the WebView
                return false;
            }
        });

        // Allow JS alerts and console messages (useful during development)
        wv.setWebChromeClient(new WebChromeClient());
    }

    // ── MENU ──────────────────────────────────────────────

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.menu_help) {
            openHelp();
            return true;
        }
        if (id == R.id.menu_new) {
            newSchematic();
            return true;
        }
        if (id == R.id.menu_export_json) {
            exportJSON();
            return true;
        }
        if (id == R.id.menu_export_svg) {
            exportSVG();
            return true;
        }
        if (id == R.id.menu_import) {
            importJSON();
            return true;
        }
        if (id == R.id.menu_about) {
            openAbout();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    // ── MENU ACTIONS ──────────────────────────────────────

    private void openHelp() {
        Intent intent = new Intent(this, HelpActivity.class);
        startActivity(intent);
    }

    private void newSchematic() {
        // Calls JS function in the editor to clear canvas
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
        // Simple about dialog — expand as needed
        new androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle(R.string.about_title)
            .setMessage(R.string.about_message)
            .setPositiveButton(android.R.string.ok, null)
            .show();
    }

    // ── BACK BUTTON ───────────────────────────────────────

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    // ── LIFECYCLE ─────────────────────────────────────────

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onDestroy() {
        webView.destroy();
        super.onDestroy();
    }
}
