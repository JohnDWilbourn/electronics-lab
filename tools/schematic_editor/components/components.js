// components.js — Component library definitions
// LAB//NOTEBOOK Schematic Editor
// All pinouts verified against datasheets
// Pin format: {num, name, x, y, type}

const COMPONENT_LIBRARY = [

  // ── PASSIVES ────────────────────────────────────────────────────────────

  { cat:'PASSIVES', type:'resistor', label:'Resistor', sub:'R', w:60, h:20,
    pins:[{num:1,name:'A',x:-30,y:0},{num:2,name:'B',x:30,y:0}],
    draw: drawResistor },

  { cat:'PASSIVES', type:'capacitor', label:'Capacitor', sub:'C', w:40, h:30,
    pins:[{num:1,name:'+',x:-20,y:0},{num:2,name:'−',x:20,y:0}],
    draw: drawCapacitor },

  { cat:'PASSIVES', type:'cap_elec', label:'Electrolytic', sub:'C', w:40, h:30,
    pins:[{num:1,name:'+',x:-20,y:0},{num:2,name:'−',x:20,y:0}],
    draw: drawCapElec },

  { cat:'PASSIVES', type:'inductor', label:'Inductor', sub:'L', w:60, h:20,
    pins:[{num:1,name:'A',x:-30,y:0},{num:2,name:'B',x:30,y:0}],
    draw: drawInductor },

  { cat:'PASSIVES', type:'pot', label:'Pot/Trimmer', sub:'RV', w:50, h:40,
    pins:[{num:1,name:'A',x:-25,y:0},{num:2,name:'W',x:0,y:-20},{num:3,name:'B',x:25,y:0}],
    draw: drawPot },

  { cat:'PASSIVES', type:'transformer', label:'Transformer', sub:'T', w:70, h:60,
    pins:[{num:1,name:'P1',x:-35,y:-15},{num:2,name:'P2',x:-35,y:15},
          {num:3,name:'S1',x:35,y:-15},{num:4,name:'S2',x:35,y:15}],
    draw: drawTransformer },

  { cat:'PASSIVES', type:'crystal_res', label:'Xtal Earpiece', sub:'LS', w:40, h:30,
    pins:[{num:1,name:'+',x:-20,y:0},{num:2,name:'−',x:20,y:0}],
    draw: drawSpeaker },

  { cat:'PASSIVES', type:'crystal', label:'Crystal/Resonator', sub:'Y', w:50, h:30,
    pins:[{num:1,name:'1',x:-25,y:0},{num:2,name:'2',x:25,y:0}],
    draw: drawCrystal },

  { cat:'PASSIVES', type:'fuse', label:'Fuse', sub:'F', w:50, h:20,
    pins:[{num:1,name:'A',x:-25,y:0},{num:2,name:'B',x:25,y:0}],
    draw: drawFuse },

  { cat:'PASSIVES', type:'switch', label:'Switch SPST', sub:'SW', w:50, h:20,
    pins:[{num:1,name:'A',x:-25,y:0},{num:2,name:'B',x:25,y:0}],
    draw: drawSwitch },

  // ── SEMICONDUCTORS — DIODES ─────────────────────────────────────────────

  { cat:'DIODES', type:'diode', label:'Diode', sub:'D', w:50, h:20,
    pins:[{num:1,name:'A',x:-25,y:0},{num:2,name:'K',x:25,y:0}],
    draw: drawDiode },

  { cat:'DIODES', type:'zener', label:'Zener', sub:'D', w:50, h:20,
    pins:[{num:1,name:'A',x:-25,y:0},{num:2,name:'K',x:25,y:0}],
    draw: drawZener },

  { cat:'DIODES', type:'schottky', label:'Schottky', sub:'D', w:50, h:20,
    pins:[{num:1,name:'A',x:-25,y:0},{num:2,name:'K',x:25,y:0}],
    draw: drawSchottky },

  { cat:'DIODES', type:'led', label:'LED', sub:'D', w:50, h:20,
    pins:[{num:1,name:'A',x:-25,y:0},{num:2,name:'K',x:25,y:0}],
    draw: drawLED },

  { cat:'DIODES', type:'photodiode', label:'Photodiode', sub:'D', w:50, h:20,
    pins:[{num:1,name:'A',x:-25,y:0},{num:2,name:'K',x:25,y:0}],
    draw: drawPhotodiode },

  { cat:'DIODES', type:'varicap', label:'Varicap', sub:'D', w:50, h:20,
    pins:[{num:1,name:'A',x:-25,y:0},{num:2,name:'K',x:25,y:0}],
    draw: drawVaricap },

  // ── SEMICONDUCTORS — BJTs ───────────────────────────────────────────────

  { cat:'BJTs', type:'npn', label:'NPN BJT', sub:'Q', w:50, h:60,
    pins:[{num:1,name:'B',x:-25,y:0},{num:2,name:'C',x:25,y:-20},{num:3,name:'E',x:25,y:20}],
    draw: drawNPN },

  { cat:'BJTs', type:'pnp', label:'PNP BJT', sub:'Q', w:50, h:60,
    pins:[{num:1,name:'B',x:-25,y:0},{num:2,name:'C',x:25,y:-20},{num:3,name:'E',x:25,y:20}],
    draw: drawPNP },

  // ── FETs ────────────────────────────────────────────────────────────────

  { cat:'FETs', type:'nmos_e', label:'N-MOSFET Enh', sub:'Q', w:50, h:60,
    pins:[{num:1,name:'G',x:-25,y:0},{num:2,name:'D',x:25,y:-20},{num:3,name:'S',x:25,y:20},{num:4,name:'B',x:0,y:25}],
    draw: drawNMOSE },

  { cat:'FETs', type:'pmos_e', label:'P-MOSFET Enh', sub:'Q', w:50, h:60,
    pins:[{num:1,name:'G',x:-25,y:0},{num:2,name:'D',x:25,y:-20},{num:3,name:'S',x:25,y:20},{num:4,name:'B',x:0,y:25}],
    draw: drawPMOSE },

  { cat:'FETs', type:'nmos_d', label:'N-MOSFET Dep', sub:'Q', w:50, h:60,
    pins:[{num:1,name:'G',x:-25,y:0},{num:2,name:'D',x:25,y:-20},{num:3,name:'S',x:25,y:20},{num:4,name:'B',x:0,y:25}],
    draw: drawNMOSD },

  { cat:'FETs', type:'pmos_d', label:'P-MOSFET Dep', sub:'Q', w:50, h:60,
    pins:[{num:1,name:'G',x:-25,y:0},{num:2,name:'D',x:25,y:-20},{num:3,name:'S',x:25,y:20},{num:4,name:'B',x:0,y:25}],
    draw: drawPMOSD },

  { cat:'FETs', type:'njfet', label:'N-JFET', sub:'Q', w:50, h:60,
    pins:[{num:1,name:'G',x:-25,y:0},{num:2,name:'D',x:25,y:-20},{num:3,name:'S',x:25,y:20}],
    draw: drawNJFET },

  { cat:'FETs', type:'pjfet', label:'P-JFET', sub:'Q', w:50, h:60,
    pins:[{num:1,name:'G',x:-25,y:0},{num:2,name:'D',x:25,y:-20},{num:3,name:'S',x:25,y:20}],
    draw: drawPJFET },

  // ── ICs — CORRECT FULL PINOUTS ──────────────────────────────────────────

  // LM386 — Audio Power Amplifier — DIP-8
  // Pins: 1=GAIN, 2=IN−, 3=IN+, 4=GND, 5=OUT, 6=VS, 7=BYP, 8=GAIN
  { cat:'ICs', type:'lm386', label:'LM386', sub:'U', w:80, h:120,
    icLabel:'LM386',
    pins:[
      {num:1, name:'GAIN', x:-40, y:-45},
      {num:2, name:'IN−',  x:-40, y:-15},
      {num:3, name:'IN+',  x:-40, y:15},
      {num:4, name:'GND',  x:-40, y:45},
      {num:5, name:'OUT',  x:40,  y:45},
      {num:6, name:'VS',   x:40,  y:15},
      {num:7, name:'BYP',  x:40,  y:-15},
      {num:8, name:'GAIN', x:40,  y:-45},
    ],
    draw: drawDIP },

  // NE555 / LM555 — Timer — DIP-8
  // Pins: 1=GND, 2=TRIG, 3=OUT, 4=RST, 5=CV, 6=THR, 7=DIS, 8=VCC
  { cat:'ICs', type:'ne555', label:'NE555', sub:'U', w:80, h:120,
    icLabel:'NE555',
    pins:[
      {num:1, name:'GND',  x:-40, y:-45},
      {num:2, name:'TRIG', x:-40, y:-15},
      {num:3, name:'OUT',  x:-40, y:15},
      {num:4, name:'RST',  x:-40, y:45},
      {num:5, name:'CV',   x:40,  y:45},
      {num:6, name:'THR',  x:40,  y:15},
      {num:7, name:'DIS',  x:40,  y:-15},
      {num:8, name:'VCC',  x:40,  y:-45},
    ],
    draw: drawDIP },

  // LM317T — Adjustable Positive Regulator — TO-220
  // Pins: 1=ADJ, 2=OUT, 3=IN
  { cat:'ICs', type:'lm317', label:'LM317T', sub:'U', w:60, h:60,
    icLabel:'LM317',
    pins:[
      {num:1, name:'ADJ', x:-30, y:-15},
      {num:2, name:'OUT', x:-30, y:15},
      {num:3, name:'IN',  x:30,  y:0},
    ],
    draw: drawDIP },

  // L7805 / L78xx — Fixed Positive Regulator — TO-220
  // Pins: 1=IN, 2=GND, 3=OUT
  { cat:'ICs', type:'l7805', label:'L7805', sub:'U', w:60, h:60,
    icLabel:'L7805',
    pins:[
      {num:1, name:'IN',  x:-30, y:-15},
      {num:2, name:'GND', x:-30, y:15},
      {num:3, name:'OUT', x:30,  y:0},
    ],
    draw: drawDIP },

  // LM324 — Quad Op-Amp — DIP-14
  // Pins: 1=OUT1, 2=IN1−, 3=IN1+, 4=VCC+, 5=IN2+, 6=IN2−, 7=OUT2
  //       8=OUT3, 9=IN3−, 10=IN3+, 11=GND, 12=IN4+, 13=IN4−, 14=OUT4
  { cat:'ICs', type:'lm324', label:'LM324', sub:'U', w:80, h:180,
    icLabel:'LM324',
    pins:[
      {num:1,  name:'OUT1', x:-40, y:-75},
      {num:2,  name:'IN1−', x:-40, y:-55},
      {num:3,  name:'IN1+', x:-40, y:-35},
      {num:4,  name:'VCC+', x:-40, y:-15},
      {num:5,  name:'IN2+', x:-40, y:5},
      {num:6,  name:'IN2−', x:-40, y:25},
      {num:7,  name:'OUT2', x:-40, y:45},
      {num:8,  name:'OUT3', x:40,  y:75},
      {num:9,  name:'IN3−', x:40,  y:55},
      {num:10, name:'IN3+', x:40,  y:35},
      {num:11, name:'GND',  x:40,  y:15},
      {num:12, name:'IN4+', x:40,  y:-5},
      {num:13, name:'IN4−', x:40,  y:-25},
      {num:14, name:'OUT4', x:40,  y:-45},
    ],
    draw: drawDIP },

  // LM393 — Dual Comparator — DIP-8
  // Pins: 1=OUT1, 2=IN1−, 3=IN1+, 4=GND, 5=IN2+, 6=IN2−, 7=OUT2, 8=VCC
  { cat:'ICs', type:'lm393', label:'LM393', sub:'U', w:80, h:120,
    icLabel:'LM393',
    pins:[
      {num:1, name:'OUT1', x:-40, y:-45},
      {num:2, name:'IN1−', x:-40, y:-15},
      {num:3, name:'IN1+', x:-40, y:15},
      {num:4, name:'GND',  x:-40, y:45},
      {num:5, name:'IN2+', x:40,  y:45},
      {num:6, name:'IN2−', x:40,  y:15},
      {num:7, name:'OUT2', x:40,  y:-15},
      {num:8, name:'VCC',  x:40,  y:-45},
    ],
    draw: drawDIP },

  // UA741 / LM741 — Single Op-Amp — DIP-8
  // Pins: 1=OS1, 2=IN−, 3=IN+, 4=V−, 5=OS2, 6=OUT, 7=V+, 8=NC
  { cat:'ICs', type:'ua741', label:'UA741', sub:'U', w:80, h:120,
    icLabel:'UA741',
    pins:[
      {num:1, name:'OS1', x:-40, y:-45},
      {num:2, name:'IN−', x:-40, y:-15},
      {num:3, name:'IN+', x:-40, y:15},
      {num:4, name:'V−',  x:-40, y:45},
      {num:5, name:'OS2', x:40,  y:45},
      {num:6, name:'OUT', x:40,  y:15},
      {num:7, name:'V+',  x:40,  y:-15},
      {num:8, name:'NC',  x:40,  y:-45},
    ],
    draw: drawDIP },

  // LM358 — Dual Op-Amp — DIP-8
  // Pins: 1=OUT1, 2=IN1−, 3=IN1+, 4=GND, 5=IN2+, 6=IN2−, 7=OUT2, 8=VCC
  { cat:'ICs', type:'lm358', label:'LM358', sub:'U', w:80, h:120,
    icLabel:'LM358',
    pins:[
      {num:1, name:'OUT1', x:-40, y:-45},
      {num:2, name:'IN1−', x:-40, y:-15},
      {num:3, name:'IN1+', x:-40, y:15},
      {num:4, name:'GND',  x:-40, y:45},
      {num:5, name:'IN2+', x:40,  y:45},
      {num:6, name:'IN2−', x:40,  y:15},
      {num:7, name:'OUT2', x:40,  y:-15},
      {num:8, name:'VCC',  x:40,  y:-45},
    ],
    draw: drawDIP },

  // NE5534 — Low-Noise Single Op-Amp — DIP-8
  // Pins: 1=COMP, 2=IN−, 3=IN+, 4=V−, 5=COMP, 6=OUT, 7=V+, 8=NC
  { cat:'ICs', type:'ne5534', label:'NE5534', sub:'U', w:80, h:120,
    icLabel:'NE5534',
    pins:[
      {num:1, name:'COMP', x:-40, y:-45},
      {num:2, name:'IN−',  x:-40, y:-15},
      {num:3, name:'IN+',  x:-40, y:15},
      {num:4, name:'V−',   x:-40, y:45},
      {num:5, name:'COMP', x:40,  y:45},
      {num:6, name:'OUT',  x:40,  y:15},
      {num:7, name:'V+',   x:40,  y:-15},
      {num:8, name:'NC',   x:40,  y:-45},
    ],
    draw: drawDIP },

  // ULN2803A — 8-Channel Darlington Array — DIP-18
  // Pins 1–8: IN1–IN8, Pin 9: GND/COM, Pins 10–17: OUT8–OUT1, Pin 18: +VCC (flyback)
  { cat:'ICs', type:'uln2803', label:'ULN2803A', sub:'U', w:80, h:240,
    icLabel:'ULN2803A',
    pins:[
      {num:1,  name:'IN1',  x:-40, y:-105},
      {num:2,  name:'IN2',  x:-40, y:-75},
      {num:3,  name:'IN3',  x:-40, y:-45},
      {num:4,  name:'IN4',  x:-40, y:-15},
      {num:5,  name:'IN5',  x:-40, y:15},
      {num:6,  name:'IN6',  x:-40, y:45},
      {num:7,  name:'IN7',  x:-40, y:75},
      {num:8,  name:'IN8',  x:-40, y:105},
      {num:9,  name:'GND',  x:40,  y:105},
      {num:10, name:'OUT8', x:40,  y:75},
      {num:11, name:'OUT7', x:40,  y:45},
      {num:12, name:'OUT6', x:40,  y:15},
      {num:13, name:'OUT5', x:40,  y:-15},
      {num:14, name:'OUT4', x:40,  y:-45},
      {num:15, name:'OUT3', x:40,  y:-75},
      {num:16, name:'OUT2', x:40,  y:-105},
      {num:17, name:'OUT1', x:40,  y:-135},
      {num:18, name:'VCC',  x:-40, y:-135},
    ],
    draw: drawDIP },

  // ULN2003A — 7-Channel Darlington Array — DIP-16
  { cat:'ICs', type:'uln2003', label:'ULN2003A', sub:'U', w:80, h:210,
    icLabel:'ULN2003A',
    pins:[
      {num:1,  name:'IN1',  x:-40, y:-90},
      {num:2,  name:'IN2',  x:-40, y:-60},
      {num:3,  name:'IN3',  x:-40, y:-30},
      {num:4,  name:'IN4',  x:-40, y:0},
      {num:5,  name:'IN5',  x:-40, y:30},
      {num:6,  name:'IN6',  x:-40, y:60},
      {num:7,  name:'IN7',  x:-40, y:90},
      {num:8,  name:'GND',  x:40,  y:90},
      {num:9,  name:'OUT7', x:40,  y:60},
      {num:10, name:'OUT6', x:40,  y:30},
      {num:11, name:'OUT5', x:40,  y:0},
      {num:12, name:'OUT4', x:40,  y:-30},
      {num:13, name:'OUT3', x:40,  y:-60},
      {num:14, name:'OUT2', x:40,  y:-90},
      {num:15, name:'OUT1', x:40,  y:-120},
      {num:16, name:'VCC',  x:-40, y:-120},
    ],
    draw: drawDIP },

  // PC817 — Optocoupler — DIP-4
  // Pins: 1=A(LED), 2=K(LED), 3=E(transistor), 4=C(transistor)
  { cat:'ICs', type:'pc817', label:'PC817', sub:'U', w:60, h:80,
    icLabel:'PC817',
    pins:[
      {num:1, name:'A', x:-30, y:-20},
      {num:2, name:'K', x:-30, y:20},
      {num:3, name:'E', x:30,  y:20},
      {num:4, name:'C', x:30,  y:-20},
    ],
    draw: drawDIP },

  // Generic IC — configurable
  { cat:'ICs', type:'ic_generic', label:'IC (generic)', sub:'U', w:80, h:80,
    icLabel:'IC',
    pins:[
      {num:1, name:'1', x:-40, y:-20},
      {num:2, name:'2', x:-40, y:20},
      {num:3, name:'3', x:40,  y:20},
      {num:4, name:'4', x:40,  y:-20},
    ],
    draw: drawDIP },

  // ── 74xx LOGIC — most common ────────────────────────────────────────────

  // 74HC00 — Quad 2-input NAND — DIP-14
  { cat:'74xx LOGIC', type:'74hc00', label:'74HC00', sub:'U', w:80, h:180,
    icLabel:'74HC00',
    pins:[
      {num:1,  name:'1A',  x:-40, y:-75},
      {num:2,  name:'1B',  x:-40, y:-55},
      {num:3,  name:'1Y',  x:-40, y:-35},
      {num:4,  name:'2A',  x:-40, y:-15},
      {num:5,  name:'2B',  x:-40, y:5},
      {num:6,  name:'2Y',  x:-40, y:25},
      {num:7,  name:'GND', x:-40, y:45},
      {num:8,  name:'3Y',  x:40,  y:75},
      {num:9,  name:'3A',  x:40,  y:55},
      {num:10, name:'3B',  x:40,  y:35},
      {num:11, name:'4Y',  x:40,  y:15},
      {num:12, name:'4A',  x:40,  y:-5},
      {num:13, name:'4B',  x:40,  y:-25},
      {num:14, name:'VCC', x:40,  y:-45},
    ],
    draw: drawDIP },

  // 74HC04 — Hex Inverter — DIP-14
  { cat:'74xx LOGIC', type:'74hc04', label:'74HC04', sub:'U', w:80, h:180,
    icLabel:'74HC04',
    pins:[
      {num:1,  name:'1A',  x:-40, y:-75},
      {num:2,  name:'1Y',  x:-40, y:-55},
      {num:3,  name:'2A',  x:-40, y:-35},
      {num:4,  name:'2Y',  x:-40, y:-15},
      {num:5,  name:'3A',  x:-40, y:5},
      {num:6,  name:'3Y',  x:-40, y:25},
      {num:7,  name:'GND', x:-40, y:45},
      {num:8,  name:'4Y',  x:40,  y:75},
      {num:9,  name:'4A',  x:40,  y:55},
      {num:10, name:'5Y',  x:40,  y:35},
      {num:11, name:'5A',  x:40,  y:15},
      {num:12, name:'6Y',  x:40,  y:-5},
      {num:13, name:'6A',  x:40,  y:-25},
      {num:14, name:'VCC', x:40,  y:-45},
    ],
    draw: drawDIP },

  // 74HC08 — Quad 2-input AND — DIP-14 (same pinout as 74HC00)
  { cat:'74xx LOGIC', type:'74hc08', label:'74HC08', sub:'U', w:80, h:180,
    icLabel:'74HC08',
    pins:[
      {num:1,  name:'1A',  x:-40, y:-75},{num:2,  name:'1B',  x:-40, y:-55},
      {num:3,  name:'1Y',  x:-40, y:-35},{num:4,  name:'2A',  x:-40, y:-15},
      {num:5,  name:'2B',  x:-40, y:5},  {num:6,  name:'2Y',  x:-40, y:25},
      {num:7,  name:'GND', x:-40, y:45}, {num:8,  name:'3Y',  x:40,  y:75},
      {num:9,  name:'3A',  x:40,  y:55}, {num:10, name:'3B',  x:40,  y:35},
      {num:11, name:'4Y',  x:40,  y:15}, {num:12, name:'4A',  x:40,  y:-5},
      {num:13, name:'4B',  x:40,  y:-25},{num:14, name:'VCC', x:40,  y:-45},
    ],
    draw: drawDIP },

  // 74HC32 — Quad 2-input OR — DIP-14
  { cat:'74xx LOGIC', type:'74hc32', label:'74HC32', sub:'U', w:80, h:180,
    icLabel:'74HC32',
    pins:[
      {num:1,  name:'1A',  x:-40, y:-75},{num:2,  name:'1B',  x:-40, y:-55},
      {num:3,  name:'1Y',  x:-40, y:-35},{num:4,  name:'2A',  x:-40, y:-15},
      {num:5,  name:'2B',  x:-40, y:5},  {num:6,  name:'2Y',  x:-40, y:25},
      {num:7,  name:'GND', x:-40, y:45}, {num:8,  name:'3Y',  x:40,  y:75},
      {num:9,  name:'3A',  x:40,  y:55}, {num:10, name:'3B',  x:40,  y:35},
      {num:11, name:'4Y',  x:40,  y:15}, {num:12, name:'4A',  x:40,  y:-5},
      {num:13, name:'4B',  x:40,  y:-25},{num:14, name:'VCC', x:40,  y:-45},
    ],
    draw: drawDIP },

  // 74HC86 — Quad 2-input XOR — DIP-14
  { cat:'74xx LOGIC', type:'74hc86', label:'74HC86', sub:'U', w:80, h:180,
    icLabel:'74HC86',
    pins:[
      {num:1,  name:'1A',  x:-40, y:-75},{num:2,  name:'1B',  x:-40, y:-55},
      {num:3,  name:'1Y',  x:-40, y:-35},{num:4,  name:'2A',  x:-40, y:-15},
      {num:5,  name:'2B',  x:-40, y:5},  {num:6,  name:'2Y',  x:-40, y:25},
      {num:7,  name:'GND', x:-40, y:45}, {num:8,  name:'3Y',  x:40,  y:75},
      {num:9,  name:'3A',  x:40,  y:55}, {num:10, name:'3B',  x:40,  y:35},
      {num:11, name:'4Y',  x:40,  y:15}, {num:12, name:'4A',  x:40,  y:-5},
      {num:13, name:'4B',  x:40,  y:-25},{num:14, name:'VCC', x:40,  y:-45},
    ],
    draw: drawDIP },

  // 74HC74 — Dual D Flip-Flop — DIP-14
  // Pins: 1=CLR1, 2=D1, 3=CLK1, 4=PRE1, 5=Q1, 6=/Q1, 7=GND
  //       8=/Q2, 9=Q2, 10=PRE2, 11=CLK2, 12=D2, 13=CLR2, 14=VCC
  { cat:'74xx LOGIC', type:'74hc74', label:'74HC74', sub:'U', w:80, h:180,
    icLabel:'74HC74',
    pins:[
      {num:1,  name:'CLR1', x:-40, y:-75},{num:2,  name:'D1',   x:-40, y:-55},
      {num:3,  name:'CLK1', x:-40, y:-35},{num:4,  name:'PRE1', x:-40, y:-15},
      {num:5,  name:'Q1',   x:-40, y:5},  {num:6,  name:'/Q1',  x:-40, y:25},
      {num:7,  name:'GND',  x:-40, y:45}, {num:8,  name:'/Q2',  x:40,  y:75},
      {num:9,  name:'Q2',   x:40,  y:55}, {num:10, name:'PRE2', x:40,  y:35},
      {num:11, name:'CLK2', x:40,  y:15}, {num:12, name:'D2',   x:40,  y:-5},
      {num:13, name:'CLR2', x:40,  y:-25},{num:14, name:'VCC',  x:40,  y:-45},
    ],
    draw: drawDIP },

  // 74HC192 — Presettable BCD Up/Down Counter — DIP-16
  // Pins: 1=B, 2=QB, 3=QA, 4=CD(down clk), 5=CU(up clk), 6=QC, 7=QD, 8=GND
  //       9=D, 10=C, 11=LOAD, 12=TCU, 13=TCD, 14=MR, 15=A, 16=VCC
  { cat:'74xx LOGIC', type:'74hc192', label:'74HC192', sub:'U', w:80, h:210,
    icLabel:'74HC192',
    pins:[
      {num:1,  name:'B',    x:-40, y:-90},{num:2,  name:'QB',   x:-40, y:-60},
      {num:3,  name:'QA',   x:-40, y:-30},{num:4,  name:'CD',   x:-40, y:0},
      {num:5,  name:'CU',   x:-40, y:30}, {num:6,  name:'QC',   x:-40, y:60},
      {num:7,  name:'QD',   x:-40, y:90}, {num:8,  name:'GND',  x:40,  y:90},
      {num:9,  name:'D',    x:40,  y:60}, {num:10, name:'C',    x:40,  y:30},
      {num:11, name:'LOAD', x:40,  y:0},  {num:12, name:'TCU',  x:40,  y:-30},
      {num:13, name:'TCD',  x:40,  y:-60},{num:14, name:'MR',   x:40,  y:-90},
      {num:15, name:'A',    x:-40, y:-120},{num:16,name:'VCC',  x:40,  y:-120},
    ],
    draw: drawDIP },

  // CD4511 — BCD to 7-Segment Latch/Decoder/Driver — DIP-16
  // Pins: 1=B, 2=C, 3=LT, 4=BI, 5=LE, 6=D, 7=A, 8=GND
  //       9=e, 10=d, 11=c, 12=b, 13=a, 14=g, 15=f, 16=VDD
  { cat:'74xx LOGIC', type:'cd4511', label:'CD4511', sub:'U', w:80, h:210,
    icLabel:'CD4511',
    pins:[
      {num:1,  name:'B',   x:-40, y:-90},{num:2,  name:'C',   x:-40, y:-60},
      {num:3,  name:'LT',  x:-40, y:-30},{num:4,  name:'BI',  x:-40, y:0},
      {num:5,  name:'LE',  x:-40, y:30}, {num:6,  name:'D',   x:-40, y:60},
      {num:7,  name:'A',   x:-40, y:90}, {num:8,  name:'GND', x:40,  y:90},
      {num:9,  name:'e',   x:40,  y:60}, {num:10, name:'d',   x:40,  y:30},
      {num:11, name:'c',   x:40,  y:0},  {num:12, name:'b',   x:40,  y:-30},
      {num:13, name:'a',   x:40,  y:-60},{num:14, name:'g',   x:40,  y:-90},
      {num:15, name:'f',   x:40,  y:-120},{num:16,name:'VDD', x:-40, y:-120},
    ],
    draw: drawDIP },

  // CD4017 — Decade Counter/Divider — DIP-16
  { cat:'4xxx LOGIC', type:'cd4017', label:'CD4017', sub:'U', w:80, h:210,
    icLabel:'CD4017',
    pins:[
      {num:1,  name:'Q5',  x:-40, y:-90},{num:2,  name:'Q1',  x:-40, y:-60},
      {num:3,  name:'Q0',  x:-40, y:-30},{num:4,  name:'Q2',  x:-40, y:0},
      {num:5,  name:'Q6',  x:-40, y:30}, {num:6,  name:'Q7',  x:-40, y:60},
      {num:7,  name:'Q3',  x:-40, y:90}, {num:8,  name:'VSS', x:40,  y:90},
      {num:9,  name:'Q8',  x:40,  y:60}, {num:10, name:'Q4',  x:40,  y:30},
      {num:11, name:'Q9',  x:40,  y:0},  {num:12, name:'CO',  x:40,  y:-30},
      {num:13, name:'EI',  x:40,  y:-60},{num:14, name:'CLK', x:40,  y:-90},
      {num:15, name:'RST', x:-40, y:-120},{num:16,name:'VDD', x:40,  y:-120},
    ],
    draw: drawDIP },

  // CD4040 — 12-Stage Ripple Counter — DIP-16
  { cat:'4xxx LOGIC', type:'cd4040', label:'CD4040', sub:'U', w:80, h:210,
    icLabel:'CD4040',
    pins:[
      {num:1,  name:'Q12', x:-40, y:-90},{num:2,  name:'Q6',  x:-40, y:-60},
      {num:3,  name:'Q5',  x:-40, y:-30},{num:4,  name:'Q7',  x:-40, y:0},
      {num:5,  name:'Q4',  x:-40, y:30}, {num:6,  name:'Q3',  x:-40, y:60},
      {num:7,  name:'Q2',  x:-40, y:90}, {num:8,  name:'VSS', x:40,  y:90},
      {num:9,  name:'Q1',  x:40,  y:60}, {num:10, name:'MR',  x:40,  y:30},
      {num:11, name:'CLK', x:40,  y:0},  {num:12, name:'Q11', x:40,  y:-30},
      {num:13, name:'Q10', x:40,  y:-60},{num:14, name:'Q9',  x:40,  y:-90},
      {num:15, name:'Q8',  x:-40, y:-120},{num:16,name:'VDD', x:40,  y:-120},
    ],
    draw: drawDIP },

  // CD4066 — Quad Bilateral Switch — DIP-14
  { cat:'4xxx LOGIC', type:'cd4066', label:'CD4066', sub:'U', w:80, h:180,
    icLabel:'CD4066',
    pins:[
      {num:1,  name:'IO1A', x:-40, y:-75},{num:2,  name:'IO1B', x:-40, y:-55},
      {num:3,  name:'IO2A', x:-40, y:-35},{num:4,  name:'IO2B', x:-40, y:-15},
      {num:5,  name:'CTL2', x:-40, y:5},  {num:6,  name:'CTL3', x:-40, y:25},
      {num:7,  name:'VSS',  x:-40, y:45}, {num:8,  name:'IO3B', x:40,  y:75},
      {num:9,  name:'IO3A', x:40,  y:55}, {num:10, name:'IO4A', x:40,  y:35},
      {num:11, name:'IO4B', x:40,  y:15}, {num:12, name:'CTL4', x:40,  y:-5},
      {num:13, name:'CTL1', x:40,  y:-25},{num:14, name:'VDD',  x:40,  y:-45},
    ],
    draw: drawDIP },

  // ── THERMAL ─────────────────────────────────────────────────────────────

  { cat:'THERMAL', type:'peltier', label:'Peltier/TEC', sub:'TEC', w:80, h:60,
    pins:[{num:1,name:'V+',x:-40,y:-8},{num:2,name:'V−',x:-40,y:8},
          {num:3,name:'T_HOT',x:0,y:28},{num:4,name:'T_COLD',x:0,y:-28}],
    draw: drawPeltier },

  { cat:'THERMAL', type:'ntc', label:'Thermistor NTC', sub:'RT', w:60, h:30,
    pins:[{num:1,name:'A',x:-30,y:0},{num:2,name:'B',x:30,y:0}],
    draw: drawNTC },

  { cat:'THERMAL', type:'ptc', label:'Thermistor PTC', sub:'RT', w:60, h:30,
    pins:[{num:1,name:'A',x:-30,y:0},{num:2,name:'B',x:30,y:0}],
    draw: drawPTC },

  { cat:'THERMAL', type:'thermocouple', label:'Thermocouple', sub:'TC', w:50, h:20,
    pins:[{num:1,name:'T+',x:-25,y:0},{num:2,name:'T−',x:25,y:0}],
    draw: drawThermocouple },

  // ── OPTICAL / IR ────────────────────────────────────────────────────────

  { cat:'OPTICAL', type:'ir_led', label:'IR LED', sub:'D', w:50, h:20,
    pins:[{num:1,name:'A',x:-25,y:0},{num:2,name:'K',x:25,y:0}],
    draw: drawIRLED },

  { cat:'OPTICAL', type:'ir_rx', label:'IR Receiver', sub:'IR', w:50, h:40,
    pins:[{num:1,name:'VCC',x:-25,y:-8},{num:2,name:'GND',x:-25,y:8},{num:3,name:'OUT',x:25,y:0}],
    draw: drawIRReceiver },

  { cat:'OPTICAL', type:'ir_phototrans', label:'IR Phototrans', sub:'Q', w:50, h:60,
    pins:[{num:1,name:'C',x:25,y:-20},{num:2,name:'E',x:25,y:20}],
    draw: drawIRPhototransistor },

  { cat:'OPTICAL', type:'solar_cell', label:'Solar Cell', sub:'PV', w:50, h:50,
    pins:[{num:1,name:'+',x:-25,y:0},{num:2,name:'−',x:25,y:0}],
    draw: drawSolarCell },

  // ── ELECTROMECHANICAL ────────────────────────────────────────────────────

  { cat:'ELECTROMECH', type:'relay', label:'Relay SPDT', sub:'K', w:80, h:60,
    pins:[{num:1,name:'COIL+',x:-40,y:-8},{num:2,name:'COIL−',x:-40,y:8},
          {num:3,name:'COM',x:40,y:-16},{num:4,name:'NO',x:40,y:6},{num:5,name:'NC',x:40,y:28}],
    draw: drawRelay },

  // ── POWER ────────────────────────────────────────────────────────────────

  { cat:'POWER', type:'vcc', label:'VCC / +V', sub:'P', w:20, h:40,
    pins:[{num:1,name:'VCC',x:0,y:18}], draw: drawVCC },

  { cat:'POWER', type:'gnd', label:'GND', sub:'P', w:20, h:40,
    pins:[{num:1,name:'GND',x:0,y:-18}], draw: drawGND },

  { cat:'POWER', type:'agnd', label:'AGND', sub:'P', w:20, h:40,
    pins:[{num:1,name:'AGND',x:0,y:-18}], draw: drawAGND },

  { cat:'POWER', type:'battery', label:'Battery', sub:'BT', w:30, h:50,
    pins:[{num:1,name:'+',x:0,y:-25},{num:2,name:'−',x:0,y:25}],
    draw: drawBattery },

  { cat:'POWER', type:'jack35', label:'3.5mm Jack', sub:'J', w:40, h:40,
    pins:[{num:1,name:'TIP',x:-20,y:-10},{num:2,name:'RNG',x:-20,y:10},{num:3,name:'SLV',x:20,y:0}],
    draw: drawJack },

  // ── RF ────────────────────────────────────────────────────────────────────

  { cat:'RF', type:'antenna', label:'Antenna', sub:'ANT', w:30, h:50,
    pins:[{num:1,name:'RF',x:0,y:25}], draw: drawAntenna },

  { cat:'RF', type:'var_cap', label:'Variable Cap', sub:'C', w:40, h:30,
    pins:[{num:1,name:'A',x:-20,y:0},{num:2,name:'B',x:20,y:0}],
    draw: drawVarCap },

  // ── TEST INSTRUMENTS ──────────────────────────────────────────────────────

  { cat:'INSTRUMENTS', type:'multimeter', label:'Multimeter', sub:'M', w:80, h:60,
    pins:[{num:1,name:'V+',x:-40,y:-10},{num:2,name:'COM',x:-40,y:10},
          {num:3,name:'mA',x:40,y:-10},{num:4,name:'10A',x:40,y:10}],
    draw: drawMultimeter },

  { cat:'INSTRUMENTS', type:'oscilloscope', label:'Oscilloscope', sub:'OS', w:100, h:80,
    pins:[{num:1,name:'CH1',x:-50,y:-20},{num:2,name:'CH2',x:-50,y:0},
          {num:3,name:'GND',x:-50,y:20},{num:4,name:'TRIG',x:50,y:-20},{num:5,name:'EXT',x:50,y:20}],
    draw: drawOscilloscope },

  { cat:'INSTRUMENTS', type:'func_gen', label:'Function Generator', sub:'FG', w:90, h:70,
    pins:[{num:1,name:'OUT',x:45,y:-15},{num:2,name:'SYNC',x:45,y:0},
          {num:3,name:'GND',x:45,y:15},{num:4,name:'EXT',x:-45,y:0}],
    draw: drawFuncGen },

  { cat:'INSTRUMENTS', type:'spectrum_analyzer', label:'Spectrum Analyzer', sub:'SA', w:100, h:80,
    pins:[{num:1,name:'RF IN',x:-50,y:0},{num:2,name:'IF OUT',x:50,y:-20},
          {num:3,name:'REF OUT',x:50,y:0},{num:4,name:'GND',x:50,y:20}],
    draw: drawSpectrumAnalyzer },

];

// Lookup helper
function getLibDef(type) {
  return COMPONENT_LIBRARY.find(c => c.type === type);
}
