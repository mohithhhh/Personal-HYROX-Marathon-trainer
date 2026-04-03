// 16-Week HyroxHalf Training Plan
// Plan Start: June 1, 2026 (Week 1)
// Hyrox Race: September 20, 2026
// Half Marathon: September 27, 2026
//
// Training Days: Monday (Stations), Wednesday (Run), Saturday (Alt: Long Run / Hyrox Sim)
// Odd weeks Saturday = Long Run | Even weeks Saturday = Hyrox Simulation

export const PLAN_START_DATE = '2026-06-01' // Monday
export const HYROX_RACE_DATE = '2026-09-20'
export const HALF_MARATHON_DATE = '2026-09-27'

export const PHASES = [
  { id: 1, name: 'Phase 1', label: 'Foundation', weeks: [1, 2, 3, 4], color: '#6366f1', description: 'Learn the movements, build base aerobic fitness, easy adaptation' },
  { id: 2, name: 'Phase 2', label: 'Build', weeks: [5, 6, 7, 8], color: '#f97316', description: 'Increase volume, introduce race-pace running, full station circuits' },
  { id: 3, name: 'Phase 3', label: 'Peak', weeks: [9, 10, 11, 12, 13], color: '#ef4444', description: 'Race-intensity training, peak long runs, full Hyrox simulations' },
  { id: 4, name: 'Phase 4', label: 'Taper', weeks: [14, 15, 16], color: '#22c55e', description: 'Reduce volume, maintain sharpness, prep for race day' },
]

export const HYROX_STATIONS = [
  { id: 'skierg', name: 'SkiErg', distance: 1000, unit: 'm', icon: '⛷️' },
  { id: 'sled_push', name: 'Sled Push', distance: 50, unit: 'm', icon: '🛷' },
  { id: 'sled_pull', name: 'Sled Pull', distance: 50, unit: 'm', icon: '🔗' },
  { id: 'burpee_jumps', name: 'Burpee Broad Jumps', distance: 80, unit: 'm', icon: '💪' },
  { id: 'rowing', name: 'Rowing', distance: 1000, unit: 'm', icon: '🚣' },
  { id: 'farmer_carry', name: 'Farmer Carry', distance: 200, unit: 'm', icon: '🧑‍🌾' },
  { id: 'sandbag_lunges', name: 'Sandbag Lunges', distance: 100, unit: 'm', icon: '🎒' },
  { id: 'wall_balls', name: 'Wall Balls', reps: 100, unit: 'reps', icon: '🏀' },
]

// Helper to build workout details for each station session
function stationSession(title, exercises, notes = '', duration = 50) {
  return { type: 'stations', title, exercises, notes, duration }
}

function runSession(title, distance, paceDesc, intervals = null, notes = '', duration = null) {
  return {
    type: 'run',
    title,
    distance,
    paceDesc,
    intervals,
    notes,
    duration: duration || Math.round(distance * 8),
  }
}

function hyroxSimSession(stations, notes = '') {
  return {
    type: 'hyrox_sim',
    title: 'Hyrox Simulation',
    stations,
    notes,
    duration: 90,
  }
}

export const TRAINING_WEEKS = [
  // ─────────── PHASE 1 — FOUNDATION ───────────
  {
    week: 1,
    phase: 1,
    focus: 'Learn the machines. Technique over everything.',
    sessions: {
      monday: stationSession(
        'Station Introduction',
        [
          { exercise: 'SkiErg', sets: 3, distance: 400, unit: 'm', rest: '2 min', notes: 'Slow controlled pulls' },
          { exercise: 'Rowing Machine', sets: 3, distance: 400, unit: 'm', rest: '2 min', notes: 'Legs → core → arms sequence' },
          { exercise: 'Pull-ups (or Ring Rows)', sets: 3, reps: 5, rest: '90 sec', notes: 'Full range of motion' },
          { exercise: 'DB Farmer Carry', sets: 2, distance: 50, unit: 'm', weight: '2x10kg', rest: '90 sec', notes: 'Tall posture, small steps' },
        ],
        'This is about learning form, not fitness. Film yourself on the SkiErg.',
        45
      ),
      wednesday: runSession('Easy Base Run', 3, '8–9 min/km, fully conversational', null, 'You should be able to sing a song. Slow down if breathless.'),
      saturday: runSession('First Long Run', 4, '8–9 min/km easy', null, 'Odd week = long run. Out-and-back route, very easy effort.'),
    },
  },
  {
    week: 2,
    phase: 1,
    focus: 'Add sled work. Keep running easy.',
    sessions: {
      monday: stationSession(
        'Sled Introduction',
        [
          { exercise: 'SkiErg', sets: 4, distance: 400, unit: 'm', rest: '90 sec', notes: 'Slightly faster than last week' },
          { exercise: 'Sled Push', sets: 4, distance: 25, unit: 'm', weight: 'Bodyweight only', rest: '2 min', notes: 'Low hips, drive through heels' },
          { exercise: 'DB Farmer Carry', sets: 3, distance: 50, unit: 'm', weight: '2x12kg', rest: '90 sec', notes: 'Increase weight if W1 felt easy' },
          { exercise: 'Pull-ups', sets: 3, reps: 6, rest: '90 sec' },
        ],
        'First sled session — use very light weight. Technique first.',
        50
      ),
      wednesday: runSession('Easy Run', 4, '8–9 min/km', null, 'Nice and easy. Focus on breathing rhythm.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps'],
        'Even week = Hyrox sim. First 4 stations only + 4 x 1km runs. Log times for each station and each run. Light weight on sleds.'
      ),
    },
  },
  {
    week: 3,
    phase: 1,
    focus: 'Introduce burpee broad jumps. Strides on Wednesday.',
    sessions: {
      monday: stationSession(
        'Burpee & Rowing Focus',
        [
          { exercise: 'SkiErg', sets: 3, distance: 500, unit: 'm', rest: '2 min', notes: 'Target consistent pace across sets' },
          { exercise: 'Rowing Machine', sets: 3, distance: 500, unit: 'm', rest: '2 min', notes: 'Focus on catch position' },
          { exercise: 'Burpee Broad Jumps', sets: 3, distance: 20, unit: 'm', rest: '2 min', notes: 'Land soft, jump forward not up' },
          { exercise: 'Sandbag Hold Lunge', sets: 3, reps: 20, weight: '10kg sandbag', rest: '90 sec', notes: 'Sub for sandbag lunges' },
        ],
        'Burpee broad jumps are tricky — watch tutorial first.',
        50
      ),
      wednesday: runSession('Easy Run + Strides', 5, '8–9 min/km easy, last 400m with 2x100m strides', null, 'Strides = short 8-sec accelerations to 5km pace. Walk recovery.'),
      saturday: runSession('Long Run', 5, '8–9 min/km easy', null, 'Odd week = long run. 5km milestone! Keep it conversational.'),
    },
  },
  {
    week: 4,
    phase: 1,
    focus: 'First taste of the Hyrox format. Mini circuit.',
    sessions: {
      monday: stationSession(
        'Mini Hyrox Circuit',
        [
          { exercise: 'SkiErg + 500m Run', sets: 2, distance: 500, unit: 'm', rest: '3 min between rounds', notes: 'SkiErg 500m → jog 500m → rest' },
          { exercise: 'Rowing + 500m Run', sets: 2, distance: 500, unit: 'm', rest: '3 min between rounds', notes: 'Row 500m → jog 500m → rest' },
          { exercise: 'Burpee Broad Jumps', sets: 2, distance: 30, unit: 'm', rest: '2 min' },
          { exercise: 'Farmer Carry', sets: 2, distance: 100, unit: 'm', weight: '2x14kg', rest: '2 min' },
        ],
        'This mimics the Hyrox format: station → run → station. Get used to transitioning while tired.',
        55
      ),
      wednesday: runSession('Easy Run', 5, '8–9 min/km', null, 'End of Phase 1 — reflect on how far you\'ve come.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps', 'rowing', 'farmer_carry'],
        'Even week = 6-station Hyrox sim. First 6 stations + 6 x 1km runs. Sled at light/moderate weight. Note your times!'
      ),
    },
  },

  // ─────────── PHASE 2 — BUILD ───────────
  {
    week: 5,
    phase: 2,
    focus: 'First full 8-station circuit. Running crosses 7km.',
    sessions: {
      monday: stationSession(
        'Full 8-Station Circuit (60%)',
        [
          { exercise: 'SkiErg', sets: 1, distance: 1000, unit: 'm', rest: '3 min', notes: '60% of race pace — comfortable' },
          { exercise: 'Sled Push', sets: 2, distance: 25, unit: 'm', weight: '+20kg', rest: '2 min', notes: 'Moderate weight, maintain low position' },
          { exercise: 'Sled Pull', sets: 2, distance: 25, unit: 'm', weight: '+20kg', rest: '2 min' },
          { exercise: 'Burpee Broad Jumps', sets: 2, distance: 40, unit: 'm', rest: '2 min', notes: 'Steady pace, consistent jumps' },
          { exercise: 'Rowing', sets: 1, distance: 1000, unit: 'm', rest: '3 min', notes: 'Match SkiErg effort' },
          { exercise: 'Farmer Carry', sets: 2, distance: 100, unit: 'm', weight: '2x16kg', rest: '2 min', notes: 'Increase weight from Phase 1' },
          { exercise: 'Sandbag Lunges', sets: 2, distance: 50, unit: 'm', weight: '10kg', rest: '2 min', notes: 'Keep torso upright' },
          { exercise: 'Wall Balls', sets: 3, reps: 25, weight: '4kg', rest: '90 sec', notes: 'Full depth squat, catch high' },
        ],
        'Full 8 stations for the first time! Take your time between stations. This is about exposure.',
        65
      ),
      wednesday: runSession('Tempo Introduction', 7, '8 min/km easy for 5km, then 2km at 6:30 min/km', null, 'First taste of faster running. Last 2km should feel comfortably hard.'),
      saturday: runSession('Long Run', 8, '8–8:30 min/km easy', null, 'Odd week = long run. 8km! Bring water. Fuel with a banana beforehand.'),
    },
  },
  {
    week: 6,
    phase: 2,
    focus: 'First full Hyrox simulation. This is a big milestone.',
    sessions: {
      monday: stationSession(
        'Station Power Day',
        [
          { exercise: 'SkiErg', sets: 2, distance: 1000, unit: 'm', rest: '4 min', notes: 'Push harder than W5 — 70% effort' },
          { exercise: 'Sled Push', sets: 2, distance: 50, unit: 'm', weight: '+30kg', rest: '3 min', notes: 'Full race distance. Keep hips low.' },
          { exercise: 'Burpee Broad Jumps', sets: 2, distance: 40, unit: 'm', rest: '2 min' },
          { exercise: 'Rowing', sets: 2, distance: 1000, unit: 'm', rest: '4 min', notes: 'Target consistent split times' },
        ],
        'Focused power session before Saturday\'s full sim. Keep it controlled.',
        55
      ),
      wednesday: runSession('Interval Run', 7, '5 min easy warm-up, 3x800m at 6:00 min/km, cool-down', [{ reps: 3, distance: 0.8, pace: '6:00 min/km', rest: '2 min walk' }], 'First real intervals. Run by feel — hard but not sprint.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps', 'rowing', 'farmer_carry', 'sandbag_lunges', 'wall_balls'],
        'FULL HYROX SIMULATION #1. All 8 stations + 8x1km runs. Log everything. Don\'t go to max — aim for 75% effort. Focus on pacing. This is a learning exercise.'
      ),
    },
  },
  {
    week: 7,
    phase: 2,
    focus: 'Upper body and carry strength. Long run crosses 9km.',
    sessions: {
      monday: stationSession(
        'Carry & Strength Focus',
        [
          { exercise: 'Farmer Carry', sets: 4, distance: 100, unit: 'm', weight: '2x18kg', rest: '2 min', notes: 'Progressive weight increase' },
          { exercise: 'Sandbag Lunges', sets: 4, distance: 50, unit: 'm', weight: '15kg', rest: '2 min', notes: 'Slower tempo, control each rep' },
          { exercise: 'Wall Balls', sets: 4, reps: 25, weight: '4kg', rest: '90 sec', notes: 'Unbroken sets — rest only between sets' },
          { exercise: 'Pull-ups', sets: 4, reps: 8, rest: '2 min', notes: 'Add weight if possible' },
          { exercise: 'SkiErg', sets: 2, distance: 500, unit: 'm', rest: '2 min', notes: 'Finish with cardio maintenance' },
        ],
        'Carry strength day — the farmer carry and lunges are where many Hyrox races are won or lost.',
        55
      ),
      wednesday: runSession('Easy Long Midweek', 8, '8 min/km easy', null, 'Long midweek run. Should feel easy throughout.'),
      saturday: runSession('Long Run', 9, '8 min/km easy', null, 'Odd week = 9km long run. Halfway milestone — you\'re in shape now!'),
    },
  },
  {
    week: 8,
    phase: 2,
    focus: 'Second full simulation. Start running at race intent.',
    sessions: {
      monday: stationSession(
        'Full Circuit Intensity (70%)',
        [
          { exercise: 'SkiErg', sets: 1, distance: 1000, unit: 'm', rest: '3 min', notes: '70% of max effort' },
          { exercise: 'Sled Push', sets: 1, distance: 50, unit: 'm', weight: '+35kg', rest: '3 min' },
          { exercise: 'Sled Pull', sets: 1, distance: 50, unit: 'm', weight: '+35kg', rest: '3 min' },
          { exercise: 'Burpee Broad Jumps', sets: 1, distance: 80, unit: 'm', rest: '3 min', notes: 'Full race distance!' },
          { exercise: 'Rowing', sets: 1, distance: 1000, unit: 'm', rest: '3 min' },
          { exercise: 'Farmer Carry', sets: 1, distance: 200, unit: 'm', weight: '2x20kg', rest: '3 min', notes: 'Full race distance!' },
          { exercise: 'Sandbag Lunges', sets: 1, distance: 100, unit: 'm', weight: '15kg', rest: '3 min', notes: 'Full race distance!' },
          { exercise: 'Wall Balls', sets: 1, reps: 100, weight: '4kg', rest: '—', notes: 'Full 100 reps! Break into sets of 25' },
        ],
        'Race-distance stations for the first time. Huge milestone. Log every time.',
        70
      ),
      wednesday: runSession('Interval Run — HM Pace', 8, 'Warm-up 2km, 4x1km at 5:45 min/km, cool-down', [{ reps: 4, distance: 1, pace: '5:45 min/km', rest: '90 sec jog' }], 'Longest interval session yet. HM goal pace is ~6:00–6:15 min/km.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps', 'rowing', 'farmer_carry', 'sandbag_lunges', 'wall_balls'],
        'FULL HYROX SIMULATION #2. All 8 stations + 8x1km runs. Compare splits to Sim #1. Aim to improve total time by 5-10%. Log weights used.'
      ),
    },
  },

  // ─────────── PHASE 3 — PEAK ───────────
  {
    week: 9,
    phase: 3,
    focus: 'Peak phase begins. Intensity up, long runs cross 11km.',
    sessions: {
      monday: stationSession(
        'Cardio Station Superset',
        [
          { exercise: 'SkiErg + Row Superset', sets: 3, distance: 1000, unit: 'm each', rest: '4 min between', notes: 'SkiErg 1000m → immediate Row 1000m = 1 round' },
          { exercise: 'Burpee Broad Jumps', sets: 3, distance: 40, unit: 'm', rest: '2 min', notes: 'Fast pace — simulate race intensity' },
          { exercise: 'Wall Balls', sets: 3, reps: 30, weight: '4kg', rest: '90 sec', notes: 'Increasing reps per set vs Phase 2' },
        ],
        'SkiErg → Row superset is brutal. This builds the cardio base for race day.',
        60
      ),
      wednesday: runSession('Long Midweek Run', 10, '7:30–8 min/km easy', null, 'First double-digit midweek! Very easy effort, just log the time on feet.'),
      saturday: runSession('Long Run', 11, '7:30–8 min/km easy', null, 'Odd week = 11km. Run with a friend or playlist. This is your new long run PR!'),
    },
  },
  {
    week: 10,
    phase: 3,
    focus: 'Third simulation. Peak simulation quality.',
    sessions: {
      monday: stationSession(
        'Full Stations at 80%',
        [
          { exercise: 'SkiErg', sets: 1, distance: 1000, unit: 'm', rest: '3 min', notes: '80% of max effort — should feel hard' },
          { exercise: 'Sled Push', sets: 1, distance: 50, unit: 'm', weight: '+40kg', rest: '3 min', notes: 'Increase weight from W8' },
          { exercise: 'Sled Pull', sets: 1, distance: 50, unit: 'm', weight: '+40kg', rest: '3 min' },
          { exercise: 'Burpee Broad Jumps', sets: 1, distance: 80, unit: 'm', rest: '3 min', notes: 'Race pace' },
          { exercise: 'Rowing', sets: 1, distance: 1000, unit: 'm', rest: '3 min', notes: 'Target sub-4:30 for 1000m' },
          { exercise: 'Farmer Carry', sets: 1, distance: 200, unit: 'm', weight: '2x20kg', rest: '3 min' },
          { exercise: 'Sandbag Lunges', sets: 1, distance: 100, unit: 'm', weight: '20kg', rest: '3 min', notes: 'Increase sandbag weight' },
          { exercise: 'Wall Balls', sets: 1, reps: 100, weight: '4kg', rest: '—', notes: 'Try 2 sets of 50' },
        ],
        'Train like you race. Every rep counts.',
        70
      ),
      wednesday: runSession('Peak Interval Run', 10, 'Warm-up 2km, 5x1km at 5:30 min/km, cool-down', [{ reps: 5, distance: 1, pace: '5:30 min/km', rest: '90 sec jog' }], 'Your hardest run session. 5km of intervals at race pace.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps', 'rowing', 'farmer_carry', 'sandbag_lunges', 'wall_balls'],
        'FULL HYROX SIMULATION #3. This is the big one. Push to 85% effort. Target a personal best total time. Log every split.'
      ),
    },
  },
  {
    week: 11,
    phase: 3,
    focus: 'PEAK week — longest run of the program (12km).',
    sessions: {
      monday: stationSession(
        'Power Station Day',
        [
          { exercise: 'Sled Push', sets: 3, distance: 50, unit: 'm', weight: '+45kg', rest: '4 min', notes: 'Heavy sled — max power output' },
          { exercise: 'Farmer Carry', sets: 3, distance: 100, unit: 'm', weight: '2x22kg', rest: '3 min', notes: 'Heaviest carry yet' },
          { exercise: 'Wall Balls', sets: 4, reps: 25, weight: '4kg', rest: '90 sec', notes: 'Fast pace, minimal rest in sets' },
          { exercise: 'SkiErg', sets: 2, distance: 500, unit: 'm', rest: '2 min', notes: 'Finisher — stay strong despite fatigue' },
        ],
        'Strength focus day. The sled and carry are where Hyrox is decided.',
        55
      ),
      wednesday: runSession('Peak Midweek Run', 12, '7:30 min/km easy', null, 'Longest midweek run! Proof that you\'re half-marathon ready.'),
      saturday: runSession('PEAK Long Run', 12, '7:30 min/km easy', null, 'Odd week = 12km PEAK long run. This is your longest run in training. Celebrate this milestone! Fuel properly before and after.'),
    },
  },
  {
    week: 12,
    phase: 3,
    focus: 'Fourth simulation at race intensity. Final heavy week.',
    sessions: {
      monday: stationSession(
        'Full Circuit — Race Intensity (85%)',
        [
          { exercise: 'SkiErg', sets: 1, distance: 1000, unit: 'm', rest: '3 min', notes: 'Race pace effort — go!' },
          { exercise: 'Sled Push', sets: 1, distance: 50, unit: 'm', weight: '+45kg', rest: '3 min' },
          { exercise: 'Sled Pull', sets: 1, distance: 50, unit: 'm', weight: '+45kg', rest: '3 min' },
          { exercise: 'Burpee Broad Jumps', sets: 1, distance: 80, unit: 'm', rest: '3 min' },
          { exercise: 'Rowing', sets: 1, distance: 1000, unit: 'm', rest: '3 min' },
          { exercise: 'Farmer Carry', sets: 1, distance: 200, unit: 'm', weight: '2x22kg', rest: '3 min' },
          { exercise: 'Sandbag Lunges', sets: 1, distance: 100, unit: 'm', weight: '20kg', rest: '3 min' },
          { exercise: 'Wall Balls', sets: 1, reps: 100, weight: '4kg', rest: '—', notes: 'Straight through if possible' },
        ],
        'Peak intensity station day before taper begins.',
        70
      ),
      wednesday: runSession('Final Big Interval Session', 11, 'Warm-up 2km, 6x1km at 5:30 min/km, cool-down', [{ reps: 6, distance: 1, pace: '5:30 min/km', rest: '90 sec jog' }], 'Last big interval session. 6km of quality work. Finish strong.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps', 'rowing', 'farmer_carry', 'sandbag_lunges', 'wall_balls'],
        'FULL HYROX SIMULATION #4. Max effort. Aim for a new personal best total time. This is the last full sim before taper. Race-day weights!'
      ),
    },
  },
  {
    week: 13,
    phase: 3,
    focus: 'Technical focus. Taper begins this Saturday.',
    sessions: {
      monday: stationSession(
        'Technical Drill Day',
        [
          { exercise: 'SkiErg — Technique Reps', sets: 3, distance: 300, unit: 'm', rest: '90 sec', notes: 'Focus on arm pull-down, not arm push-back' },
          { exercise: 'Burpee Broad Jumps — Form Work', sets: 3, distance: 20, unit: 'm', rest: '90 sec', notes: 'Perfect hip extension, land soft' },
          { exercise: 'Rowing — Catch & Drive', sets: 3, distance: 300, unit: 'm', rest: '90 sec', notes: 'Legs → body → arms. Time your catch.' },
          { exercise: 'Wall Balls — Rhythm Work', sets: 3, reps: 20, weight: '4kg', rest: '90 sec', notes: 'Find a rhythm — squat, throw, catch' },
          { exercise: 'Farmer Carry — Posture', sets: 2, distance: 100, unit: 'm', weight: '2x20kg', rest: '2 min', notes: 'Chest tall, shoulders back, core braced' },
        ],
        'Technique day — perfect practice makes perfect. Light but intentional.',
        50
      ),
      wednesday: runSession('Taper Start Run', 10, '7:30 min/km easy — start to feel fresh', null, 'Volume drops this week. Keep it easy and enjoy the fitness you\'ve built.'),
      saturday: runSession('Gentle Long Run', 10, '7:30 min/km very easy', null, 'Odd week = long run. Taper begins — 10km but truly easy effort. Conserve energy.'),
    },
  },

  // ─────────── PHASE 4 — TAPER ───────────
  {
    week: 14,
    phase: 4,
    focus: 'Volume drops 40%. Final full simulation.',
    sessions: {
      monday: stationSession(
        'Reduced Volume Stations (60%)',
        [
          { exercise: 'SkiErg', sets: 1, distance: 1000, unit: 'm', rest: '3 min', notes: 'Maintain intensity, reduce volume' },
          { exercise: 'Sled Push', sets: 1, distance: 50, unit: 'm', weight: '+40kg', rest: '3 min' },
          { exercise: 'Burpee Broad Jumps', sets: 1, distance: 40, unit: 'm', rest: '2 min', notes: 'Half distance, full effort' },
          { exercise: 'Rowing', sets: 1, distance: 1000, unit: 'm', rest: '3 min' },
          { exercise: 'Farmer Carry', sets: 1, distance: 100, unit: 'm', weight: '2x20kg', rest: '2 min', notes: 'Half distance' },
          { exercise: 'Wall Balls', sets: 2, reps: 25, weight: '4kg', rest: '90 sec', notes: 'Half volume' },
        ],
        'Maintain fitness, shed fatigue. Intensity stays high, volume is cut.',
        45
      ),
      wednesday: runSession('Easy Taper Run', 8, '8 min/km easy', null, 'Short and easy. Your legs should start feeling springy.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps', 'rowing', 'farmer_carry', 'sandbag_lunges', 'wall_balls'],
        'FINAL HYROX SIMULATION — Race Preview. All 8 stations at 90% effort. This is your dress rehearsal. Practice transitions, nutrition, mindset. Log every split.'
      ),
    },
  },
  {
    week: 15,
    phase: 4,
    focus: 'Volume drops 60%. Keep legs sharp.',
    sessions: {
      monday: stationSession(
        'Activation Stations (40%)',
        [
          { exercise: 'SkiErg', sets: 1, distance: 500, unit: 'm', rest: '2 min', notes: 'Feel the power — it\'s there!' },
          { exercise: 'Sled Push', sets: 1, distance: 25, unit: 'm', weight: '+35kg', rest: '2 min' },
          { exercise: 'Rowing', sets: 1, distance: 500, unit: 'm', rest: '2 min' },
          { exercise: 'Wall Balls', sets: 2, reps: 20, weight: '4kg', rest: '90 sec' },
          { exercise: 'Farmer Carry', sets: 1, distance: 50, unit: 'm', weight: '2x20kg', rest: '2 min' },
        ],
        'Short and sharp. You\'re not building fitness anymore — you\'re storing energy.',
        35
      ),
      wednesday: runSession('Sharpener Run', 6, 'Easy 4km warm-up, 4x200m strides, cool-down', [{ reps: 4, distance: 0.2, pace: '4:30–5:00 min/km', rest: '2 min walk' }], 'Strides wake the legs up without taxing them. You should feel FAST.'),
      saturday: runSession('Easy Confidence Run', 5, '8 min/km very easy', null, 'Odd week = easy run. Just 5km. Enjoy running. You\'re ready.'),
    },
  },
  {
    week: 16,
    phase: 4,
    focus: '🏁 RACE WEEK — Hyrox Sep 20 | Half Marathon Sep 27.',
    sessions: {
      monday: stationSession(
        'Pre-Race Activation',
        [
          { exercise: 'SkiErg', sets: 1, distance: 200, unit: 'm', rest: '2 min', notes: 'Just wake the movement pattern up' },
          { exercise: 'Rowing', sets: 1, distance: 200, unit: 'm', rest: '2 min' },
          { exercise: 'Burpee Broad Jumps', sets: 1, distance: 10, unit: 'm', rest: '2 min', notes: '5 reps only — stay explosive' },
          { exercise: 'Wall Balls', sets: 1, reps: 10, weight: '4kg', rest: '—' },
        ],
        'DO NOT tire yourself. 15-20 min total. This is just to feel the movements before race day.',
        20
      ),
      wednesday: runSession('Race Week Shake-out', 3, '8 min/km easy', null, 'Gentle 3km. Loose and easy. Trust your training.'),
      saturday: {
        type: 'race',
        title: '🏆 HYROX RACE DAY',
        notes: 'You\'ve done 16 weeks. You\'re ready. Trust your training, control your pace in the first 4 stations, and leave everything on the floor in the last 4. GO!',
        duration: 120,
        isRaceDay: true,
      },
    },
  },
]

// Helper: get week number for a given date
export function getWeekNumber(date) {
  const start = new Date(PLAN_START_DATE)
  const d = new Date(date)
  const diffMs = d - start
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return Math.floor(diffDays / 7) + 1
}

// Helper: get the date for a given week's day
export function getSessionDate(weekNum, dayOfWeek) {
  const start = new Date(PLAN_START_DATE) // Monday
  const weekOffset = (weekNum - 1) * 7
  const dayOffsets = { monday: 0, wednesday: 2, saturday: 5 }
  const dayOffset = dayOffsets[dayOfWeek] || 0
  const date = new Date(start)
  date.setDate(start.getDate() + weekOffset + dayOffset)
  return date.toISOString().split('T')[0]
}

// Helper: get phase for a week number
export function getPhaseForWeek(weekNum) {
  return PHASES.find(p => p.weeks.includes(weekNum)) || PHASES[0]
}

// Helper: get today's training week and session
export function getTodaySession() {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const weekNum = getWeekNumber(today)
  if (weekNum < 1 || weekNum > 16) return null
  const week = TRAINING_WEEKS[weekNum - 1]
  if (!week) return null
  const dayOfWeek = today.getDay() // 0=Sun, 1=Mon, 3=Wed, 6=Sat
  const dayMap = { 1: 'monday', 3: 'wednesday', 6: 'saturday' }
  const day = dayMap[dayOfWeek]
  if (!day || !week.sessions[day]) return null
  return { week, session: week.sessions[day], day, weekNum }
}

// Helper: get this week's sessions with dates
export function getThisWeekSessions() {
  const weekNum = getWeekNumber(new Date())
  if (weekNum < 1 || weekNum > 16) return null
  const week = TRAINING_WEEKS[weekNum - 1]
  return {
    weekNum,
    week,
    sessions: [
      { day: 'monday', date: getSessionDate(weekNum, 'monday'), session: week.sessions.monday },
      { day: 'wednesday', date: getSessionDate(weekNum, 'wednesday'), session: week.sessions.wednesday },
      { day: 'saturday', date: getSessionDate(weekNum, 'saturday'), session: week.sessions.saturday },
    ].filter(s => s.session),
  }
}
