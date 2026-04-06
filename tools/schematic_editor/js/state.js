// state.js — Application state and constants
// LAB//NOTEBOOK Schematic Editor

const GRID = 20;
const PIN_SNAP_DIST = 15; // screen pixels

let components   = [];
let wires        = [];
let nextId       = 1;
let tool         = 'select';
let selectedId   = null;
let ctxTarget    = null;
let wireStart    = null;
let wireCurrent  = null;
let isDragging   = false;
let dragComp     = null;
let dragOffX     = 0;
let dragOffY     = 0;
let isPanning    = false;
let panStartX    = 0;
let panStartY    = 0;
let panOriginX   = 0;
let panOriginY   = 0;
let lastTouchDist = 0;

let viewX     = 0;
let viewY     = 0;
let viewScale = 1;

const refCounters = {};

function snapToGrid(v) {
  return Math.round(v / GRID) * GRID;
}

function screenToWorld(sx, sy) {
  return { x: (sx - viewX) / viewScale, y: (sy - viewY) / viewScale };
}

function worldToScreen(wx, wy) {
  return { x: wx * viewScale + viewX, y: wy * viewScale + viewY };
}

function getNextRef(sub) {
  if (!refCounters[sub]) refCounters[sub] = 0;
  refCounters[sub]++;
  return sub + refCounters[sub];
}

function clearRefCounters() {
  Object.keys(refCounters).forEach(k => delete refCounters[k]);
}
