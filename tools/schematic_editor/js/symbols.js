// symbols.js — Component draw functions
// LAB//NOTEBOOK Schematic Editor
// Each function: drawXxx(ctx, comp)
// ctx is pre-translated to component center, scale applied externally

// ── HELPERS ──────────────────────────────────────────────────────────────

function symColor(comp, base) {
  return comp.selected ? '#00e5ff' : base;
}

function pinDots(ctx, comp, def) {
  if (tool === 'wire' || comp.selected) {
    ctx.fillStyle = '#ff6b00';
    for (const pin of (def?.pins || [])) {
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, 3 / viewScale, 0, Math.PI * 2);
      ctx.fill();
      // Pin number label
      if (pin.num !== undefined) {
        ctx.fillStyle = '#ff6b00';
        ctx.font = `${7 / viewScale}px Share Tech Mono`;
        ctx.textAlign = pin.x < 0 ? 'right' : 'left';
        ctx.textBaseline = 'middle';
        const offset = pin.x < 0 ? -6 / viewScale : 6 / viewScale;
        ctx.fillText(pin.num, pin.x + offset, pin.y);
      }
    }
  }
}

// ── GENERIC DIP IC ────────────────────────────────────────────────────────
// Draws a proper DIP symbol with pin stubs, numbers, and names
// def.pins must have {x, y, num, name}

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

  // Notch on top
  ctx.beginPath();
  ctx.arc(0, -h / 2, 6 / viewScale, 0, Math.PI);
  ctx.stroke();

  // IC type label
  ctx.fillStyle = comp.selected ? '#00e5ff' : '#c8d8e0';
  ctx.font = `bold ${Math.min(10, 8 * (w / 60)) / viewScale}px Barlow Condensed`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(def.icLabel || comp.type.toUpperCase(), 0, 0);

  // Pin stubs and labels
  for (const pin of (def.pins || [])) {
    const isLeft = pin.x < 0;
    const stubEnd = isLeft ? pin.x + 10 : pin.x - 10;

    // Stub line from body edge
    ctx.strokeStyle = symColor(comp, '#c8d8e0');
    ctx.lineWidth = 1.5 / viewScale;
    ctx.beginPath();
    ctx.moveTo(isLeft ? -w / 2 : w / 2, pin.y);
    ctx.lineTo(stubEnd, pin.y);
    ctx.stroke();

    // Pin number (outside body)
    ctx.fillStyle = '#ff6b00';
    ctx.font = `${7 / viewScale}px Share Tech Mono`;
    ctx.textAlign = isLeft ? 'right' : 'left';
    ctx.textBaseline = 'middle';
    const numX = isLeft ? pin.x - 3 / viewScale : pin.x + 3 / viewScale;
    ctx.fillText(pin.num, numX, pin.y);

    // Pin name (inside body edge)
    ctx.fillStyle = comp.selected ? '#00e5ff' : '#8ab8c8';
    ctx.font = `${6.5 / viewScale}px Share Tech Mono`;
    ctx.textAlign = isLeft ? 'left' : 'right';
    const nameX = isLeft ? -w / 2 + 3 / viewScale : w / 2 - 3 / viewScale;
    ctx.fillText(pin.name, nameX, pin.y);
  }
}

// ── PASSIVES ──────────────────────────────────────────────────────────────

function drawResistor(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-30, 0); ctx.lineTo(-12, 0);
  ctx.moveTo(12, 0);  ctx.lineTo(30, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.rect(-12, -6, 24, 12);
  ctx.stroke();
}

function drawCapacitor(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(-4, 0);
  ctx.moveTo(4, 0);   ctx.lineTo(20, 0);
  ctx.moveTo(-4, -10); ctx.lineTo(-4, 10);
  ctx.moveTo(4, -10);  ctx.lineTo(4, 10);
  ctx.stroke();
}

function drawCapElec(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(-4, 0);
  ctx.moveTo(4, 0);   ctx.lineTo(20, 0);
  ctx.moveTo(-4, -10); ctx.lineTo(-4, 10);
  ctx.moveTo(4, -10);
  ctx.bezierCurveTo(8, -10, 8, 10, 4, 10);
  ctx.stroke();
  ctx.fillStyle = symColor(comp, '#c8d8e0');
  ctx.font = `${9 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center';
  ctx.fillText('+', -10, -12 / viewScale);
}

function drawInductor(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-30, 0); ctx.lineTo(-18, 0);
  ctx.moveTo(18, 0);  ctx.lineTo(30, 0);
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(-12 + i * 8, 0, 5, Math.PI, 0);
    ctx.stroke();
  }
}

function drawPot(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-25, 0); ctx.lineTo(-12, 0);
  ctx.moveTo(12, 0);  ctx.lineTo(25, 0);
  ctx.rect(-12, -6, 24, 12);
  ctx.moveTo(0, -6);  ctx.lineTo(0, -20);
  ctx.moveTo(-4, -14); ctx.lineTo(0, -20); ctx.lineTo(4, -14);
  ctx.stroke();
}

function drawTransformer(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.arc(-12, -15 + i * 12, 5, Math.PI, 0); ctx.stroke();
  }
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.arc(12, -15 + i * 12, 5, 0, Math.PI); ctx.stroke();
  }
  ctx.beginPath();
  ctx.setLineDash([2 / viewScale, 2 / viewScale]);
  ctx.moveTo(0, -22); ctx.lineTo(0, 22);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(-30, -15); ctx.lineTo(-17, -15);
  ctx.moveTo(-30, 15);  ctx.lineTo(-17, 15);
  ctx.moveTo(30, -15);  ctx.lineTo(17, -15);
  ctx.moveTo(30, 15);   ctx.lineTo(17, 15);
  ctx.stroke();
}

function drawSpeaker(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.rect(-6, -7, 12, 14);
  ctx.moveTo(6, -10); ctx.lineTo(14, -14); ctx.lineTo(14, 14); ctx.lineTo(6, 10);
  ctx.moveTo(-15, 0); ctx.lineTo(-6, 0);
  ctx.moveTo(14, 0);  ctx.lineTo(20, 0);
  ctx.stroke();
}

// ── DIODES ────────────────────────────────────────────────────────────────

function drawDiode(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(-8, 0);
  ctx.moveTo(8, 0);   ctx.lineTo(20, 0);
  ctx.moveTo(8, -9);  ctx.lineTo(8, 9);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-8, -9); ctx.lineTo(8, 0); ctx.lineTo(-8, 9);
  ctx.closePath();
  ctx.stroke();
}

function drawZener(ctx, comp) {
  drawDiode(ctx, comp);
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(8, -9); ctx.lineTo(12, -9);
  ctx.moveTo(8, 9);  ctx.lineTo(4, 9);
  ctx.stroke();
}

function drawSchottky(ctx, comp) {
  drawDiode(ctx, comp);
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(6, -9); ctx.lineTo(8, -9); ctx.lineTo(8, -6);
  ctx.moveTo(10, 9); ctx.lineTo(8, 9);  ctx.lineTo(8, 6);
  ctx.stroke();
}

function drawLED(ctx, comp) {
  drawDiode(ctx, comp);
  ctx.strokeStyle = symColor(comp, '#ffd600');
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-2, -12); ctx.lineTo(4, -18);
  ctx.moveTo(4, -18);  ctx.lineTo(0, -17); ctx.moveTo(4, -18); ctx.lineTo(3, -14);
  ctx.moveTo(3, -10);  ctx.lineTo(9, -16);
  ctx.moveTo(9, -16);  ctx.lineTo(5, -15); ctx.moveTo(9, -16); ctx.lineTo(8, -12);
  ctx.stroke();
}

function drawPhotodiode(ctx, comp) {
  drawDiode(ctx, comp);
  ctx.strokeStyle = symColor(comp, '#ffd600');
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-6, -18); ctx.lineTo(0, -12);
  ctx.moveTo(0, -12);  ctx.lineTo(-4, -13); ctx.moveTo(0, -12); ctx.lineTo(-1, -8);
  ctx.moveTo(2, -16);  ctx.lineTo(8, -10);
  ctx.moveTo(8, -10);  ctx.lineTo(4, -11); ctx.moveTo(8, -10); ctx.lineTo(7, -6);
  ctx.stroke();
}

function drawVaricap(ctx, comp) {
  drawDiode(ctx, comp);
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath();
  ctx.moveTo(10, -7); ctx.lineTo(10, 7);
  ctx.moveTo(13, -7); ctx.lineTo(13, 7);
  ctx.stroke();
}

// ── BJTs ──────────────────────────────────────────────────────────────────

function drawNPN(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(-5, 0);
  ctx.moveTo(-5, -18); ctx.lineTo(-5, 18);
  ctx.moveTo(-5, -10); ctx.lineTo(20, -15);
  ctx.moveTo(-5, 10);  ctx.lineTo(20, 15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(14, 13); ctx.lineTo(20, 15); ctx.lineTo(16, 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPNP(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(-5, 0);
  ctx.moveTo(-5, -18); ctx.lineTo(-5, 18);
  ctx.moveTo(-5, -10); ctx.lineTo(20, -15);
  ctx.moveTo(-5, 10);  ctx.lineTo(20, 15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-5, -6); ctx.lineTo(-5, -14); ctx.lineTo(-10, -10);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.stroke();
}

// ── FETs ──────────────────────────────────────────────────────────────────

function drawNMOSE(ctx, comp) {
  // N-Channel MOSFET Enhancement
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  // Gate lead
  ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-8, 0); ctx.stroke();
  // Gate bar
  ctx.beginPath(); ctx.moveTo(-8, -14); ctx.lineTo(-8, 14); ctx.stroke();
  // Channel (dashed = enhancement)
  ctx.setLineDash([3 / viewScale, 2 / viewScale]);
  ctx.beginPath(); ctx.moveTo(-4, -14); ctx.lineTo(-4, 14); ctx.stroke();
  ctx.setLineDash([]);
  // Drain and source connections
  ctx.beginPath();
  ctx.moveTo(-4, -10); ctx.lineTo(20, -10); // drain
  ctx.moveTo(-4, 10);  ctx.lineTo(20, 10);  // source
  ctx.moveTo(20, -10); ctx.lineTo(20, -20); // drain lead
  ctx.moveTo(20, 10);  ctx.lineTo(20, 20);  // source lead
  ctx.stroke();
  // Arrow (N-type: inward)
  ctx.beginPath();
  ctx.moveTo(-4, 2); ctx.lineTo(2, 0); ctx.lineTo(-4, -2);
  ctx.fill();
  ctx.stroke();
  // Body diode
  ctx.beginPath();
  ctx.moveTo(12, 10); ctx.lineTo(12, -10);
  ctx.moveTo(8, -6); ctx.lineTo(12, -10); ctx.lineTo(16, -6);
  ctx.stroke();
  // Circle
  ctx.beginPath(); ctx.arc(5, 0, 18, 0, Math.PI * 2); ctx.stroke();
}

function drawPMOSE(ctx, comp) {
  // P-Channel MOSFET Enhancement
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-8, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-8, -14); ctx.lineTo(-8, 14); ctx.stroke();
  ctx.setLineDash([3 / viewScale, 2 / viewScale]);
  ctx.beginPath(); ctx.moveTo(-4, -14); ctx.lineTo(-4, 14); ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(-4, -10); ctx.lineTo(20, -10);
  ctx.moveTo(-4, 10);  ctx.lineTo(20, 10);
  ctx.moveTo(20, -10); ctx.lineTo(20, -20);
  ctx.moveTo(20, 10);  ctx.lineTo(20, 20);
  ctx.stroke();
  // Arrow (P-type: outward)
  ctx.beginPath();
  ctx.moveTo(2, 2); ctx.lineTo(-4, 0); ctx.lineTo(2, -2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath(); ctx.arc(5, 0, 18, 0, Math.PI * 2); ctx.stroke();
}

function drawNMOSD(ctx, comp) {
  // N-Channel MOSFET Depletion — solid channel line
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-8, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-8, -14); ctx.lineTo(-8, 14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-4, -14); ctx.lineTo(-4, 14); ctx.stroke(); // solid
  ctx.beginPath();
  ctx.moveTo(-4, -10); ctx.lineTo(20, -10);
  ctx.moveTo(-4, 10);  ctx.lineTo(20, 10);
  ctx.moveTo(20, -10); ctx.lineTo(20, -20);
  ctx.moveTo(20, 10);  ctx.lineTo(20, 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-4, 2); ctx.lineTo(2, 0); ctx.lineTo(-4, -2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(5, 0, 18, 0, Math.PI * 2); ctx.stroke();
}

function drawPMOSD(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-8, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-8, -14); ctx.lineTo(-8, 14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-4, -14); ctx.lineTo(-4, 14); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-4, -10); ctx.lineTo(20, -10);
  ctx.moveTo(-4, 10);  ctx.lineTo(20, 10);
  ctx.moveTo(20, -10); ctx.lineTo(20, -20);
  ctx.moveTo(20, 10);  ctx.lineTo(20, 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(2, 2); ctx.lineTo(-4, 0); ctx.lineTo(2, -2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(5, 0, 18, 0, Math.PI * 2); ctx.stroke();
}

function drawNJFET(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(0, 0);
  ctx.moveTo(0, -15); ctx.lineTo(0, 15);
  ctx.moveTo(0, -10); ctx.lineTo(20, -10);
  ctx.moveTo(0, 10);  ctx.lineTo(20, 10);
  ctx.moveTo(20, -10); ctx.lineTo(20, -20);
  ctx.moveTo(20, 10);  ctx.lineTo(20, 20);
  ctx.stroke();
  // Arrow on gate (N: into channel)
  ctx.beginPath();
  ctx.moveTo(-6, 0); ctx.lineTo(0, -3); ctx.lineTo(0, 3); ctx.closePath();
  ctx.fill();
}

function drawPJFET(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(0, 0);
  ctx.moveTo(0, -15); ctx.lineTo(0, 15);
  ctx.moveTo(0, -10); ctx.lineTo(20, -10);
  ctx.moveTo(0, 10);  ctx.lineTo(20, 10);
  ctx.moveTo(20, -10); ctx.lineTo(20, -20);
  ctx.moveTo(20, 10);  ctx.lineTo(20, 20);
  ctx.stroke();
  // Arrow on gate (P: away from channel)
  ctx.beginPath();
  ctx.moveTo(0, -3); ctx.lineTo(0, 3); ctx.lineTo(-6, 0); ctx.closePath();
  ctx.fill();
}

// ── THERMAL ───────────────────────────────────────────────────────────────

function drawPeltier(ctx, comp) {
  const col = symColor(comp, '#00bcd4');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.fillStyle = comp.selected ? 'rgba(0,229,255,0.06)' : 'rgba(0,30,40,0.9)';
  ctx.beginPath(); ctx.rect(-30, -20, 60, 40); ctx.fill(); ctx.stroke();
  // Cold side (top)
  ctx.strokeStyle = symColor(comp, '#00e5ff');
  ctx.beginPath(); ctx.moveTo(-20, -20); ctx.lineTo(-20, -28);
  ctx.moveTo(20, -20);  ctx.lineTo(20, -28); ctx.stroke();
  ctx.fillStyle = '#00e5ff';
  ctx.font = `${7 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillText('COLD', 0, -20);
  // Hot side (bottom)
  ctx.strokeStyle = symColor(comp, '#ff6b00');
  ctx.beginPath(); ctx.moveTo(-20, 20); ctx.lineTo(-20, 28);
  ctx.moveTo(20, 20);   ctx.lineTo(20, 28); ctx.stroke();
  ctx.fillStyle = '#ff6b00';
  ctx.textBaseline = 'top';
  ctx.fillText('HOT', 0, 20);
  // Pellet pairs
  ctx.strokeStyle = col;
  ctx.lineWidth = 1 / viewScale;
  for (let i = -2; i <= 2; i++) {
    const x = i * 10;
    ctx.fillStyle = i % 2 === 0 ? '#1a4a5a' : '#2a1a0a';
    ctx.fillRect(x - 3, -8, 6, 16);
    ctx.strokeRect(x - 3, -8, 6, 16);
  }
  // Power pins
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-30, -8); ctx.lineTo(-40, -8);
  ctx.moveTo(-30, 8);  ctx.lineTo(-40, 8);
  ctx.stroke();
  ctx.fillStyle = '#ff6b00';
  ctx.font = `${7 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('+', -42, -8);
  ctx.fillText('−', -42, 8);
}

function drawNTC(ctx, comp) {
  drawResistor(ctx, comp);
  ctx.strokeStyle = symColor(comp, '#ffd600');
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-8, 12); ctx.lineTo(8, -12);
  ctx.moveTo(4, -12); ctx.lineTo(8, -12); ctx.lineTo(8, -8);
  ctx.stroke();
  ctx.fillStyle = symColor(comp, '#ffd600');
  ctx.font = `bold ${8 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('NTC', 0, 10);
}

function drawPTC(ctx, comp) {
  drawResistor(ctx, comp);
  ctx.strokeStyle = symColor(comp, '#ff6b00');
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-8, 12); ctx.lineTo(8, -12);
  ctx.moveTo(4, -12); ctx.lineTo(8, -12); ctx.lineTo(8, -8);
  ctx.stroke();
  ctx.fillStyle = symColor(comp, '#ff6b00');
  ctx.font = `bold ${8 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('PTC', 0, 10);
}

function drawThermocouple(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#ffd600');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(0, 0);
  ctx.arc(0, 0, 8, Math.PI, 0);
  ctx.lineTo(0, 0);
  ctx.moveTo(8, 0); ctx.lineTo(20, 0);
  ctx.stroke();
  ctx.fillStyle = symColor(comp, '#ffd600');
  ctx.font = `${7 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('TC', 0, -10);
}

// ── OPTICAL ───────────────────────────────────────────────────────────────

function drawIRLED(ctx, comp) {
  drawDiode(ctx, comp);
  ctx.strokeStyle = symColor(comp, '#8b5cf6');
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-2, -12); ctx.lineTo(4, -18);
  ctx.moveTo(4, -18);  ctx.lineTo(0, -17); ctx.moveTo(4, -18); ctx.lineTo(3, -14);
  ctx.moveTo(3, -10);  ctx.lineTo(9, -16);
  ctx.moveTo(9, -16);  ctx.lineTo(5, -15); ctx.moveTo(9, -16); ctx.lineTo(8, -12);
  ctx.stroke();
  ctx.fillStyle = symColor(comp, '#8b5cf6');
  ctx.font = `${6 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('IR', 12, -14);
}

function drawIRReceiver(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#8b5cf6');
  ctx.fillStyle = comp.selected ? 'rgba(0,229,255,0.06)' : 'rgba(13,20,25,0.9)';
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.rect(-15, -15, 30, 30); ctx.fill(); ctx.stroke();
  ctx.fillStyle = symColor(comp, '#8b5cf6');
  ctx.font = `bold ${7 / viewScale}px Barlow Condensed`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('IR RX', 0, 0);
  // Leads
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.beginPath();
  ctx.moveTo(-15, -8); ctx.lineTo(-25, -8);
  ctx.moveTo(-15, 0);  ctx.lineTo(-25, 0);
  ctx.moveTo(-15, 8);  ctx.lineTo(-25, 8);
  ctx.stroke();
}

function drawIRPhototransistor(ctx, comp) {
  drawNPN(ctx, comp);
  ctx.strokeStyle = symColor(comp, '#8b5cf6');
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-14, -18); ctx.lineTo(-8, -12);
  ctx.moveTo(-8, -12);  ctx.lineTo(-12, -13); ctx.moveTo(-8, -12); ctx.lineTo(-9, -8);
  ctx.moveTo(-10, -22); ctx.lineTo(-4, -16);
  ctx.moveTo(-4, -16);  ctx.lineTo(-8, -17); ctx.moveTo(-4, -16); ctx.lineTo(-5, -12);
  ctx.stroke();
}

function drawSolarCell(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#ffd600');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(0, -20); ctx.lineTo(0, -6);
  ctx.moveTo(-10, -6); ctx.lineTo(10, -6);
  ctx.moveTo(-6, 0);   ctx.lineTo(6, 0);
  ctx.moveTo(-10, 6);  ctx.lineTo(10, 6);
  ctx.moveTo(0, 6);    ctx.lineTo(0, 20);
  ctx.stroke();
  // Sun rays
  ctx.strokeStyle = symColor(comp, '#ffd600');
  ctx.lineWidth = 0.8 / viewScale;
  for (let a = 0; a < 360; a += 45) {
    const rad = a * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(20 + Math.cos(rad) * 8, -10 + Math.sin(rad) * 8);
    ctx.lineTo(20 + Math.cos(rad) * 13, -10 + Math.sin(rad) * 13);
    ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(20, -10, 6, 0, Math.PI * 2); ctx.stroke();
}

// ── ELECTROMECHANICAL ────────────────────────────────────────────────────

function drawRelay(ctx, comp) {
  const col = symColor(comp, '#c8d8e0');
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5 / viewScale;
  // Coil
  ctx.beginPath(); ctx.rect(-20, -12, 20, 24); ctx.stroke();
  ctx.font = `${7 / viewScale}px Share Tech Mono`;
  ctx.fillStyle = col;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('COIL', -10, 0);
  // Armature
  ctx.beginPath();
  ctx.moveTo(0, -6); ctx.lineTo(20, -6);
  ctx.stroke();
  // Contact (NO)
  ctx.beginPath();
  ctx.moveTo(8, -6); ctx.lineTo(20, 6);
  ctx.stroke();
  ctx.beginPath(); ctx.arc(8, -6, 2, 0, Math.PI * 2); ctx.stroke();
  // COM and NO leads
  ctx.beginPath();
  ctx.moveTo(20, 6); ctx.lineTo(30, 6);
  ctx.moveTo(20, -16); ctx.lineTo(30, -16);
  ctx.stroke();
  ctx.fillStyle = col;
  ctx.font = `${6 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'left';
  ctx.fillText('NO', 32, 6);
  ctx.fillText('COM', 32, -16);
}

function drawCrystal(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(-8, 0);
  ctx.moveTo(8, 0);   ctx.lineTo(20, 0);
  ctx.moveTo(-8, -8); ctx.lineTo(-8, 8);
  ctx.moveTo(8, -8);  ctx.lineTo(8, 8);
  ctx.stroke();
  ctx.fillStyle = comp.selected ? 'rgba(0,229,255,0.1)' : 'rgba(200,216,224,0.15)';
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.beginPath(); ctx.rect(-6, -10, 12, 20); ctx.fill(); ctx.stroke();
}

function drawFuse(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#ffd600');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(-10, 0);
  ctx.moveTo(10, 0);  ctx.lineTo(20, 0);
  ctx.stroke();
  ctx.beginPath(); ctx.rect(-10, -6, 20, 12); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  for (let x = -8; x <= 8; x += 4) {
    ctx.lineTo(x, x % 8 === 0 ? 4 : -4);
  }
  ctx.lineTo(8, 0);
  ctx.stroke();
}

function drawSwitch(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(-8, 0);
  ctx.moveTo(8, 0);   ctx.lineTo(20, 0);
  ctx.stroke();
  ctx.beginPath(); ctx.arc(-8, 0, 2, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(8, 0, 2, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(6, -8); ctx.stroke();
}

// ── POWER / CONNECTORS ────────────────────────────────────────────────────

function drawVCC(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#ff6b00');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(0, 15); ctx.lineTo(0, 0);
  ctx.moveTo(-10, 0); ctx.lineTo(10, 0);
  ctx.stroke();
  ctx.fillStyle = symColor(comp, '#ff6b00');
  ctx.font = `bold ${10 / viewScale}px Barlow Condensed`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(comp.value || 'VCC', 0, -2 / viewScale);
}

function drawGND(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#4a6070');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(0, -15); ctx.lineTo(0, 0);
  ctx.moveTo(-12, 0); ctx.lineTo(12, 0);
  ctx.moveTo(-8, 4);  ctx.lineTo(8, 4);
  ctx.moveTo(-4, 8);  ctx.lineTo(4, 8);
  ctx.stroke();
}

function drawBattery(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(0, -20); ctx.lineTo(0, -6);
  ctx.moveTo(0, 6);   ctx.lineTo(0, 20);
  ctx.moveTo(-10, -6); ctx.lineTo(10, -6);
  ctx.moveTo(-6, 0);   ctx.lineTo(6, 0);
  ctx.moveTo(-10, 6);  ctx.lineTo(10, 6);
  ctx.stroke();
  ctx.fillStyle = symColor(comp, '#ffd600');
  ctx.font = `${8 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center';
  ctx.fillText('+', -14 / viewScale, -4 / viewScale);
  ctx.fillText('−', -14 / viewScale, 8 / viewScale);
}

function drawJack(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath(); ctx.rect(-10, -15, 20, 30); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-15, -10); ctx.lineTo(-10, -10);
  ctx.moveTo(-15, 10);  ctx.lineTo(-10, 10);
  ctx.moveTo(10, 0);    ctx.lineTo(15, 0);
  ctx.stroke();
}

// ── RF ────────────────────────────────────────────────────────────────────

function drawAntenna(ctx, comp) {
  ctx.strokeStyle = symColor(comp, '#39ff14');
  ctx.lineWidth = 1.5 / viewScale;
  ctx.beginPath();
  ctx.moveTo(0, 20);   ctx.lineTo(0, -10);
  ctx.moveTo(-15, -10); ctx.lineTo(15, -10);
  ctx.moveTo(-10, -20); ctx.lineTo(10, -20);
  ctx.moveTo(-5, -30);  ctx.lineTo(5, -30);
  ctx.stroke();
}

function drawVarCap(ctx, comp) {
  drawCapacitor(ctx, comp);
  ctx.strokeStyle = symColor(comp, '#c8d8e0');
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath();
  ctx.moveTo(-14, 12); ctx.lineTo(14, -12);
  ctx.moveTo(10, -12); ctx.lineTo(14, -12); ctx.lineTo(14, -8);
  ctx.stroke();
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
  ctx.font = `bold ${9 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('0.000', -10, -12);
  ctx.fillStyle = col;
  ctx.font = `bold ${8 / viewScale}px Barlow Condensed`;
  ctx.fillText('DMM', -20, 10);
  ctx.strokeStyle = col;
  ctx.beginPath(); ctx.arc(16, 8, 10, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = symColor(comp, '#ff6b00');
  ctx.beginPath(); ctx.moveTo(16, 8); ctx.lineTo(16, -2); ctx.stroke();
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
  ctx.font = `bold ${8 / viewScale}px Barlow Condensed`;
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
  ctx.font = `${8 / viewScale}px Share Tech Mono`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('1.000 kHz', -14, -18);
  ctx.strokeStyle = symColor(comp, '#ffd600');
  ctx.lineWidth = 1 / viewScale;
  ctx.beginPath();
  for (let px = -36; px <= -24; px++) {
    const py = 2 + Math.sin((px + 36) * 0.5) * 4;
    px === -36 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.fillStyle = col;
  ctx.font = `bold ${8 / viewScale}px Barlow Condensed`;
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
  ctx.font = `bold ${8 / viewScale}px Barlow Condensed`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('SPEC AN', 26, 0);
}
