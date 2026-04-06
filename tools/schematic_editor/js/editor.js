// editor.js — Core editor logic
// LAB//NOTEBOOK Schematic Editor
// Depends on: state.js, symbols.js, components/components.js

// ── CANVAS SETUP ─────────────────────────────────────────────────────────

const gridCanvas = document.getElementById('grid-canvas');
const schCanvas  = document.getElementById('schematic-canvas');
const gc = gridCanvas.getContext('2d');
const sc = schCanvas.getContext('2d');
const wrap = document.getElementById('canvas-wrap');

function resizeCanvases() {
  const w = wrap.clientWidth, h = wrap.clientHeight;
  gridCanvas.width = schCanvas.width = w;
  gridCanvas.height = schCanvas.height = h;
  drawAll();
}

window.addEventListener('resize', resizeCanvases);

// Center initial view
function initView() {
  viewX = wrap.clientWidth / 2;
  viewY = wrap.clientHeight / 2;
  viewScale = 1;
}

// ── GRID ─────────────────────────────────────────────────────────────────

function drawGrid() {
  const w = gridCanvas.width, h = gridCanvas.height;
  gc.clearRect(0, 0, w, h);
  const step = GRID * viewScale;
  if (step < 3) return;
  const startX = ((viewX % step) + step) % step;
  const startY = ((viewY % step) + step) % step;
  gc.strokeStyle = '#131a1f';
  gc.lineWidth = 1;
  for (let x = startX; x < w; x += step) {
    gc.beginPath(); gc.moveTo(x, 0); gc.lineTo(x, h); gc.stroke();
  }
  for (let y = startY; y < h; y += step) {
    gc.beginPath(); gc.moveTo(0, y); gc.lineTo(w, y); gc.stroke();
  }
  if (step >= 8) {
    const major = step * 5;
    const msx = ((viewX % major) + major) % major;
    const msy = ((viewY % major) + major) % major;
    gc.strokeStyle = '#1a2530';
    for (let x = msx; x < w; x += major) {
      gc.beginPath(); gc.moveTo(x, 0); gc.lineTo(x, h); gc.stroke();
    }
    for (let y = msy; y < h; y += major) {
      gc.beginPath(); gc.moveTo(0, y); gc.lineTo(w, y); gc.stroke();
    }
  }
}

// ── MAIN DRAW ─────────────────────────────────────────────────────────────

function drawAll() {
  drawGrid();
  const w = schCanvas.width, h = schCanvas.height;
  sc.clearRect(0, 0, w, h);
  sc.save();
  sc.translate(viewX, viewY);
  sc.scale(viewScale, viewScale);

  // Wires
  sc.strokeStyle = '#00e5ff';
  sc.lineWidth = 1.5 / viewScale;
  sc.lineCap = 'round';
  for (const wire of wires) {
    sc.beginPath();
    sc.moveTo(wire.x1, wire.y1);
    sc.lineTo(wire.x2, wire.y2);
    sc.stroke();
  }

  // Junction dots
  sc.fillStyle = '#00e5ff';
  const jMap = {};
  for (const wire of wires) {
    [[wire.x1,wire.y1],[wire.x2,wire.y2]].forEach(([x,y]) => {
      const k = `${x},${y}`;
      jMap[k] = (jMap[k]||0) + 1;
    });
  }
  for (const [key, count] of Object.entries(jMap)) {
    if (count >= 3) {
      const [x,y] = key.split(',').map(Number);
      sc.beginPath();
      sc.arc(x, y, 3.5 / viewScale, 0, Math.PI * 2);
      sc.fill();
    }
  }

  // Active wire preview
  if (wireStart && wireCurrent) {
    sc.strokeStyle = 'rgba(0,229,255,0.45)';
    sc.lineWidth = 1.5 / viewScale;
    sc.setLineDash([4 / viewScale, 3 / viewScale]);
    sc.beginPath();
    sc.moveTo(wireStart.x, wireStart.y);
    // Orthogonal routing — horizontal first
    const dx = wireCurrent.x - wireStart.x;
    const dy = wireCurrent.y - wireStart.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      sc.lineTo(wireCurrent.x, wireStart.y);
      sc.lineTo(wireCurrent.x, wireCurrent.y);
    } else {
      sc.lineTo(wireStart.x, wireCurrent.y);
      sc.lineTo(wireCurrent.x, wireCurrent.y);
    }
    sc.stroke();
    sc.setLineDash([]);
  }

  // Components
  for (const comp of components) {
    sc.save();
    sc.translate(comp.x, comp.y);
    sc.rotate(comp.rotation * Math.PI / 180);
    if (comp.flipH) sc.scale(-1, 1);

    const def = getLibDef(comp.type);
    if (def && def.draw) {
      try { def.draw(sc, comp); } catch(e) { console.warn('Draw error', comp.type, e); }
    }

    // Pin dots in wire/select mode
    if ((tool === 'wire' || comp.selected) && def) {
      sc.fillStyle = '#ff6b00';
      for (const pin of (def.pins || [])) {
        sc.beginPath();
        sc.arc(pin.x, pin.y, 3 / viewScale, 0, Math.PI * 2);
        sc.fill();
      }
    }

    // Labels — unrotated
    sc.rotate(-(comp.rotation * Math.PI / 180));
    if (comp.flipH) sc.scale(-1, 1);
    const def2 = def;
    const hhalf = (def2?.h || 30) / 2;

    sc.font = `${10 / viewScale}px Share Tech Mono`;
    sc.textAlign = 'center';
    sc.fillStyle = comp.selected ? '#00e5ff' : '#4a8aa0';
    sc.textBaseline = 'bottom';
    sc.fillText(comp.ref || '', 0, -hhalf - 4 / viewScale);
    sc.fillStyle = comp.selected ? '#ffd600' : '#6a9ab0';
    sc.textBaseline = 'top';
    sc.fillText(comp.value || '', 0, hhalf + 2 / viewScale);

    sc.restore();
  }

  sc.restore();

  // Status bar
  document.getElementById('sb-comp').textContent = components.length;
  document.getElementById('sb-wire').textContent = wires.length;
  document.getElementById('sb-zoom').textContent = Math.round(viewScale * 100) + '%';
}

// ── COMPONENT PLACEMENT ───────────────────────────────────────────────────

function placeComponent(type, wx, wy) {
  const def = getLibDef(type);
  if (!def) return null;
  const ref = getNextRef(def.sub);
  const comp = {
    id: nextId++,
    type, ref,
    x: snapToGrid(wx),
    y: snapToGrid(wy),
    value: '',
    rotation: 0,
    flipH: false,
    selected: false,
    notes: ''
  };
  components.push(comp);
  selectComponent(comp.id);
  drawAll();
  return comp;
}

function hitTest(wx, wy) {
  for (let i = components.length - 1; i >= 0; i--) {
    const comp = components[i];
    const def = getLibDef(comp.type);
    const hw = (def?.w || 40) / 2 + 10;
    const hh = (def?.h || 30) / 2 + 10;
    if (wx >= comp.x - hw && wx <= comp.x + hw &&
        wy >= comp.y - hh && wy <= comp.y + hh) {
      return comp;
    }
  }
  return null;
}

function nearestPin(wx, wy) {
  const snapDist = PIN_SNAP_DIST / viewScale;
  let best = null, bestD = snapDist;
  for (const comp of components) {
    const def = getLibDef(comp.type);
    const rad = comp.rotation * Math.PI / 180;
    const cos = Math.cos(rad), sin = Math.sin(rad);
    for (const pin of (def?.pins || [])) {
      let px = pin.x * cos - pin.y * sin;
      let py = pin.x * sin + pin.y * cos;
      if (comp.flipH) px = -px;
      px += comp.x; py += comp.y;
      const d = Math.hypot(wx - px, wy - py);
      if (d < bestD) { bestD = d; best = { x: px, y: py }; }
    }
  }
  return best;
}

function selectComponent(id) {
  components.forEach(c => c.selected = false);
  selectedId = id;
  if (id !== null) {
    const comp = components.find(c => c.id === id);
    if (comp) { comp.selected = true; showProps(comp); }
  } else {
    showNoSelection();
  }
}

function deleteComponent(id) {
  components = components.filter(c => c.id !== id);
  if (selectedId === id) { selectedId = null; showNoSelection(); }
  drawAll();
}

function deleteWireAt(wx, wy) {
  const snap = 8 / viewScale;
  wires = wires.filter(w => {
    const dx = w.x2 - w.x1, dy = w.y2 - w.y1;
    const len2 = dx * dx + dy * dy;
    if (len2 < 1) return true;
    const t = Math.max(0, Math.min(1, ((wx - w.x1) * dx + (wy - w.y1) * dy) / len2));
    return Math.hypot(w.x1 + t * dx - wx, w.y1 + t * dy - wy) > snap;
  });
  drawAll();
}

// ── CANVAS EVENTS ─────────────────────────────────────────────────────────

function canvasXY(e) {
  const r = schCanvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function canvasMouseDown(e) {
  hideMenus();
  if (e.button === 1 || (e.button === 0 && e.altKey)) {
    isPanning = true;
    panStartX = e.clientX; panStartY = e.clientY;
    panOriginX = viewX; panOriginY = viewY;
    return;
  }
  if (e.button === 2) return;

  const { x: sx, y: sy } = canvasXY(e);
  const w = screenToWorld(sx, sy);

  if (tool === 'select') {
    const comp = hitTest(w.x, w.y);
    if (comp) {
      selectComponent(comp.id);
      isDragging = true;
      dragComp = comp;
      dragOffX = w.x - comp.x;
      dragOffY = w.y - comp.y;
    } else {
      selectComponent(null);
      isPanning = true;
      panStartX = e.clientX; panStartY = e.clientY;
      panOriginX = viewX; panOriginY = viewY;
    }
  }

  if (tool === 'wire') {
    const snap = nearestPin(w.x, w.y);
    wireStart = snap || { x: snapToGrid(w.x), y: snapToGrid(w.y) };
    wireCurrent = { ...wireStart };
  }

  if (tool === 'delete') {
    const comp = hitTest(w.x, w.y);
    if (comp) deleteComponent(comp.id);
    else deleteWireAt(w.x, w.y);
  }

  drawAll();
}

function canvasMouseMove(e) {
  const { x: sx, y: sy } = canvasXY(e);
  const w = screenToWorld(sx, sy);
  document.getElementById('sb-pos').textContent = `${Math.round(w.x)},${Math.round(w.y)}`;

  if (isPanning) {
    viewX = panOriginX + (e.clientX - panStartX);
    viewY = panOriginY + (e.clientY - panStartY);
    drawAll(); return;
  }

  if (isDragging && dragComp) {
    dragComp.x = snapToGrid(w.x - dragOffX);
    dragComp.y = snapToGrid(w.y - dragOffY);
    drawAll(); return;
  }

  if (tool === 'wire' && wireStart) {
    const snap = nearestPin(w.x, w.y);
    wireCurrent = snap || { x: snapToGrid(w.x), y: snapToGrid(w.y) };
    drawAll();
  }
}

function canvasMouseUp(e) {
  if (isPanning) { isPanning = false; return; }
  if (isDragging) { isDragging = false; dragComp = null; return; }

  if (tool === 'wire' && wireStart && wireCurrent) {
    const dx = wireCurrent.x - wireStart.x;
    const dy = wireCurrent.y - wireStart.y;
    // Route orthogonally
    if (Math.abs(dx) >= Math.abs(dy)) {
      if (Math.abs(dx) > 1) {
        wires.push({ x1: wireStart.x, y1: wireStart.y, x2: wireCurrent.x, y2: wireStart.y });
        if (Math.abs(dy) > 1) {
          wires.push({ x1: wireCurrent.x, y1: wireStart.y, x2: wireCurrent.x, y2: wireCurrent.y });
        }
      }
    } else {
      if (Math.abs(dy) > 1) {
        wires.push({ x1: wireStart.x, y1: wireStart.y, x2: wireStart.x, y2: wireCurrent.y });
        if (Math.abs(dx) > 1) {
          wires.push({ x1: wireStart.x, y1: wireCurrent.y, x2: wireCurrent.x, y2: wireCurrent.y });
        }
      }
    }
    wireStart = null; wireCurrent = null;
    drawAll();
  }
}

function canvasDblClick(e) {
  const { x: sx, y: sy } = canvasXY(e);
  const w = screenToWorld(sx, sy);
  const comp = hitTest(w.x, w.y);
  if (comp) { ctxTarget = comp; ctxEditValue(); }
}

function canvasRightClick(e) {
  e.preventDefault();
  const { x: sx, y: sy } = canvasXY(e);
  const w = screenToWorld(sx, sy);
  const comp = hitTest(w.x, w.y);
  if (comp) {
    ctxTarget = comp;
    selectComponent(comp.id);
    showContextMenu(e.clientX, e.clientY);
  }
  drawAll();
}

function canvasWheel(e) {
  e.preventDefault();
  const { x: sx, y: sy } = canvasXY(e);
  const factor = e.deltaY < 0 ? 1.12 : 0.9;
  const newScale = Math.max(0.08, Math.min(10, viewScale * factor));
  viewX = sx - (sx - viewX) * (newScale / viewScale);
  viewY = sy - (sy - viewY) * (newScale / viewScale);
  viewScale = newScale;
  drawAll();
}

// ── TOUCH ─────────────────────────────────────────────────────────────────

function touchStart(e) {
  e.preventDefault();
  if (e.touches.length === 1) {
    const t = e.touches[0];
    canvasMouseDown({ clientX: t.clientX, clientY: t.clientY, button: 0, altKey: false });
  } else if (e.touches.length === 2) {
    isDragging = false; isPanning = false;
    lastTouchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
}

function touchMove(e) {
  e.preventDefault();
  if (e.touches.length === 1) {
    canvasMouseMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
  } else if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    const r = schCanvas.getBoundingClientRect();
    const sx = mx - r.left, sy = my - r.top;
    const factor = dist / lastTouchDist;
    const newScale = Math.max(0.08, Math.min(10, viewScale * factor));
    viewX = sx - (sx - viewX) * (newScale / viewScale);
    viewY = sy - (sy - viewY) * (newScale / viewScale);
    viewScale = newScale;
    lastTouchDist = dist;
    drawAll();
  }
}

function touchEnd(e) { e.preventDefault(); canvasMouseUp({}); }

// ── TOOLS ─────────────────────────────────────────────────────────────────

function setTool(t) {
  tool = t;
  wireStart = null; wireCurrent = null;
  document.querySelectorAll('#topbar .tb-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('tool-' + t);
  if (btn) btn.classList.add('active');
  document.getElementById('sb-tool').textContent = t.toUpperCase();
  schCanvas.style.cursor = t === 'wire' ? 'crosshair' : t === 'delete' ? 'not-allowed' : 'default';
  drawAll();
}

function rotateSelected() {
  if (selectedId === null) return;
  const comp = components.find(c => c.id === selectedId);
  if (comp) { comp.rotation = (comp.rotation + 90) % 360; drawAll(); showProps(comp); }
}

function flipSelected() {
  if (selectedId === null) return;
  const comp = components.find(c => c.id === selectedId);
  if (comp) { comp.flipH = !comp.flipH; drawAll(); }
}

// ── ZOOM ──────────────────────────────────────────────────────────────────

function zoomIn()  { viewScale = Math.min(10, viewScale * 1.2); drawAll(); }
function zoomOut() { viewScale = Math.max(0.08, viewScale / 1.2); drawAll(); }

function zoomFit() {
  if (components.length === 0) {
    viewScale = 1; viewX = wrap.clientWidth / 2; viewY = wrap.clientHeight / 2;
    drawAll(); return;
  }
  let minX=Infinity, maxX=-Infinity, minY=Infinity, maxY=-Infinity;
  components.forEach(c => {
    const def = getLibDef(c.type);
    const hw = (def?.w || 40) / 2 + 40, hh = (def?.h || 30) / 2 + 40;
    minX = Math.min(minX, c.x - hw); maxX = Math.max(maxX, c.x + hw);
    minY = Math.min(minY, c.y - hh); maxY = Math.max(maxY, c.y + hh);
  });
  const sw = wrap.clientWidth, sh = wrap.clientHeight;
  viewScale = Math.min(sw / (maxX - minX), sh / (maxY - minY), 4) * 0.85;
  viewX = sw / 2 - ((minX + maxX) / 2) * viewScale;
  viewY = sh / 2 - ((minY + maxY) / 2) * viewScale;
  drawAll();
}

// ── CONTEXT MENU ──────────────────────────────────────────────────────────

function showContextMenu(x, y) {
  const m = document.getElementById('ctx-menu');
  m.style.left = x + 'px'; m.style.top = y + 'px'; m.style.display = 'block';
}

function hideMenus() {
  document.getElementById('ctx-menu').style.display = 'none';
  document.getElementById('samples-menu').style.display = 'none';
}

document.addEventListener('click', hideMenus);

function ctxRotate()    { if (ctxTarget) { ctxTarget.rotation = (ctxTarget.rotation + 90) % 360; drawAll(); showProps(ctxTarget); } }
function ctxFlip()      { if (ctxTarget) { ctxTarget.flipH = !ctxTarget.flipH; drawAll(); } }
function ctxDelete()    { if (ctxTarget) deleteComponent(ctxTarget.id); }
function ctxDuplicate() {
  if (!ctxTarget) return;
  const def = getLibDef(ctxTarget.type);
  const copy = { ...ctxTarget, id: nextId++, ref: getNextRef(def.sub),
    x: ctxTarget.x + GRID * 2, y: ctxTarget.y + GRID * 2, selected: false };
  components.push(copy);
  selectComponent(copy.id);
  drawAll();
}

function ctxEditLabel() {
  if (!ctxTarget) return;
  openModal('Edit Reference', `<div class="prop-label">Reference Designator</div>
    <input class="prop-input" id="m-ref" value="${ctxTarget.ref||''}">`,
    () => { ctxTarget.ref = document.getElementById('m-ref').value; drawAll(); showProps(ctxTarget); });
}

function ctxEditValue() {
  if (!ctxTarget) return;
  openModal('Edit Value', `<div class="prop-label">Value / Part Number</div>
    <input class="prop-input" id="m-val" value="${ctxTarget.value||''}">
    <br><br><div class="prop-label">Notes</div>
    <textarea id="m-notes">${ctxTarget.notes||''}</textarea>`,
    () => {
      ctxTarget.value = document.getElementById('m-val').value;
      ctxTarget.notes = document.getElementById('m-notes').value;
      drawAll(); showProps(ctxTarget);
    });
}

// ── PROPERTIES PANEL ─────────────────────────────────────────────────────

function showProps(comp) {
  document.getElementById('no-selection').style.display = 'none';
  const pf = document.getElementById('prop-fields');
  pf.style.display = 'block';
  const def = getLibDef(comp.type);
  pf.innerHTML = `
    <div class="prop-row"><div class="prop-label">Type</div>
      <div style="font-family:monospace;font-size:11px;color:var(--accent)">${comp.type}</div></div>
    <div class="prop-row"><div class="prop-label">Ref</div>
      <input class="prop-input" value="${comp.ref||''}" onchange="updateProp(${comp.id},'ref',this.value)"></div>
    <div class="prop-row"><div class="prop-label">Value</div>
      <input class="prop-input" value="${comp.value||''}" onchange="updateProp(${comp.id},'value',this.value)" placeholder="e.g. 220µH"></div>
    <div class="prop-row"><div class="prop-label">Rotation</div>
      <select class="prop-input" onchange="updateProp(${comp.id},'rotation',+this.value)">
        ${[0,90,180,270].map(r=>`<option value="${r}"${comp.rotation===r?' selected':''}>${r}°</option>`).join('')}
      </select></div>
    <div class="prop-row"><div class="prop-label">Pins (${(def?.pins||[]).length})</div>
      <div style="font-family:monospace;font-size:10px;color:var(--dim);line-height:1.6">
        ${(def?.pins||[]).map(p=>`<span style="color:var(--accent2)">${p.num}</span> ${p.name}`).join('<br>')}
      </div></div>
    <div class="prop-row"><div class="prop-label">Notes</div>
      <input class="prop-input" value="${comp.notes||''}" onchange="updateProp(${comp.id},'notes',this.value)"></div>`;
}

function showNoSelection() {
  document.getElementById('no-selection').style.display = 'block';
  document.getElementById('prop-fields').style.display = 'none';
}

function updateProp(id, key, val) {
  const comp = components.find(c => c.id === id);
  if (comp) { comp[key] = val; drawAll(); }
}

// ── MODAL ─────────────────────────────────────────────────────────────────

let modalCallback = null;

function openModal(title, content, cb) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-content').innerHTML = content;
  modalCallback = cb;
  document.getElementById('modal-overlay').classList.add('open');
  setTimeout(() => {
    const first = document.querySelector('#modal-content input, #modal-content textarea');
    if (first) { first.focus(); first.select(); }
  }, 40);
}

function modalOK()     { if (modalCallback) modalCallback(); document.getElementById('modal-overlay').classList.remove('open'); }
function modalCancel() { document.getElementById('modal-overlay').classList.remove('open'); }

document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) modalCancel();
});

// ── KEYBOARD ─────────────────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  hideMenus();
  const k = e.key;
  if (k==='v'||k==='V') setTool('select');
  if (k==='w'||k==='W') setTool('wire');
  if (k==='d'||k==='D') setTool('delete');
  if (k==='r'||k==='R') rotateSelected();
  if (k==='f'||k==='F') flipSelected();
  if (k==='Escape') { wireStart=null; wireCurrent=null; setTool('select'); drawAll(); }
  if (k==='Delete'||k==='Backspace') { if (selectedId!==null) deleteComponent(selectedId); }
  if (k==='+'||k==='=') zoomIn();
  if (k==='-') zoomOut();
  if (k==='0') zoomFit();
});

// ── LIBRARY UI ───────────────────────────────────────────────────────────

function buildLibrary() {
  const scroll = document.getElementById('lib-scroll');
  scroll.innerHTML = '';
  let lastCat = '';

  for (const def of COMPONENT_LIBRARY) {
    if (def.cat !== lastCat) {
      const cat = document.createElement('div');
      cat.className = 'lib-cat';
      cat.textContent = def.cat;
      scroll.appendChild(cat);
      lastCat = def.cat;
    }
    const item = document.createElement('div');
    item.className = 'lib-item';
    item.draggable = true;
    item.dataset.type = def.type;

    const lbl = document.createElement('div');
    lbl.className = 'lib-label';
    lbl.innerHTML = `${def.label}<small>${def.sub} · ${(def.pins||[]).length} pins</small>`;
    item.appendChild(lbl);

    item.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', def.type));
    item.addEventListener('click', () => {
      const w = screenToWorld(wrap.clientWidth / 2, wrap.clientHeight / 2);
      placeComponent(def.type, w.x, w.y);
      setTool('select');
    });
    scroll.appendChild(item);
  }
}

schCanvas.addEventListener('dragover', e => e.preventDefault());
schCanvas.addEventListener('drop', e => {
  e.preventDefault();
  const type = e.dataTransfer.getData('text/plain');
  if (!type) return;
  const r = schCanvas.getBoundingClientRect();
  const w = screenToWorld(e.clientX - r.left, e.clientY - r.top);
  placeComponent(type, w.x, w.y);
  setTool('select');
});

function filterLib(q) {
  const scroll = document.getElementById('lib-scroll');
  const ql = q.toLowerCase();
  scroll.querySelectorAll('.lib-item').forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(ql) ? '' : 'none';
  });
  scroll.querySelectorAll('.lib-cat').forEach(cat => {
    let next = cat.nextSibling, any = false;
    while (next && !next.classList?.contains('lib-cat')) {
      if (next.style?.display !== 'none') any = true;
      next = next.nextSibling;
    }
    cat.style.display = any ? '' : 'none';
  });
}

// ── SAMPLES ───────────────────────────────────────────────────────────────

const SAMPLE_LIST = [
  { file:'001_fw_bridge_rectifier.json',  name:'Full-Wave Bridge Rectifier' },
  { file:'002_ne555_astable.json',        name:'NE555 Astable Oscillator' },
  { file:'003_ne555_monostable.json',     name:'NE555 Monostable (One-Shot)' },
  { file:'004_lm386_amplifier.json',      name:'LM386 Audio Amplifier' },
  { file:'005_am_receiver.json',          name:'AM Receiver — 1610 kHz' },
  { file:'006_led_blinker.json',          name:'LED Blinker (Mims Classic)' },
  { file:'007_lm317_psu.json',            name:'LM317 Adjustable PSU' },
  { file:'008_npn_switch.json',           name:'NPN Transistor Switch' },
  { file:'009_common_emitter_amp.json',   name:'Common Emitter Amplifier' },
  { file:'010_rc_lowpass.json',           name:'RC Low-Pass Filter' },
  { file:'011_rc_highpass.json',          name:'RC High-Pass Filter' },
  { file:'012_wheatstone_bridge.json',    name:'Wheatstone Bridge + NTC' },
  { file:'013_tank_circuit.json',         name:'LC Tank Circuit — 1610 kHz' },
  { file:'014_crystal_oscillator.json',   name:'Crystal Oscillator (Pierce)' },
  { file:'015_7segment_counter.json',     name:'7-Segment Up/Down Counter' },
];

function showSamples(e) {
  e.stopPropagation();
  const menu = document.getElementById('samples-menu');
  if (menu.style.display === 'block') { menu.style.display='none'; return; }
  menu.innerHTML = '';
  for (const s of SAMPLE_LIST) {
    const item = document.createElement('div');
    item.className = 'sample-item';
    item.innerHTML = `<div class="sample-name">${s.name}</div>`;
    item.onclick = () => { loadSample(s.file); menu.style.display='none'; };
    menu.appendChild(item);
  }
  const btn = document.getElementById('topbar');
  const rect = btn.getBoundingClientRect();
  menu.style.left = e.clientX + 'px';
  menu.style.top = (rect.bottom) + 'px';
  menu.style.display = 'block';
}

function loadSample(filename) {
  fetch(`samples/${filename}`)
    .then(r => { if (!r.ok) throw new Error('Not found'); return r.json(); })
    .then(data => {
      if (!confirm(`Load sample "${data.name}"?\nThis replaces the current canvas.`)) return;
      loadSchematic(data);
    })
    .catch(() => alert(`Sample file not found: ${filename}\nMake sure the samples/ folder is present.`));
}

// ── EXPORT / IMPORT ───────────────────────────────────────────────────────

function exportJSON() {
  const data = {
    schema_version: '1.0',
    project: document.getElementById('project-name').textContent,
    created: new Date().toISOString(),
    components, wires
  };
  const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
  download(JSON.stringify(data, null, 2), `${today}_001_schematic.json`, 'application/json');
}

function importJSON() {
  pickFile('.json', text => {
    try {
      const data = JSON.parse(text);
      loadSchematic(data);
    } catch(e) { alert('Invalid JSON file'); }
  });
}

function loadSchematic(data) {
  components = data.components || [];
  wires = data.wires || [];
  nextId = components.length ? Math.max(...components.map(c => c.id)) + 1 : 1;
  selectedId = null;
  showNoSelection();
  zoomFit();
  drawAll();
}

function exportSVG() {
  if (components.length === 0) { alert('Nothing on canvas to export.'); return; }
  let minX=Infinity, maxX=-Infinity, minY=Infinity, maxY=-Infinity;
  components.forEach(c => {
    const def = getLibDef(c.type);
    const hw = (def?.w||40)/2+50, hh = (def?.h||30)/2+50;
    minX=Math.min(minX,c.x-hw); maxX=Math.max(maxX,c.x+hw);
    minY=Math.min(minY,c.y-hh); maxY=Math.max(maxY,c.y+hh);
  });
  wires.forEach(w => {
    minX=Math.min(minX,w.x1-20,w.x2-20); maxX=Math.max(maxX,w.x1+20,w.x2+20);
    minY=Math.min(minY,w.y1-20,w.y2-20); maxY=Math.max(maxY,w.y1+20,w.y2+20);
  });
  const W=maxX-minX, H=maxY-minY;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${minX} ${minY} ${W} ${H}" style="background:#0a0d0f">`;
  svg += `<style>text{font-family:monospace}</style>`;
  for (const w of wires) {
    svg += `<line x1="${w.x1}" y1="${w.y1}" x2="${w.x2}" y2="${w.y2}" stroke="#00e5ff" stroke-width="1.5" stroke-linecap="round"/>`;
  }
  for (const comp of components) {
    const def = getLibDef(comp.type);
    svg += `<text x="${comp.x}" y="${comp.y-(def?.h||30)/2-6}" text-anchor="middle" font-size="10" fill="#4a8aa0">${comp.ref||''}</text>`;
    svg += `<text x="${comp.x}" y="${comp.y+(def?.h||30)/2+14}" text-anchor="middle" font-size="9" fill="#6a9ab0">${comp.value||''}</text>`;
  }
  svg += '</svg>';
  const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
  download(svg, `${today}_001_schematic.svg`, 'image/svg+xml');
}

function clearAll() {
  if (!confirm('Clear canvas? This cannot be undone.')) return;
  components=[]; wires=[]; selectedId=null;
  clearRefCounters();
  showNoSelection(); drawAll();
}

// ── UTILITIES ────────────────────────────────────────────────────────────

function download(content, filename, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = filename;
  a.click();
}

function pickFile(accept, cb) {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = accept;
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => cb(ev.target.result);
    reader.readAsText(file);
  };
  input.click();
}

// ── INIT ─────────────────────────────────────────────────────────────────

initView();
buildLibrary();
resizeCanvases();
