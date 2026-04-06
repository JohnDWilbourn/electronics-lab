// symbols.js — Component draw functions
// LAB//NOTEBOOK Schematic Editor
// ANSI/IEEE standard symbols throughout — no creative interpretation
// ctx is pre-translated to component center

// ── HELPERS ──────────────────────────────────────────────────────────────

function symColor(comp, base) {
  return comp.selected ? '#00e5ff' : base;
}

function filledArrow(ctx, x1, y1, x2, y2, size) {
  // Filled arrowhead at (x2,y2) pointing from (x1,y1)
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - size * Math.cos(angle - 0.4), y2 - size * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - size * Math.cos(angle + 0.4), y2 - size * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();
}

// ── GENERIC DIP IC ────────────────────────────────────────────────────────

function drawDIP(ctx, comp) {
  const def = getLibDef(comp.type);
  if (!def) return;
  const w = def.w, h = def.h;
  const col = symColor(comp, '#4a8aa0');
  const fill = comp.selected ? 'rgba(0,229,255,0.08)' : 'rgba(13,20,25,0.95)';

  ctx.lineWidth = 1.5 / viewScale;
  ctx.fillStyle = fill;
  ctx.strokeStyle = col;
  ctx.beginPath();
  ctx.rect(-w / 2, -h / 2, w, h);
  ctx.fill();
  ctx.stroke();

  // Pin 1 notch (semicircle on top-left)
  ctx.beginPath();
  ctx.arc(-w / 2 + 10, -h / 2, 5 / viewScale, 0, Math.PI);
  ctx.stroke();

  // IC type label
  ctx.fillStyle = comp.selected ? '#00e5ff' : '#c8d8e0';
  ctx.font = `bold ${Math.min(14, 11 * (w / 60)) / viewScale}px Barlow Condensed`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(def.icLabel || comp.type.toUpperCase(), 0, 0);

  // Pin stubs, numbers, names
  for (const pin of (def.pins || [])) {
    const isLeft = pin.x < 0;

    // Stub
    ctx.strokeStyle = symColor(comp, '#c8d8e0');
    ctx.lineWidth = 1.5 / viewScale;
    ctx.beginPath();
    ctx.moveTo(isLeft ? -w / 2 : w / 2, pin.y);
    ctx.lineTo(isLeft ? pin.x + 10 : pin.x - 10, pin.y);
    ctx.stroke();

    // Pin number — outside body
    ctx.fillStyle = '#ff6b00';
    ctx.font = `bold ${11 / viewScale}px Share Tech Mono`;
    ctx.textAlign = isLeft ? 'right' : 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(pin.num, isLeft ? pin.x - 5 / viewScale : pin.x + 5 / viewScale, pin.y);

    // Pin name — inside body
    ctx.fillStyle = comp.selected ? '#00e5ff' : '#8ab8c8';
    ctx.font = `${10 / viewScale}px Share Tech Mono`;
    ctx.textAlign = isLeft ? 'left' : 'right';
    ctx.fillText(pin.name, isLeft ? -w / 2 + 4 / viewScale : w / 2 - 4 / viewScale, pin.y);
  }
}

// ── PASSIVES — ANSI/IEEE ──────────────────────────────────────────────────

// Resistor: ANSI zigzag
function drawResistor(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-30, 0); ctx.lineTo(-15, 0);
  ctx.moveTo(15, 0);  ctx.lineTo(30, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-15, 0);
  ctx.lineTo(-12, -6); ctx.lineTo(-6, 6); ctx.lineTo(0, -6);
  ctx.lineTo(6, 6);  ctx.lineTo(12, -6); ctx.lineTo(15, 0);
  ctx.stroke();
}

// Capacitor: two equal parallel vertical lines (non-polarized)
function drawCapacitor(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(-4, 0);
  ctx.moveTo(4, 0);   ctx.lineTo(20, 0);
  ctx.moveTo(-4, -12); ctx.lineTo(-4, 12);
  ctx.moveTo(4, -12);  ctx.lineTo(4, 12);
  ctx.stroke();
}

// Electrolytic: straight plate (−) + curved plate (+), + sign
function drawCapElec(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Leads
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(-4, 0);
  ctx.moveTo(4, 0);   ctx.lineTo(20, 0);
  ctx.stroke();
  // Negative plate — straight
  ctx.beginPath();
  ctx.moveTo(4, -12); ctx.lineTo(4, 12);
  ctx.stroke();
  // Positive plate — curved (bows away from negative)
  ctx.beginPath();
  ctx.moveTo(-4, -12);
  ctx.bezierCurveTo(-9, -12, -9, 12, -4, 12);
  ctx.stroke();
  // + marker
  ctx.fillStyle = col;
  ctx.font = `bold ${11 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('+', -10, -14 / viewScale);
}

// Inductor: 4 bumps above the line (ANSI — arcs above baseline)
function drawInductor(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Lead lines
  ctx.beginPath();
  ctx.moveTo(-30, 0); ctx.lineTo(-20, 0);
  ctx.moveTo(20, 0);  ctx.lineTo(30, 0);
  ctx.stroke();
  // 4 semicircular bumps above the line
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(-14 + i * 9, 0, 5, Math.PI, 0, false);
    ctx.stroke();
  }
  // Connect bump endpoints along baseline
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(20, 0);
  ctx.stroke();
}

// Potentiometer: ANSI zigzag + wiper arrow
function drawPot(ctx, comp) {
  drawResistor(ctx, comp);
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Wiper stem
  ctx.beginPath();
  ctx.moveTo(0, -20); ctx.lineTo(0, -8);
  ctx.stroke();
  // Arrowhead pointing down to resistor body
  ctx.fillStyle = col;
  filledArrow(ctx, 0, -20, 0, -7, 5 / viewScale);
}

// Transformer: coupled inductors with core line
function drawTransformer(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Primary coils (left) — bumps facing right
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(-12, -10 + i * 10, 5, Math.PI, 0, false);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-30, -10); ctx.lineTo(-17, -10);
  ctx.moveTo(-30, 10);  ctx.lineTo(-17, 10);
  ctx.moveTo(-12, -10); ctx.lineTo(-12, 10);
  ctx.stroke();
  // Secondary coils (right) — bumps facing left
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(12, -10 + i * 10, 5, 0, Math.PI, false);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(30, -10); ctx.lineTo(17, -10);
  ctx.moveTo(30, 10);  ctx.lineTo(17, 10);
  ctx.moveTo(12, -10); ctx.lineTo(12, 10);
  ctx.stroke();
  // Core lines between windings
  ctx.lineWidth = 2 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-3, -18); ctx.lineTo(-3, 18);
  ctx.moveTo(3, -18);  ctx.lineTo(3, 18);
  ctx.stroke();
}

// Speaker/earpiece
function drawSpeaker(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.rect(-6, -8, 12, 16);
  ctx.moveTo(6, -12); ctx.lineTo(18, -18); ctx.lineTo(18, 18); ctx.lineTo(6, 12);
  ctx.moveTo(-20, 0); ctx.lineTo(-6, 0);
  ctx.stroke();
}

// Crystal
function drawCrystal(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-25, 0); ctx.lineTo(-8, 0);
  ctx.moveTo(8, 0);   ctx.lineTo(25, 0);
  ctx.moveTo(-8, -10); ctx.lineTo(-8, 10);
  ctx.moveTo(8, -10);  ctx.lineTo(8, 10);
  ctx.stroke();
  ctx.fillStyle = comp.selected ? 'rgba(0,229,255,0.1)' : 'rgba(200,216,224,0.12)';
  ctx.beginPath(); ctx.rect(-6, -12, 12, 24); ctx.fill();
  ctx.strokeStyle = col;
  ctx.beginPath(); ctx.rect(-6, -12, 12, 24); ctx.stroke();
}

// Fuse
function drawFuse(ctx, comp) {
  const col = symColor(comp, '#ffd600');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-25, 0); ctx.lineTo(-12, 0);
  ctx.moveTo(12, 0);  ctx.lineTo(25, 0);
  ctx.stroke();
  ctx.beginPath(); ctx.rect(-12, -7, 24, 14); ctx.stroke();
  // Fusible element inside
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-9, 0);
  ctx.lineTo(-6, -4); ctx.lineTo(0, 4); ctx.lineTo(6, -4); ctx.lineTo(9, 0);
  ctx.stroke();
}

// Switch SPST-NO
function drawSwitch(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-25, 0); ctx.lineTo(-8, 0);
  ctx.moveTo(8, 0);   ctx.lineTo(25, 0);
  ctx.stroke();
  // Terminal dots
  ctx.beginPath();
  ctx.arc(-8, 0, 2.5 / viewScale, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.arc(8, 0, 2.5 / viewScale, 0, Math.PI * 2); ctx.fill();
  // Blade — open position angled up
  ctx.beginPath();
  ctx.moveTo(-8, 0); ctx.lineTo(6, -9);
  ctx.stroke();
}

// ── DIODES — ANSI/IEEE ────────────────────────────────────────────────────
// Convention: anode left (A), cathode right (K)
// Triangle points right (direction of conventional current)

function drawDiode(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Leads
  ctx.beginPath();
  ctx.moveTo(-25, 0); ctx.lineTo(-10, 0);
  ctx.moveTo(10, 0);  ctx.lineTo(25, 0);
  ctx.stroke();
  // Triangle (filled) — anode at left tip, base at cathode
  ctx.beginPath();
  ctx.moveTo(-10, -10); ctx.lineTo(10, 0); ctx.lineTo(-10, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Cathode bar
  ctx.beginPath();
  ctx.moveTo(10, -10); ctx.lineTo(10, 10);
  ctx.stroke();
}

function drawZener(ctx, comp) {
  drawDiode(ctx, comp);
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Zener bars — angled at top and bottom of cathode
  ctx.beginPath();
  ctx.moveTo(10, -10); ctx.lineTo(15, -10);
  ctx.moveTo(10, 10);  ctx.lineTo(5, 10);
  ctx.stroke();
}

function drawSchottky(ctx, comp) {
  drawDiode(ctx, comp);
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Schottky S-curve at cathode ends
  ctx.beginPath();
  ctx.moveTo(10, -10); ctx.lineTo(10, -7); ctx.lineTo(7, -7);
  ctx.moveTo(10, 10);  ctx.lineTo(10, 7);  ctx.lineTo(13, 7);
  ctx.stroke();
}

function drawLED(ctx, comp) {
  drawDiode(ctx, comp);
  const col = symColor(comp, '#ffd600');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Two arrows indicating emitted light — angled up-right from junction
  const ax = 0, ay = -6;
  // Arrow 1
  ctx.beginPath();
  ctx.moveTo(ax, ay); ctx.lineTo(ax + 10, ay - 10);
  ctx.stroke();
  filledArrow(ctx, ax, ay, ax + 10, ay - 10, 5 / viewScale);
  // Arrow 2 (offset)
  ctx.beginPath();
  ctx.moveTo(ax + 5, ay + 2); ctx.lineTo(ax + 15, ay - 8);
  ctx.stroke();
  filledArrow(ctx, ax + 5, ay + 2, ax + 15, ay - 8, 5 / viewScale);
}

function drawPhotodiode(ctx, comp) {
  drawDiode(ctx, comp);
  const col = symColor(comp, '#ffd600');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Two arrows indicating incoming light — pointing toward junction
  const ax = 0, ay = -6;
  ctx.beginPath();
  ctx.moveTo(ax - 12, ay - 12); ctx.lineTo(ax, ay);
  ctx.stroke();
  filledArrow(ctx, ax - 12, ay - 12, ax, ay, 5 / viewScale);
  ctx.beginPath();
  ctx.moveTo(ax - 7, ay - 16); ctx.lineTo(ax + 5, ay - 4);
  ctx.stroke();
  filledArrow(ctx, ax - 7, ay - 16, ax + 5, ay - 4, 5 / viewScale);
}

function drawVaricap(ctx, comp) {
  // Diode symbol with capacitor plates added at cathode
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-25, 0); ctx.lineTo(-10, 0);
  ctx.moveTo(10, 0);  ctx.lineTo(14, 0);
  ctx.moveTo(20, 0);  ctx.lineTo(25, 0);
  ctx.stroke();
  // Triangle
  ctx.beginPath();
  ctx.moveTo(-10, -10); ctx.lineTo(10, 0); ctx.lineTo(-10, 10);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Cathode bar
  ctx.beginPath(); ctx.moveTo(10, -10); ctx.lineTo(10, 10); ctx.stroke();
  // Capacitor plates
  ctx.beginPath();
  ctx.moveTo(14, -8); ctx.lineTo(14, 8);
  ctx.moveTo(20, -8); ctx.lineTo(20, 8);
  ctx.stroke();
}

// ── BJTs — ANSI/IEEE ──────────────────────────────────────────────────────
// Circle enclosure, vertical base line, angled C/E leads
// NPN: emitter arrow pointing OUT (away from base)
// PNP: emitter arrow pointing IN (toward base)

function drawNPN(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;

  // Enclosing circle
  ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.stroke();

  // Base lead (left)
  ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-7, 0); ctx.stroke();

  // Vertical base bar
  ctx.lineWidth = 2 / viewScale;
  ctx.beginPath(); ctx.moveTo(-7, -12); ctx.lineTo(-7, 12); ctx.stroke();
  ctx.lineWidth = 1.5 / viewScale;

  // Collector — angled from base bar up-right to circle edge, then out
  ctx.beginPath(); ctx.moveTo(-7, -8); ctx.lineTo(10, -16); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, -16); ctx.lineTo(18, -26); ctx.stroke();

  // Emitter — angled from base bar down-right to circle edge, then out with arrow
  ctx.beginPath(); ctx.moveTo(-7, 8); ctx.lineTo(10, 16); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, 16); ctx.lineTo(18, 26); ctx.stroke();

  // Arrow on emitter — NPN points OUTWARD (away from base bar)
  ctx.fillStyle = col;
  filledArrow(ctx, 10, 16, 18, 26, 6 / viewScale);
}

function drawPNP(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;

  // Enclosing circle
  ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.stroke();

  // Base lead
  ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-7, 0); ctx.stroke();

  // Vertical base bar
  ctx.lineWidth = 2 / viewScale;
  ctx.beginPath(); ctx.moveTo(-7, -12); ctx.lineTo(-7, 12); ctx.stroke();
  ctx.lineWidth = 1.5 / viewScale;

  // Collector
  ctx.beginPath(); ctx.moveTo(-7, -8); ctx.lineTo(10, -16); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, -16); ctx.lineTo(18, -26); ctx.stroke();

  // Emitter lead
  ctx.beginPath(); ctx.moveTo(-7, 8); ctx.lineTo(10, 16); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, 16); ctx.lineTo(18, 26); ctx.stroke();

  // Arrow on emitter — PNP points INWARD (toward base bar)
  ctx.fillStyle = col;
  filledArrow(ctx, 18, 26, 10, 16, 6 / viewScale);
}

// ── FETs — ANSI/IEEE ──────────────────────────────────────────────────────
// Enhancement MOSFET: broken channel (three segments)
// Depletion MOSFET: solid channel
// Arrow on body connection indicates channel type (N: inward, P: outward)
// Body diode shown explicitly

function _drawMOSFETBase(ctx, comp, enhancement, nType) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;

  // Enclosing circle
  ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.stroke();

  // Gate lead (left)
  ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-14, 0); ctx.stroke();

  // Gate bar (insulated — gap between gate and channel)
  ctx.lineWidth = 2 / viewScale;
  ctx.beginPath(); ctx.moveTo(-14, -14); ctx.lineTo(-14, 14); ctx.stroke();
  ctx.lineWidth = 1.5 / viewScale;

  // Channel — three broken segments for enhancement, solid for depletion
  if (enhancement) {
    ctx.beginPath(); ctx.moveTo(-8, -14); ctx.lineTo(-8, -6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-8, -3);  ctx.lineTo(-8, 3);  ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-8, 6);   ctx.lineTo(-8, 14); ctx.stroke();
  } else {
    ctx.lineWidth = 2.5 / viewScale;
    ctx.beginPath(); ctx.moveTo(-8, -14); ctx.lineTo(-8, 14); ctx.stroke();
    ctx.lineWidth = 1.5 / viewScale;
  }

  // Drain connection (top) — horizontal then up
  ctx.beginPath(); ctx.moveTo(-8, -10); ctx.lineTo(4, -10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(4, -10);  ctx.lineTo(4, -22); ctx.stroke();

  // Source connection (bottom) — horizontal then down
  ctx.beginPath(); ctx.moveTo(-8, 10);  ctx.lineTo(4, 10);  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(4, 10);   ctx.lineTo(4, 22);  ctx.stroke();

  // Body connection — vertical line connecting D/S midpoints
  ctx.beginPath(); ctx.moveTo(4, -10); ctx.lineTo(4, 10); ctx.stroke();

  // Body arrow — N-type: arrow points INTO channel (right), P-type: points out (left)
  if (nType) {
    filledArrow(ctx, -14, 0, -8, 0, 5 / viewScale);
  } else {
    filledArrow(ctx, -8, 0, -14, 0, 5 / viewScale);
  }

  // Body diode — source to drain
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1 / viewScale;
  // Diode triangle at source side
  ctx.beginPath();
  ctx.moveTo(10, 10); ctx.lineTo(10, -10); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(8, -6); ctx.lineTo(10, -10); ctx.lineTo(12, -6);
  ctx.closePath(); ctx.fill();
  // Connect body diode
  ctx.beginPath();
  ctx.moveTo(4, -10); ctx.lineTo(10, -10);
  ctx.moveTo(4, 10);  ctx.lineTo(10, 10);
  ctx.stroke();
}

function drawNMOSE(ctx, comp) { _drawMOSFETBase(ctx, comp, true,  true);  }
function drawPMOSE(ctx, comp) { _drawMOSFETBase(ctx, comp, true,  false); }
function drawNMOSD(ctx, comp) { _drawMOSFETBase(ctx, comp, false, true);  }
function drawPMOSD(ctx, comp) { _drawMOSFETBase(ctx, comp, false, false); }

// ── JFETs — ANSI/IEEE ────────────────────────────────────────────────────
// No circle. Vertical channel line. Gate arrow touches channel directly.
// N-JFET: gate arrow points INTO channel
// P-JFET: gate arrow points OUT FROM channel

function drawNJFET(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;

  // Vertical channel line
  ctx.lineWidth = 2 / viewScale;
  ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, 20); ctx.stroke();
  ctx.lineWidth = 1.5 / viewScale;

  // Drain (top)
  ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(20, -12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20, -12); ctx.lineTo(20, -25); ctx.stroke();

  // Source (bottom)
  ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(20, 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20, 12); ctx.lineTo(20, 25); ctx.stroke();

  // Gate lead — horizontal from left to channel
  ctx.beginPath(); ctx.moveTo(-25, 0); ctx.lineTo(-4, 0); ctx.stroke();

  // Gate arrow — N-JFET points INTO channel (rightward)
  filledArrow(ctx, -10, 0, 0, 0, 6 / viewScale);
}

function drawPJFET(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;

  // Vertical channel line
  ctx.lineWidth = 2 / viewScale;
  ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, 20); ctx.stroke();
  ctx.lineWidth = 1.5 / viewScale;

  // Drain (top)
  ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(20, -12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20, -12); ctx.lineTo(20, -25); ctx.stroke();

  // Source (bottom)
  ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(20, 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20, 12); ctx.lineTo(20, 25); ctx.stroke();

  // Gate lead
  ctx.beginPath(); ctx.moveTo(-25, 0); ctx.lineTo(-4, 0); ctx.stroke();

  // Gate arrow — P-JFET points OUT FROM channel (leftward)
  filledArrow(ctx, 0, 0, -10, 0, 6 / viewScale);
}

// ── THERMAL ───────────────────────────────────────────────────────────────

function drawPeltier(ctx, comp) {
  const col = symColor(comp, '#00bcd4');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.fillStyle = comp.selected ? 'rgba(0,229,255,0.06)' : 'rgba(0,30,40,0.9)';
  ctx.beginPath(); ctx.rect(-30, -20, 60, 40); ctx.fill(); ctx.stroke();
  // Pellet pairs
  ctx.lineWidth = 1 / viewScale;
  for (let i = -2; i <= 2; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#1a4a5a' : '#2a1a0a';
    ctx.fillRect(i * 10 - 3, -8, 6, 16);
    ctx.strokeStyle = col;
    ctx.strokeRect(i * 10 - 3, -8, 6, 16);
  }
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-30, -8); ctx.lineTo(-40, -8);
  ctx.moveTo(-30, 8);  ctx.lineTo(-40, 8);
  ctx.moveTo(-20, -20); ctx.lineTo(-20, -28);
  ctx.moveTo(20, -20);  ctx.lineTo(20, -28);
  ctx.moveTo(-20, 20);  ctx.lineTo(-20, 28);
  ctx.moveTo(20, 20);   ctx.lineTo(20, 28);
  ctx.stroke();
  ctx.fillStyle = '#00e5ff';
  ctx.font = `${9 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillText('COLD', 0, -20);
  ctx.fillStyle = '#ff6b00';
  ctx.textBaseline = 'top';
  ctx.fillText('HOT', 0, 20);
}

// NTC Thermistor: ANSI resistor + diagonal line + NTC label
function drawNTC(ctx, comp) {
  drawResistor(ctx, comp);
  const col = symColor(comp, '#ffd600');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-10, 14); ctx.lineTo(10, -14);
  ctx.moveTo(6, -14); ctx.lineTo(10, -14); ctx.lineTo(10, -10);
  ctx.stroke();
  ctx.fillStyle = col;
  ctx.font = `bold ${9 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('NTC', 0, 12);
}

// PTC Thermistor
function drawPTC(ctx, comp) {
  drawResistor(ctx, comp);
  const col = symColor(comp, '#ff6b00');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-10, 14); ctx.lineTo(10, -14);
  ctx.moveTo(6, -14); ctx.lineTo(10, -14); ctx.lineTo(10, -10);
  ctx.stroke();
  ctx.fillStyle = col;
  ctx.font = `bold ${9 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('PTC', 0, 12);
}

// Thermocouple
function drawThermocouple(ctx, comp) {
  const col = symColor(comp, '#ffd600');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-25, 0); ctx.lineTo(0, 0);
  ctx.arc(0, 0, 8, Math.PI, 0, false);
  ctx.moveTo(8, 0); ctx.lineTo(25, 0);
  ctx.stroke();
  ctx.fillStyle = col;
  ctx.font = `bold ${9 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillText('TC', 0, -10);
}

// ── OPTICAL / IR ──────────────────────────────────────────────────────────

function drawIRLED(ctx, comp) {
  drawDiode(ctx, comp);
  const col = symColor(comp, '#8b5cf6');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Two emission arrows angled up-right
  ctx.beginPath(); ctx.moveTo(2, -8); ctx.lineTo(12, -18); ctx.stroke();
  filledArrow(ctx, 2, -8, 12, -18, 5 / viewScale);
  ctx.beginPath(); ctx.moveTo(7, -6); ctx.lineTo(17, -16); ctx.stroke();
  filledArrow(ctx, 7, -6, 17, -16, 5 / viewScale);
  ctx.fillStyle = col;
  ctx.font = `${8 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('IR', 14, -12);
}

function drawIRReceiver(ctx, comp) {
  const col = symColor(comp, '#8b5cf6');
  ctx.strokeStyle = col;
  ctx.fillStyle = comp.selected ? 'rgba(0,229,255,0.06)' : 'rgba(13,20,25,0.9)';
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.rect(-15, -18, 30, 36); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col;
  ctx.font = `bold ${9 / viewScale}px Barlow Condensed`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('IR RX', 0, 0);
  ctx.strokeStyle = col;
  ctx.beginPath();
  ctx.moveTo(-15, -10); ctx.lineTo(-28, -10);
  ctx.moveTo(-15, 0);   ctx.lineTo(-28, 0);
  ctx.moveTo(-15, 10);  ctx.lineTo(-28, 10);
  ctx.stroke();
}

function drawIRPhototransistor(ctx, comp) {
  drawNPN(ctx, comp);
  const col = symColor(comp, '#8b5cf6');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Two incoming light arrows
  ctx.beginPath(); ctx.moveTo(-18, -22); ctx.lineTo(-8, -12); ctx.stroke();
  filledArrow(ctx, -18, -22, -8, -12, 5 / viewScale);
  ctx.beginPath(); ctx.moveTo(-12, -26); ctx.lineTo(-2, -16); ctx.stroke();
  filledArrow(ctx, -12, -26, -2, -16, 5 / viewScale);
}

function drawSolarCell(ctx, comp) {
  const col = symColor(comp, '#ffd600');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Diode base (solar cell is a large area diode)
  ctx.beginPath();
  ctx.moveTo(-25, 0); ctx.lineTo(-10, 0);
  ctx.moveTo(10, 0);  ctx.lineTo(25, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-10, -12); ctx.lineTo(10, 0); ctx.lineTo(-10, 12);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, -12); ctx.lineTo(10, 12); ctx.stroke();
  // Sun symbol
  ctx.lineWidth = 1 / viewScale;
  for (let a = 0; a < 360; a += 45) {
    const r = a * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(22 + Math.cos(r) * 7, -14 + Math.sin(r) * 7);
    ctx.lineTo(22 + Math.cos(r) * 12, -14 + Math.sin(r) * 12);
    ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(22, -14, 5, 0, Math.PI * 2); ctx.stroke();
}

// ── ELECTROMECHANICAL ────────────────────────────────────────────────────

function drawRelay(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Coil box
  ctx.beginPath(); ctx.rect(-22, -14, 22, 28); ctx.stroke();
  ctx.fillStyle = col;
  ctx.font = `${8 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('COIL', -11, 0);
  // Coil leads
  ctx.beginPath();
  ctx.moveTo(-22, -7); ctx.lineTo(-35, -7);
  ctx.moveTo(-22, 7);  ctx.lineTo(-35, 7);
  ctx.stroke();
  // Armature pivot
  ctx.beginPath(); ctx.arc(0, -7, 2.5 / viewScale, 0, Math.PI * 2); ctx.fill();
  // Moving contact blade — angled open
  ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(22, -20); ctx.stroke();
  // Fixed contacts
  ctx.beginPath();
  ctx.moveTo(22, -7);  ctx.lineTo(35, -7);   // COM
  ctx.moveTo(22, -22); ctx.lineTo(35, -22);  // NO
  ctx.stroke();
  ctx.font = `${8 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'left';
  ctx.fillText('NO', 37, -22);
  ctx.fillText('COM', 37, -7);
}

// ── POWER — ANSI/IEEE ─────────────────────────────────────────────────────

// VCC: arrow pointing up with label
function drawVCC(ctx, comp) {
  const col = symColor(comp, '#ff6b00');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Vertical stem
  ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(0, 4); ctx.stroke();
  // Arrow pointing up
  filledArrow(ctx, 0, 18, 0, 0, 8 / viewScale);
  // Small circle at base (connection point)
  ctx.beginPath(); ctx.arc(0, 18, 2.5 / viewScale, 0, Math.PI * 2); ctx.fill();
  // Label
  ctx.font = `bold ${11 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillText(comp.value || 'VCC', 0, -2 / viewScale);
}

// GND: single horizontal bar (digital ground)
function drawGND(ctx, comp) {
  const col = symColor(comp, '#4a8070');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Stem
  ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(0, 0); ctx.stroke();
  // Single bar
  ctx.lineWidth = 2 / viewScale;
  ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(14, 0); ctx.stroke();
  // Connection dot
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath(); ctx.arc(0, -18, 2.5 / viewScale, 0, Math.PI * 2); ctx.fill();
}

// AGND: three decreasing bars (analog ground)
function drawAGND(ctx, comp) {
  const col = symColor(comp, '#4a8070');
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(0, 0); ctx.stroke();
  ctx.lineWidth = 2 / viewScale;
  ctx.beginPath(); ctx.moveTo(-14, 0);  ctx.lineTo(14, 0);  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-9, 6);   ctx.lineTo(9, 6);   ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-4, 12);  ctx.lineTo(4, 12);  ctx.stroke();
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath(); ctx.arc(0, -18, 2.5 / viewScale, 0, Math.PI * 2); ctx.fill();
}

function drawBattery(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Leads
  ctx.beginPath();
  ctx.moveTo(0, -25); ctx.lineTo(0, -8);
  ctx.moveTo(0, 8);   ctx.lineTo(0, 25);
  ctx.stroke();
  // Long thin line = positive
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.moveTo(-12, -8); ctx.lineTo(12, -8); ctx.stroke();
  // Short thick line = negative
  ctx.lineWidth = 3 / viewScale;
  ctx.beginPath(); ctx.moveTo(-7, 8); ctx.lineTo(7, 8); ctx.stroke();
  ctx.lineWidth = 1.5 / viewScale;
  // + and − labels
  ctx.fillStyle = symColor(comp, '#ffd600');
  ctx.font = `bold ${10 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center';
  ctx.fillText('+', -18, -6 / viewScale);
  ctx.fillText('−', -18, 10 / viewScale);
}

function drawJack(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.rect(-12, -18, 24, 36); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-20, -12); ctx.lineTo(-12, -12);
  ctx.moveTo(-20, 12);  ctx.lineTo(-12, 12);
  ctx.moveTo(12, 0);    ctx.lineTo(20, 0);
  ctx.stroke();
}

// ── RF ────────────────────────────────────────────────────────────────────

function drawAntenna(ctx, comp) {
  const col = symColor(comp, '#39ff14');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Vertical mast
  ctx.beginPath(); ctx.moveTo(0, 25); ctx.lineTo(0, -8); ctx.stroke();
  // Three horizontal elements — decreasing size upward
  ctx.beginPath();
  ctx.moveTo(-18, -8);  ctx.lineTo(18, -8);
  ctx.moveTo(-12, -18); ctx.lineTo(12, -18);
  ctx.moveTo(-6, -28);  ctx.lineTo(6, -28);
  ctx.stroke();
  // Connection dot at base
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(0, 25, 2.5 / viewScale, 0, Math.PI * 2); ctx.fill();
}

function drawVarCap(ctx, comp) {
  drawCapacitor(ctx, comp);
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1 / viewScale;
  // Diagonal arrow through symbol
  ctx.beginPath();
  ctx.moveTo(-16, 14); ctx.lineTo(16, -14);
  ctx.stroke();
  ctx.fillStyle = col;
  filledArrow(ctx, -16, 14, 16, -14, 5 / viewScale);
}

// ── TEST INSTRUMENTS ──────────────────────────────────────────────────────

function drawMultimeter(ctx, comp) {
  const col = symColor(comp, '#4a8aa0');
  ctx.strokeStyle = col;
  ctx.fillStyle = comp.selected ? 'rgba(0,229,255,0.06)' : 'rgba(13,20,25,0.9)';
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.rect(-40, -30, 80, 60); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#020d0f';
  ctx.strokeStyle = comp.selected ? '#00e5ff' : '#1e3a40';
  ctx.beginPath(); ctx.rect(-30, -22, 40, 20); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#39ff14';
  ctx.font = `bold ${10 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('0.000', -10, -12);
  ctx.fillStyle = col;
  ctx.font = `bold ${9 / viewScale}px Barlow Condensed`;
  ctx.fillText('DMM', -20, 10);
  ctx.strokeStyle = col;
  ctx.beginPath(); ctx.arc(18, 8, 10, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = symColor(comp, '#ff6b00');
  ctx.beginPath(); ctx.moveTo(18, 8); ctx.lineTo(18, -2); ctx.stroke();
}

function drawOscilloscope(ctx, comp) {
  const col = symColor(comp, '#4a8aa0');
  ctx.strokeStyle = col;
  ctx.fillStyle = comp.selected ? 'rgba(0,229,255,0.06)' : 'rgba(13,20,25,0.9)';
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.rect(-50, -40, 100, 80); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#020d0f';
  ctx.strokeStyle = comp.selected ? '#00e5ff' : '#1e3a40';
  ctx.beginPath(); ctx.rect(-42, -32, 54, 38); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,100,120,0.5)';
  ctx.lineWidth = 0.5 / viewScale;
  for (let i = -24; i <= 6; i += 12) {
    ctx.beginPath(); ctx.moveTo(-42, i); ctx.lineTo(12, i); ctx.stroke();
  }
  ctx.strokeStyle = symColor(comp, '#39ff14');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  for (let px = -40; px <= 10; px += 2) {
    const py = -13 + Math.sin((px + 40) * 0.22) * 10;
    px === -40 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.fillStyle = col;
  ctx.font = `bold ${9 / viewScale}px Barlow Condensed`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('OSC', 30, 0);
}

function drawFuncGen(ctx, comp) {
  const col = symColor(comp, '#4a8aa0');
  ctx.strokeStyle = col;
  ctx.fillStyle = comp.selected ? 'rgba(0,229,255,0.06)' : 'rgba(13,20,25,0.9)';
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.rect(-45, -35, 90, 70); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#020d0f';
  ctx.strokeStyle = comp.selected ? '#00e5ff' : '#1e3a40';
  ctx.beginPath(); ctx.rect(-38, -28, 48, 20); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#39ff14';
  ctx.font = `${9 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('1.000 kHz', -14, -18);
  ctx.strokeStyle = symColor(comp, '#ffd600');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  for (let px = -36; px <= -24; px++) {
    const py = 2 + Math.sin((px + 36) * 0.5) * 5;
    px === -36 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.fillStyle = col;
  ctx.font = `bold ${9 / viewScale}px Barlow Condensed`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('FUNC GEN', -14, 16);
}

function drawSpectrumAnalyzer(ctx, comp) {
  const col = symColor(comp, '#4a8aa0');
  ctx.strokeStyle = col;
  ctx.fillStyle = comp.selected ? 'rgba(0,229,255,0.06)' : 'rgba(13,20,25,0.9)';
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.rect(-50, -40, 100, 80); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#020d0f';
  ctx.strokeStyle = comp.selected ? '#00e5ff' : '#1e3a40';
  ctx.beginPath(); ctx.rect(-44, -34, 60, 44); ctx.fill(); ctx.stroke();
  const bars = [2, 4, 7, 12, 18, 14, 9, 6, 10, 16, 8, 5, 3];
  bars.forEach((amp, i) => {
    const x = -42 + i * 5;
    const barH = amp * 1.8;
    ctx.fillStyle = amp > 12 ? (comp.selected ? '#00e5ff' : '#ff6b00') : (comp.selected ? 'rgba(0,229,255,0.6)' : '#00e5ff');
    ctx.fillRect(x, 10 - barH, 4, barH);
  });
  ctx.fillStyle = col;
  ctx.font = `bold ${9 / viewScale}px Barlow Condensed`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('SPEC AN', 26, 0);
}
