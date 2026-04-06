# LAB//NOTEBOOK — Component Parameter Master
**Document:** 20260405_006_component_parameter_master.md  
**Date:** 2026-04-05  
**Status:** GOVERNING — component registry is built from this document  
**Companion:** 20260405_005_architecture_spec.md

---

## Parameter Layer Definitions

**Ideal** — textbook values. What circuit math assumes. No parasitics, no temperature dependence, no tolerance.  
**Datasheet** — real manufacturer specs. Min/typ/max where applicable. What you look up in a datasheet.  
**Environmental** — how the component behaves when conditions deviate from standard. Temperature coefficients, aging, humidity, frequency derating, mechanical stress.

---

## Category Index

1. Passives — Resistor, Capacitor, Inductor
2. Transformers — Audio, RF/IF, Center-Tapped, Toroidal
3. Diodes — Signal, Zener, Schottky, LED, Photodiode, Varicap
4. Transistors — NPN BJT, PNP BJT
5. FETs — N-MOSFET (E), P-MOSFET (E), N-MOSFET (D), P-MOSFET (D), N-JFET, P-JFET
6. ICs — Op-Amp, Comparator, Timer, Audio Amp, Regulator
7. Thermal — Peltier/TEC, Thermistor NTC, Thermistor PTC, Thermocouple
8. Optical/IR — IR LED, IR Receiver, IR Phototransistor, Photodiode, Solar Cell, PV Array
9. Electromechanical — Relay, Switch, Fuse, Crystal/Resonator
10. Power — Battery, VCC Rail, GND
11. RF — Antenna, Variable Capacitor
12. Test Instruments — Multimeter, Oscilloscope, Function Generator, Spectrum Analyzer
13. Opto-Isolators
14. Hall Effect Sensors

---

## 1. PASSIVES

### 1.1 Resistor
**Ref:** R  
**Pins:** A (passive), B (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | resistance | Resistance | Ω | — | Ideal ohmic value |
| Ideal | power_rating | Power Rating | W | 0.25 | |
| Datasheet | tolerance | Tolerance | % | ±5 | |
| Datasheet | tc_ppm | Temp Coeff | ppm/°C | 100 | Carbon film typical |
| Datasheet | v_max | Max Voltage | V | 200 | |
| Datasheet | noise_index | Noise Index | dB | — | Carbon vs metal film |
| Environmental | tc1 | Linear TC | ppm/°C | 100 | ΔR/R per °C |
| Environmental | tc2 | Quadratic TC | ppm/°C² | 0 | Second-order term |
| Environmental | t_min | Min Temp | °C | -55 | |
| Environmental | t_max | Max Temp | °C | 155 | |
| Environmental | humidity_coeff | Humidity Coeff | %/RH% | 0.02 | |
| Environmental | aging_rate | Aging | ppm/yr | 50 | |

### 1.2 Capacitor (Non-Polarized)
**Ref:** C  
**Pins:** A (passive), B (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | capacitance | Capacitance | F | — | |
| Ideal | voltage_rating | Voltage Rating | V | — | |
| Datasheet | tolerance | Tolerance | % | ±10 | |
| Datasheet | esr | ESR | Ω | — | Equivalent series resistance |
| Datasheet | esl | ESL | H | — | Equivalent series inductance |
| Datasheet | leakage | Leakage Current | A | — | |
| Datasheet | dissipation_factor | Dissipation Factor | — | — | tan δ |
| Datasheet | dielectric | Dielectric Type | — | C0G | C0G/NP0/X7R/Y5V/electrolytic |
| Datasheet | self_resonant_freq | SRF | Hz | — | |
| Environmental | tc | Temp Coeff | ppm/°C | 0 | C0G=0, X7R=±15%, Y5V=−82%/+22% |
| Environmental | voltage_coeff | Voltage Coeff | %/V | 0 | Capacitance change with voltage |
| Environmental | t_min | Min Temp | °C | -55 | |
| Environmental | t_max | Max Temp | °C | 125 | |
| Environmental | aging_rate | Aging | %/decade | 0 | Class II ceramics age |

### 1.3 Electrolytic Capacitor
**Ref:** C  
**Pins:** + (passive), − (passive)

Inherits all Capacitor fields plus:

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | polarized | Polarized | bool | true | |
| Datasheet | ripple_current | Ripple Current | A | — | Max AC ripple |
| Datasheet | impedance_100hz | Impedance @100Hz | Ω | — | |
| Environmental | life_hours | Life @85°C | hr | 2000 | Electrolyte evaporation |
| Environmental | life_tc | Life TC | hr/°C | — | Doubles per 10°C reduction |
| Environmental | vent_pressure | Vent Pressure | kPa | — | |

### 1.4 Inductor
**Ref:** L  
**Pins:** A (passive), B (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | inductance | Inductance | H | — | |
| Ideal | current_rating | Current Rating | A | — | |
| Datasheet | tolerance | Tolerance | % | ±10 | |
| Datasheet | dcr | DC Resistance | Ω | — | |
| Datasheet | srf | Self-Resonant Freq | Hz | — | |
| Datasheet | q_factor | Q Factor | — | — | At specified frequency |
| Datasheet | q_freq | Q Test Frequency | Hz | — | |
| Datasheet | saturation_current | Saturation Current | A | — | L drops 10% |
| Datasheet | core_material | Core Material | — | — | Air/ferrite/iron/toroid |
| Environmental | tc | Inductance TC | ppm/°C | — | |
| Environmental | t_max | Max Temp | °C | 125 | |
| Environmental | current_derating | Current Derating | %/°C | — | Above rated temp |

### 1.5 Potentiometer / Trimmer
**Ref:** RV  
**Pins:** A (passive), B (passive), W (passive) — wiper

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | resistance | Total Resistance | Ω | — | End-to-end |
| Ideal | taper | Taper | — | linear | linear/audio/log |
| Datasheet | tolerance | Tolerance | % | ±10 | |
| Datasheet | power_rating | Power Rating | W | — | |
| Datasheet | resolution | Resolution | turns | 1 | Multi-turn trimmers |
| Datasheet | contact_resistance | Contact Resistance | Ω | — | |
| Datasheet | independent_linearity | Linearity | % | — | |
| Environmental | tc | Temp Coeff | ppm/°C | 100 | |
| Environmental | t_min | Min Temp | °C | -55 | |
| Environmental | t_max | Max Temp | °C | 125 | |
| Environmental | mechanical_life | Mech Life | cycles | 200 | Trimmers — not wirewound |

---

## 2. TRANSFORMERS

### 2.1 Audio Transformer
**Ref:** T  
**Pins:** P1 (passive), P2 (passive), S1 (passive), S2 (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | turns_ratio | Turns Ratio | n:1 | 1:1 | Primary:Secondary |
| Ideal | impedance_ratio | Impedance Ratio | — | 1:1 | n² |
| Datasheet | primary_impedance | Primary Z | Ω | — | |
| Datasheet | secondary_impedance | Secondary Z | Ω | — | |
| Datasheet | freq_response_low | −3dB Low | Hz | 20 | |
| Datasheet | freq_response_high | −3dB High | Hz | 20000 | |
| Datasheet | insertion_loss | Insertion Loss | dB | — | |
| Datasheet | primary_inductance | Primary L | H | — | |
| Datasheet | leakage_inductance | Leakage L | H | — | |
| Datasheet | dcr_primary | DCR Primary | Ω | — | |
| Datasheet | dcr_secondary | DCR Secondary | Ω | — | |
| Datasheet | max_power | Max Power | W | — | |
| Environmental | tc_inductance | Inductance TC | ppm/°C | — | |
| Environmental | t_max | Max Temp | °C | 105 | Core/insulation class |
| Environmental | core_saturation | Core Sat | T | — | Tesla |

### 2.2 RF/IF Transformer
**Ref:** T  
**Pins:** P1 (rf), P2 (rf), S1 (rf), S2 (rf)

Inherits audio transformer fields plus:

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | center_frequency | Center Freq | Hz | — | IF transformers: 455kHz/10.7MHz typical |
| Datasheet | bandwidth | Bandwidth | Hz | — | −3dB |
| Datasheet | q_factor | Q Factor | — | — | |
| Datasheet | coupling_coeff | Coupling k | — | — | 0–1 |
| Datasheet | insertion_loss | Insertion Loss | dB | — | At center freq |
| Environmental | tc_freq | Freq TC | ppm/°C | — | Center frequency drift |

### 2.3 Center-Tapped Transformer
**Ref:** T  
**Pins:** P1 (passive), CT_P (passive), P2 (passive), S1 (passive), CT_S (passive), S2 (passive)

Inherits audio transformer fields. CT pins are center taps on primary and/or secondary.

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | ct_balance | CT Balance | % | ±0.5 | Half-winding match |
| Datasheet | ct_dcr | CT DCR | Ω | — | Each half winding |

### 2.4 Toroidal Transformer
**Ref:** T  
**Pins:** P1 (passive), P2 (passive), S1 (passive), S2 (passive)

Inherits audio transformer fields plus:

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Datasheet | shielding | EMI Shielding | dB | — | vs EI core |
| Datasheet | no_load_current | No-Load Current | mA | — | Magnetizing current |
| Environmental | stray_field | Stray Field | % | 1 | vs EI core — much lower |

---

## 3. DIODES

### 3.1 Signal / Switching Diode
**Ref:** D  
**Pins:** A (passive), K (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | vf | Forward Voltage | V | 0.7 | Silicon ideal |
| Ideal | vr_max | Peak Reverse Voltage | V | — | |
| Datasheet | vf_typ | Vf Typical | V | 0.6 | At rated If |
| Datasheet | if_max | Max Forward Current | A | — | |
| Datasheet | if_avg | Avg Forward Current | A | — | |
| Datasheet | ir_max | Max Reverse Current | A | — | Leakage |
| Datasheet | trr | Reverse Recovery Time | s | — | 1N4148: 4ns |
| Datasheet | cd | Junction Capacitance | F | — | At 0V |
| Datasheet | package | Package | — | DO-35 | |
| Environmental | tc_vf | Vf TC | mV/°C | -2.0 | Decreases ~2mV/°C |
| Environmental | tc_ir | IR TC | %/°C | +10 | Leakage doubles ~10°C |
| Environmental | t_junction_max | Max Junction Temp | °C | 150 | |
| Environmental | thermal_resistance | θjA | °C/W | — | Junction to ambient |

### 3.2 Zener Diode
**Ref:** D  
**Pins:** A (passive), K (passive)

Inherits signal diode fields plus:

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | vz | Zener Voltage | V | — | At test current |
| Ideal | iz_test | Test Current | A | — | |
| Datasheet | vz_tolerance | Vz Tolerance | % | ±5 | |
| Datasheet | zz | Zener Impedance | Ω | — | Dynamic impedance |
| Datasheet | power_rating | Power Rating | W | — | |
| Datasheet | iz_min | Min Zener Current | A | — | Below this: not regulated |
| Datasheet | iz_max | Max Zener Current | A | — | |
| Environmental | tc_vz | Vz TC | mV/°C | — | Positive >5V, negative <5V |
| Environmental | noise | Noise Voltage | V_rms | — | Avalanche noise |

### 3.3 Schottky Diode
**Ref:** D  
**Pins:** A (passive), K (passive)

Inherits signal diode fields. Key differences:

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | vf | Forward Voltage | V | 0.3 | Lower than silicon |
| Datasheet | trr | Reverse Recovery | s | 0 | Majority carrier — essentially zero |
| Datasheet | ir_max | Leakage Current | A | — | Higher than silicon |
| Environmental | tc_ir | Leakage TC | %/°C | +15 | Rises faster than silicon |

### 3.4 LED
**Ref:** D  
**Pins:** A (passive), K (passive)

Inherits signal diode fields plus:

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | vf | Forward Voltage | V | 2.0 | Varies by color |
| Datasheet | wavelength_peak | Peak Wavelength | nm | — | |
| Datasheet | luminous_intensity | Luminous Intensity | mcd | — | At rated If |
| Datasheet | viewing_angle | Viewing Angle | ° | 30 | Half-intensity angle |
| Datasheet | if_rated | Rated Forward Current | A | 0.02 | |
| Datasheet | if_max | Max Forward Current | A | — | |
| Environmental | tc_wavelength | Wavelength TC | nm/°C | 0.1 | Red: ~0.1nm/°C |
| Environmental | tc_vf | Vf TC | mV/°C | -2.5 | |
| Environmental | luminous_tc | Luminosity TC | %/°C | -1.0 | |
| Environmental | t_junction_max | Max Junction | °C | 125 | |

### 3.5 Photodiode
**Ref:** D  
**Pins:** A (optical/passive), K (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | responsivity | Responsivity | A/W | — | At peak wavelength |
| Ideal | peak_wavelength | Peak Wavelength | nm | 850 | Silicon: ~850nm |
| Datasheet | dark_current | Dark Current | A | — | Reverse bias, no light |
| Datasheet | junction_capacitance | Junction Cap | F | — | Determines bandwidth |
| Datasheet | rise_time | Rise Time | s | — | 10-90% |
| Datasheet | active_area | Active Area | m² | — | |
| Datasheet | vr_max | Max Reverse Voltage | V | — | |
| Datasheet | spectral_range | Spectral Range | nm | — | e.g. 400–1100nm |
| Environmental | tc_dark_current | Dark Current TC | %/°C | +10 | Doubles ~10°C |
| Environmental | tc_responsivity | Responsivity TC | %/°C | 0.5 | |
| Environmental | t_max | Max Operating Temp | °C | 85 | |

### 3.6 Varicap (Varactor)
**Ref:** D  
**Pins:** A (passive), K (passive)

Inherits signal diode fields plus:

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | capacitance_ratio | Cap Ratio Cmax/Cmin | — | — | |
| Datasheet | ct_nom | Nominal Capacitance | F | — | At specified reverse V |
| Datasheet | ct_v1 | Cap at V1 | F | — | |
| Datasheet | ct_v2 | Cap at V2 | F | — | |
| Datasheet | v_tune_range | Tuning Voltage Range | V | — | |
| Datasheet | q_factor | Q Factor | — | — | At specified freq |
| Datasheet | rs | Series Resistance | Ω | — | |
| Environmental | tc_ct | Cap TC | ppm/°C | — | |

---

## 4. TRANSISTORS (BJT)

### 4.1 NPN BJT
**Ref:** Q  
**Pins:** B (control), C (passive), E (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | hfe | Current Gain (β) | — | 100 | IC/IB |
| Ideal | vbe_sat | Vbe Saturation | V | 0.7 | |
| Ideal | vce_sat | Vce Saturation | V | 0.2 | |
| Datasheet | hfe_min | hFE Min | — | — | |
| Datasheet | hfe_max | hFE Max | — | — | |
| Datasheet | ic_max | Max Collector Current | A | — | |
| Datasheet | vceo | Vceo | V | — | Collector-emitter breakdown |
| Datasheet | vcbo | Vcbo | V | — | Collector-base breakdown |
| Datasheet | vebo | Vebo | V | — | Emitter-base breakdown |
| Datasheet | pt_max | Max Power | W | — | |
| Datasheet | ft | Transition Frequency | Hz | — | Unity-gain frequency |
| Datasheet | cob | Output Capacitance | F | — | |
| Datasheet | noise_figure | Noise Figure | dB | — | |
| Environmental | tc_hfe | hFE TC | %/°C | +0.5 | |
| Environmental | tc_vbe | Vbe TC | mV/°C | -2.0 | |
| Environmental | t_junction_max | Max Junction | °C | 150 | |
| Environmental | thermal_resistance_jc | θjC | °C/W | — | |
| Environmental | thermal_resistance_ja | θjA | °C/W | — | |

### 4.2 PNP BJT
**Ref:** Q  
**Pins:** B (control), C (passive), E (passive)

Same schema as NPN. Polarities reversed in ideal layer.

---

## 5. FETs

### 5.1 N-Channel MOSFET (Enhancement)
**Ref:** Q  
**Pins:** G (control), D (passive), S (passive), B (passive) — bulk/body

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | vth | Threshold Voltage | V | 2.0 | Enhancement: positive |
| Ideal | rds_on | RDS(on) | Ω | — | Fully enhanced |
| Ideal | gm | Transconductance | S | — | |
| Datasheet | vgs_max | Max Vgs | V | ±20 | |
| Datasheet | vds_max | Max Vds | V | — | |
| Datasheet | id_max | Max Drain Current | A | — | |
| Datasheet | id_pulsed | Pulsed Drain Current | A | — | |
| Datasheet | rds_on_typ | RDS(on) Typical | Ω | — | At specified Vgs, Id |
| Datasheet | ciss | Input Capacitance | F | — | Cgs+Cgd |
| Datasheet | coss | Output Capacitance | F | — | Cds+Cgd |
| Datasheet | crss | Reverse Transfer Cap | F | — | Cgd — Miller cap |
| Datasheet | qg | Total Gate Charge | C | — | |
| Datasheet | qgs | Gate-Source Charge | C | — | |
| Datasheet | qgd | Gate-Drain Charge | C | — | Miller plateau |
| Datasheet | td_on | Turn-On Delay | s | — | |
| Datasheet | tr | Rise Time | s | — | |
| Datasheet | td_off | Turn-Off Delay | s | — | |
| Datasheet | tf | Fall Time | s | — | |
| Datasheet | pt_max | Max Power | W | — | |
| Datasheet | body_diode_vf | Body Diode Vf | V | 0.7 | Intrinsic body diode |
| Environmental | tc_vth | Vth TC | mV/°C | -3 to -6 | Negative TC |
| Environmental | tc_rds_on | RDS(on) TC | %/°C | +0.5 | Positive TC — self-limiting |
| Environmental | t_junction_max | Max Junction | °C | 150 | |
| Environmental | thermal_resistance_jc | θjC | °C/W | — | |
| Environmental | thermal_resistance_ja | θjA | °C/W | — | |
| Environmental | avalanche_energy | Avalanche Energy | J | — | EAS — single pulse |

### 5.2 P-Channel MOSFET (Enhancement)
**Ref:** Q  
**Pins:** G (control), D (passive), S (passive), B (passive)

Same schema as N-Channel. Vth negative. RDS(on) typically higher for same die size.

### 5.3 N-Channel MOSFET (Depletion)
**Ref:** Q  
**Pins:** G (control), D (passive), S (passive), B (passive)

Same as enhancement but:

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | vth | Pinch-Off Voltage | V | -2 to -8 | Depletion: negative for N-ch |
| Ideal | idss | Drain Current Vgs=0 | A | — | Conducts at Vgs=0 |

### 5.4 P-Channel MOSFET (Depletion)
Same as N depletion, polarities reversed.

### 5.5 N-Channel JFET
**Ref:** Q  
**Pins:** G (control), D (passive), S (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | vp | Pinch-Off Voltage | V | — | Negative for N-JFET |
| Ideal | idss | Saturation Current | A | — | At Vgs=0 |
| Ideal | gm | Transconductance | S | — | |
| Datasheet | vgs_off | Vgs(off) | V | — | = Vp |
| Datasheet | bvgss | Gate-Source Breakdown | V | — | |
| Datasheet | bvdss | Drain-Source Breakdown | V | — | |
| Datasheet | id_max | Max Drain Current | A | — | |
| Datasheet | ciss | Input Capacitance | F | — | |
| Datasheet | crss | Feedback Capacitance | F | — | |
| Datasheet | noise_figure | Noise Figure | dB | — | JFETs excel here |
| Datasheet | rd | Drain Resistance | Ω | — | |
| Environmental | tc_idss | IDSS TC | %/°C | -0.5 | Decreases with temp |
| Environmental | tc_vp | Vp TC | mV/°C | — | |
| Environmental | t_junction_max | Max Junction | °C | 150 | |

### 5.6 P-Channel JFET
Same as N-JFET, polarities reversed.

---

## 6. ICs (Selected)

### 6.1 Op-Amp (Ideal / Generic)
**Ref:** U  
**Pins:** IN+ (input), IN− (input), OUT (output), V+ (power), V− (power)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | gain | Open-Loop Gain | V/V | ∞ | |
| Ideal | input_impedance | Input Impedance | Ω | ∞ | |
| Ideal | output_impedance | Output Impedance | Ω | 0 | |
| Ideal | bandwidth | Bandwidth | Hz | ∞ | |
| Datasheet | aol | Open-Loop Gain | dB | 100 | |
| Datasheet | gbw | Gain-Bandwidth Product | Hz | — | |
| Datasheet | slew_rate | Slew Rate | V/s | — | |
| Datasheet | vos | Input Offset Voltage | V | — | |
| Datasheet | ib | Input Bias Current | A | — | |
| Datasheet | ios | Input Offset Current | A | — | |
| Datasheet | cmrr | CMRR | dB | — | |
| Datasheet | psrr | PSRR | dB | — | |
| Datasheet | output_swing | Output Swing | V | — | Rail-to-rail or limited |
| Datasheet | isc | Short Circuit Current | A | — | |
| Datasheet | vs_min | Min Supply | V | — | |
| Datasheet | vs_max | Max Supply | V | — | |
| Environmental | tc_vos | Vos Drift | µV/°C | — | |
| Environmental | tc_ib | Ib Drift | pA/°C | — | |
| Environmental | t_min | Min Temp | °C | -40 | |
| Environmental | t_max | Max Temp | °C | 85 | |

---

## 7. THERMAL DEVICES

### 7.1 Peltier / TEC (Thermoelectric Cooler)
**Ref:** TEC  
**Pins:** V+ (power), V− (power), T_HOT (thermal), T_COLD (thermal)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | cop | COP (Coefficient of Performance) | — | — | Qc/P |
| Ideal | seebeck_coeff | Seebeck Coefficient | V/K | — | α — voltage per ΔT |
| Ideal | qmax | Max Heat Pumped | W | — | At ΔT=0 |
| Ideal | dt_max | Max ΔT | °C | — | At Qc=0 |
| Ideal | imax | Max Current | A | — | |
| Ideal | vmax | Max Voltage | V | — | |
| Datasheet | resistance | Electrical Resistance | Ω | — | At 27°C |
| Datasheet | thermal_conductance | Thermal Conductance | W/K | — | K — conductance of module |
| Datasheet | figure_of_merit | Figure of Merit ZT | — | — | Z = α²/(ρκ), ZT at 300K ~1 |
| Datasheet | pellets | Number of Pellet Pairs | — | — | |
| Datasheet | dimensions | Dimensions | mm | — | |
| Environmental | tc_resistance | R TC | %/°C | +0.5 | Resistance rises with temp |
| Environmental | tc_seebeck | Seebeck TC | µV/K/°C | — | |
| Environmental | t_hot_max | Max Hot-Side Temp | °C | 138 | Bismuth telluride limit |
| Environmental | thermal_cycling | Thermal Cycle Life | cycles | 100000 | |
| Environmental | humidity | Humidity Resistance | — | — | Condensation kills TECs |

### 7.2 Thermistor — NTC
**Ref:** RT  
**Pins:** A (passive), B (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | r25 | Resistance at 25°C | Ω | — | Nominal value |
| Ideal | b_constant | B Constant | K | — | 3000–5000K typical |
| Datasheet | tolerance | Tolerance | % | ±1 | At 25°C |
| Datasheet | r_min | Min Resistance | Ω | — | At t_max |
| Datasheet | r_max | Max Resistance | Ω | — | At t_min |
| Datasheet | dissipation_constant | Dissipation Constant | W/°C | — | Self-heating |
| Datasheet | thermal_time_constant | Thermal Time Constant | s | — | In still air |
| Environmental | tc_approx | Approx TC at 25°C | %/°C | -3 to -5 | NTC: negative |
| Environmental | t_min | Min Temp | °C | -55 | |
| Environmental | t_max | Max Temp | °C | 150 | |
| Environmental | aging_stability | Stability | %/yr | 0.2 | Resistance drift |
| Environmental | steinhart_a | Steinhart-Hart A | — | — | For precise calculation |
| Environmental | steinhart_b | Steinhart-Hart B | — | — | |
| Environmental | steinhart_c | Steinhart-Hart C | — | — | |

### 7.3 Thermistor — PTC
**Ref:** RT  
**Pins:** A (passive), B (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | r_min | Minimum Resistance | Ω | — | At switch temp |
| Ideal | switch_temp | Switch Temperature | °C | — | Rapid resistance rise |
| Datasheet | r25 | Resistance at 25°C | Ω | — | |
| Datasheet | tc_below | TC Below Switch | %/°C | -0.5 | Slight NTC below Tsw |
| Datasheet | tc_above | TC Above Switch | %/°C | +60 | Strong PTC above Tsw |
| Datasheet | v_max | Max Voltage | V | — | |
| Datasheet | i_hold | Hold Current | A | — | Resettable fuse function |
| Datasheet | i_trip | Trip Current | A | — | |
| Environmental | t_min | Min Temp | °C | -40 | |
| Environmental | t_max | Max Temp | °C | 125 | |

### 7.4 Thermocouple
**Ref:** TC  
**Pins:** T+ (thermal/passive), T− (thermal/passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | seebeck_coeff | Seebeck Coefficient | µV/°C | — | Type K: ~41µV/°C |
| Ideal | tc_type | Thermocouple Type | — | K | J/K/T/E/N/R/S/B |
| Datasheet | range_min | Min Temp Range | °C | — | |
| Datasheet | range_max | Max Temp Range | °C | — | |
| Datasheet | accuracy | Accuracy | °C | — | |
| Datasheet | wire_material_pos | Positive Wire | — | — | Type K: Chromel |
| Datasheet | wire_material_neg | Negative Wire | — | — | Type K: Alumel |
| Environmental | nonlinearity | Non-Linearity | % | — | vs reference table |
| Environmental | cold_junction_error | CJC Error | °C | — | Per °C ambient change |
| Environmental | emf_drift | EMF Drift | µV/yr | — | Aging in oxidizing atmosphere |

---

## 8. OPTICAL / IR DEVICES

### 8.1 IR LED
**Ref:** D  
**Pins:** A (optical), K (passive)

Inherits LED fields plus:

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | wavelength | Wavelength | nm | 940 | Standard IR |
| Datasheet | radiant_intensity | Radiant Intensity | W/sr | — | At rated If |
| Datasheet | radiant_power | Radiant Power | W | — | Total |
| Datasheet | half_angle | Half Angle | ° | — | |
| Environmental | tc_wavelength | Wavelength TC | nm/°C | 0.27 | Shifts with temp |
| Environmental | tc_radiant | Radiant Power TC | %/°C | -1.5 | |

### 8.2 IR Receiver Module
**Ref:** IR  
**Pins:** OUT (output), VCC (power), GND (ground)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | carrier_freq | Carrier Frequency | Hz | 38000 | Standard 38kHz |
| Datasheet | supply_voltage | Supply Voltage | V | 5 | |
| Datasheet | supply_current | Supply Current | A | — | |
| Datasheet | peak_wavelength | Peak Sensitivity | nm | 940 | |
| Datasheet | reception_angle | Reception Angle | ° | ±45 | |
| Datasheet | range | Reception Range | m | — | |
| Datasheet | output_logic | Output Logic | — | active-low | |
| Environmental | t_min | Min Temp | °C | -25 | |
| Environmental | t_max | Max Temp | °C | 85 | |
| Environmental | ambient_light | Ambient Light Immunity | lux | — | Max usable ambient |

### 8.3 IR Phototransistor
**Ref:** Q  
**Pins:** C (passive), E (passive), B (optical) — base is light input

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | peak_wavelength | Peak Wavelength | nm | 880 | |
| Ideal | hfe | Photo Current Gain | — | — | |
| Datasheet | ic_light | Collector Current (light) | A | — | At rated irradiance |
| Datasheet | iceo | Dark Current | A | — | No light |
| Datasheet | vceo | Vceo | V | — | |
| Datasheet | sensitivity | Sensitivity | A/W | — | |
| Datasheet | rise_time | Rise Time | s | — | |
| Datasheet | half_angle | Half Angle | ° | — | |
| Environmental | tc_ic | Photo Current TC | %/°C | +0.5 | |
| Environmental | tc_dark | Dark Current TC | %/°C | +10 | |
| Environmental | t_junction_max | Max Junction | °C | 100 | |

### 8.4 Solar Cell (Single)
**Ref:** PV  
**Pins:** + (passive), − (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | voc | Open-Circuit Voltage | V | 0.6 | Silicon, AM1.5 |
| Ideal | isc | Short-Circuit Current | A | — | Per unit area |
| Ideal | ff | Fill Factor | — | 0.75 | P_max / (Voc × Isc) |
| Ideal | efficiency | Efficiency | % | — | AM1.5, 1000W/m² |
| Datasheet | vmp | Max Power Voltage | V | 0.5 | At MPP |
| Datasheet | imp | Max Power Current | A | — | At MPP |
| Datasheet | pmax | Max Power | W | — | |
| Datasheet | active_area | Active Area | m² | — | |
| Datasheet | spectral_response | Spectral Response | A/W | — | Peak |
| Environmental | tc_voc | Voc TC | mV/°C | -2.3 | Decreases with temp |
| Environmental | tc_isc | Isc TC | mA/°C | +0.06 | Slightly increases |
| Environmental | tc_pmax | Pmax TC | %/°C | -0.45 | Typical Si |
| Environmental | noct | NOCT | °C | 45 | Nominal Operating Cell Temp |
| Environmental | degradation | Annual Degradation | %/yr | 0.5 | LID + long-term |

### 8.5 PV Array
**Ref:** PV  
**Pins:** + (passive), − (passive)

Inherits solar cell fields plus:

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | cells_series | Cells in Series | — | — | |
| Ideal | cells_parallel | Cells in Parallel | — | — | |
| Datasheet | voc_array | Array Voc | V | — | |
| Datasheet | isc_array | Array Isc | A | — | |
| Datasheet | vmpp | Array Vmpp | V | — | |
| Datasheet | impp | Array Impp | A | — | |
| Environmental | mismatch_loss | Mismatch Loss | % | 2 | Cell-to-cell variation |
| Environmental | soiling_loss | Soiling Loss | %/month | 1 | |

---

## 9. ELECTROMECHANICAL

### 9.1 Relay
**Ref:** K  
**Pins:** COIL+ (power), COIL− (power), COM (passive), NO (passive), NC (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | coil_voltage | Coil Voltage | V | — | Nominal |
| Ideal | contact_type | Contact Type | — | SPDT | SPST/SPDT/DPDT |
| Datasheet | coil_resistance | Coil Resistance | Ω | — | |
| Datasheet | pull_in_voltage | Pull-In Voltage | V | — | Min to close |
| Datasheet | drop_out_voltage | Drop-Out Voltage | V | — | Max to release |
| Datasheet | contact_rating | Contact Rating | A | — | |
| Datasheet | contact_voltage | Contact Voltage | V | — | Max switched |
| Datasheet | contact_resistance | Contact Resistance | Ω | — | Closed state |
| Datasheet | operate_time | Operate Time | s | — | Coil energized to contact closed |
| Datasheet | release_time | Release Time | s | — | |
| Datasheet | mechanical_life | Mechanical Life | ops | — | |
| Datasheet | electrical_life | Electrical Life | ops | — | At rated load |
| Environmental | tc_coil | Coil R TC | ppm/°C | +3930 | Copper winding |
| Environmental | t_min | Min Temp | °C | -40 | |
| Environmental | t_max | Max Temp | °C | 85 | |
| Environmental | dielectric_strength | Dielectric Strength | V | — | Coil to contact isolation |

### 9.2 Crystal / Resonator
**Ref:** Y  
**Pins:** 1 (passive), 2 (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | frequency | Nominal Frequency | Hz | — | |
| Ideal | mode | Vibration Mode | — | fundamental | fundamental/3rd/5th overtone |
| Datasheet | frequency_tolerance | Frequency Tolerance | ppm | ±30 | At 25°C |
| Datasheet | load_capacitance | Load Capacitance | F | 18e-12 | Series or parallel |
| Datasheet | esr | ESR | Ω | — | Equivalent series resistance |
| Datasheet | motional_inductance | Motional L | H | — | Lm |
| Datasheet | motional_capacitance | Motional C | F | — | Cm |
| Datasheet | shunt_capacitance | Shunt C | F | — | C0 |
| Datasheet | drive_level | Drive Level | W | — | Max power dissipation |
| Environmental | tc_freq | Freq TC | ppm/°C | ±0.04 | AT-cut near 25°C |
| Environmental | aging | Annual Aging | ppm/yr | ±2 | |
| Environmental | t_min | Min Temp | °C | -40 | |
| Environmental | t_max | Max Temp | °C | 85 | |

### 9.3 Fuse
**Ref:** F  
**Pins:** A (passive), B (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | current_rating | Current Rating | A | — | |
| Ideal | voltage_rating | Voltage Rating | V | — | |
| Datasheet | blow_type | Blow Type | — | fast | fast/slow/time-delay |
| Datasheet | resistance | Cold Resistance | Ω | — | |
| Datasheet | interrupting_rating | Interrupting Rating | A | — | Max fault current |
| Datasheet | melting_i2t | Pre-arcing I²t | A²s | — | |
| Environmental | tc_resistance | R TC | ppm/°C | +3930 | Copper element |
| Environmental | derating | Current Derating | %/°C | -0.5 | Above 25°C ambient |
| Environmental | t_ambient_max | Max Ambient | °C | 75 | |

### 9.4 Switch (Generic)
**Ref:** SW  
**Pins:** A (passive), B (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | type | Switch Type | — | SPST-NO | SPST/SPDT/DPDT, NO/NC |
| Datasheet | contact_rating | Contact Rating | A | — | |
| Datasheet | voltage_rating | Voltage Rating | V | — | |
| Datasheet | contact_resistance | Contact Resistance | Ω | — | |
| Datasheet | bounce_time | Contact Bounce | s | — | |
| Datasheet | actuation_force | Actuation Force | N | — | |
| Environmental | t_min | Min Temp | °C | -40 | |
| Environmental | t_max | Max Temp | °C | 85 | |
| Environmental | mechanical_life | Mechanical Life | ops | — | |

---

## 10. OPTO-ISOLATORS

### 10.1 Opto-Isolator (Generic)
**Ref:** U  
**Pins:** A (optical), K (passive), C (passive), E (passive)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | ctr | Current Transfer Ratio | % | — | IC_out / IF_in × 100 |
| Ideal | isolation_voltage | Isolation Voltage | V | — | |
| Datasheet | ctr_min | CTR Min | % | — | |
| Datasheet | ctr_max | CTR Max | % | — | |
| Datasheet | if_max | Max Input Current | A | — | |
| Datasheet | vce_sat | Output Vce(sat) | V | — | |
| Datasheet | vceo | Output Vceo | V | — | |
| Datasheet | bvs | Isolation Breakdown | V | — | |
| Datasheet | bandwidth | Bandwidth | Hz | — | |
| Datasheet | rise_time | Rise Time | s | — | |
| Datasheet | fall_time | Fall Time | s | — | |
| Environmental | tc_ctr | CTR TC | %/°C | -0.3 | Decreases with temp |
| Environmental | t_junction_max | Max Junction | °C | 100 | |
| Environmental | aging_ctr | CTR Aging | %/yr | -2 | LED degradation |

---

## 11. HALL EFFECT SENSOR

### 11.1 Hall Effect Sensor (Linear)
**Ref:** U  
**Pins:** VCC (power), GND (ground), OUT (output)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | sensitivity | Sensitivity | V/T | — | Output volts per Tesla |
| Ideal | quiescent_output | Quiescent Output | V | Vcc/2 | No field |
| Datasheet | supply_voltage | Supply Voltage | V | 5 | |
| Datasheet | supply_current | Supply Current | A | — | |
| Datasheet | output_range | Output Range | V | — | |
| Datasheet | bandwidth | Bandwidth | Hz | — | |
| Datasheet | linearity | Linearity | % | — | |
| Datasheet | sensitivity_min | Sensitivity Min | mV/mT | — | |
| Datasheet | sensitivity_typ | Sensitivity Typ | mV/mT | — | |
| Datasheet | sensitivity_max | Sensitivity Max | mV/mT | — | |
| Environmental | tc_sensitivity | Sensitivity TC | %/°C | -0.1 | |
| Environmental | tc_offset | Offset TC | mV/°C | — | |
| Environmental | t_min | Min Temp | °C | -40 | |
| Environmental | t_max | Max Temp | °C | 150 | |

---

## 12. TEST INSTRUMENTS (Ideal)

### 12.1 Multimeter (Ideal)
**Ref:** M  
**Pins:** V+ (input), COM (ground), mA (input), 10A (input)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | input_impedance_v | Input Impedance (V) | Ω | ∞ | Ideal voltmeter |
| Ideal | input_impedance_a | Input Impedance (A) | Ω | 0 | Ideal ammeter |
| Datasheet | dc_voltage_accuracy | DC V Accuracy | % | ±0.5 | |
| Datasheet | ac_voltage_accuracy | AC V Accuracy | % | ±1.2 | |
| Datasheet | dc_current_accuracy | DC I Accuracy | % | ±1.0 | |
| Datasheet | resistance_accuracy | R Accuracy | % | ±0.8 | |
| Datasheet | max_voltage | Max Input Voltage | V | 1000 | CAT III |
| Datasheet | max_current | Max Input Current | A | 10 | |
| Datasheet | frequency_response | AC Frequency Range | Hz | 50–1000 | |
| Environmental | t_min | Min Temp | °C | 0 | |
| Environmental | t_max | Max Temp | °C | 50 | |
| Environmental | tc_accuracy | Accuracy TC | %/°C | 0.1 | Additional error per °C |

### 12.2 Oscilloscope (Ideal)
**Ref:** OS  
**Pins:** CH1 (analog), CH2 (analog), GND (ground), TRIG (input), EXT (input)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | bandwidth | Bandwidth | Hz | ∞ | |
| Ideal | input_impedance | Input Impedance | Ω | ∞ | |
| Datasheet | bandwidth | Bandwidth | Hz | — | −3dB |
| Datasheet | sample_rate | Sample Rate | Sa/s | — | |
| Datasheet | vertical_resolution | Vertical Resolution | bits | 8 | |
| Datasheet | input_impedance | Input Impedance | Ω | 1e6 | 1MΩ ∥ 20pF typical |
| Datasheet | input_capacitance | Input Capacitance | F | 20e-12 | |
| Datasheet | time_accuracy | Time Accuracy | ppm | — | |
| Datasheet | voltage_accuracy | Voltage Accuracy | % | ±3 | |
| Datasheet | max_input_voltage | Max Input | V | 300 | CAT I |
| Environmental | tc_time | Time Base TC | ppm/°C | 5 | |
| Environmental | t_min | Min Temp | °C | 0 | |
| Environmental | t_max | Max Temp | °C | 50 | |

### 12.3 Function Generator (Ideal)
**Ref:** FG  
**Pins:** OUT (output), SYNC (output), GND (ground), EXT (input)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | output_impedance | Output Impedance | Ω | 0 | Ideal |
| Datasheet | frequency_range | Frequency Range | Hz | 0.1–10e6 | |
| Datasheet | output_impedance | Output Impedance | Ω | 50 | |
| Datasheet | amplitude_range | Amplitude Range | Vpp | 0.01–20 | Into 50Ω |
| Datasheet | dc_offset | DC Offset Range | V | ±10 | |
| Datasheet | frequency_accuracy | Freq Accuracy | ppm | ±20 | |
| Datasheet | distortion_sine | Sine THD | % | <1 | |
| Datasheet | rise_time_square | Square Rise Time | s | — | |
| Datasheet | waveforms | Waveforms | — | sine/square/triangle | |
| Environmental | tc_frequency | Freq TC | ppm/°C | 20 | |
| Environmental | t_min | Min Temp | °C | 0 | |
| Environmental | t_max | Max Temp | °C | 50 | |

### 12.4 Spectrum Analyzer (Ideal)
**Ref:** SA  
**Pins:** RF IN (rf), IF OUT (rf), REF OUT (rf), GND (ground)

| Layer | Field | Label | Unit | Default | Notes |
|-------|-------|-------|------|---------|-------|
| Ideal | dynamic_range | Dynamic Range | dB | ∞ | |
| Datasheet | frequency_range | Frequency Range | Hz | — | |
| Datasheet | rbw_min | Min Resolution BW | Hz | — | |
| Datasheet | vbw_min | Min Video BW | Hz | — | |
| Datasheet | dynamic_range | Dynamic Range | dB | — | |
| Datasheet | noise_floor | Displayed Avg Noise | dBm/Hz | — | DANL |
| Datasheet | input_impedance | Input Impedance | Ω | 50 | |
| Datasheet | max_input | Max Input | dBm | +30 | |
| Datasheet | phase_noise | Phase Noise | dBc/Hz | — | At 10kHz offset |
| Datasheet | frequency_accuracy | Freq Accuracy | ppm | — | |
| Environmental | tc_frequency | Freq TC | ppm/°C | 1 | With TCXO reference |
| Environmental | t_min | Min Temp | °C | 0 | |
| Environmental | t_max | Max Temp | °C | 50 | |

---

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-04-05 | Initial governing document — all component types defined |
