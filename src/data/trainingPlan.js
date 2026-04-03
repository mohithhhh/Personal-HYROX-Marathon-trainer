// 24-Week HyroxHalf Training Plan
// Plan Start: April 6, 2026 (Monday, Week 1)
// Hyrox Race: September 18, 2026
// Half Marathon: September 27, 2026
//
// Training Days: Monday (Gym/Stations), Wednesday (Run), Saturday (Alt: Long Run / Hyrox Sim)
// Odd weeks Saturday = Long Run | Even weeks Saturday = Hyrox Simulation
// Phase 0 (Weeks 1–8):  Pre-Base  — build the habit, introduce all movements
// Phase 1 (Weeks 9–12): Foundation — learn machines, build aerobic base
// Phase 2 (Weeks 13–16):Build      — increase volume, race-pace running
// Phase 3 (Weeks 17–21):Peak       — race-intensity, full Hyrox sims
// Phase 4 (Weeks 22–24):Taper      — shed fatigue, race week

export const PLAN_START_DATE = '2026-04-06' // Monday
export const HYROX_RACE_DATE = '2026-09-18'
export const HALF_MARATHON_DATE = '2026-09-27'

export const PHASES = [
  { id: 0, name: 'Phase 0', label: 'Pre-Base', weeks: [1,2,3,4,5,6,7,8], description: 'Build the habit, introduce all movements at low intensity. Consistency over intensity.' },
  { id: 1, name: 'Phase 1', label: 'Foundation', weeks: [9,10,11,12], description: 'Learn the machines, build base aerobic fitness, easy adaptation' },
  { id: 2, name: 'Phase 2', label: 'Build', weeks: [13,14,15,16], description: 'Increase volume, introduce race-pace running, full station circuits' },
  { id: 3, name: 'Phase 3', label: 'Peak', weeks: [17,18,19,20,21], description: 'Race-intensity training, peak long runs, full Hyrox simulations' },
  { id: 4, name: 'Phase 4', label: 'Taper', weeks: [22,23,24], description: 'Reduce volume, maintain sharpness, prep for race day' },
]

export const HYROX_STATIONS = [
  { id: 'skierg', name: 'SkiErg', distance: 1000, unit: 'm' },
  { id: 'sled_push', name: 'Sled Push', distance: 50, unit: 'm' },
  { id: 'sled_pull', name: 'Sled Pull', distance: 50, unit: 'm' },
  { id: 'burpee_jumps', name: 'Burpee Broad Jumps', distance: 80, unit: 'm' },
  { id: 'rowing', name: 'Rowing', distance: 1000, unit: 'm' },
  { id: 'farmer_carry', name: 'Farmer Carry', distance: 200, unit: 'm' },
  { id: 'sandbag_lunges', name: 'Sandbag Lunges', distance: 100, unit: 'm' },
  { id: 'wall_balls', name: 'Wall Balls', reps: 100, unit: 'reps' },
]

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
  // ─────────── PHASE 0 — PRE-BASE (Weeks 1–8, Apr 6 – May 31) ───────────
  {
    week: 1,
    phase: 0,
    focus: 'Start the journey. Walk before you run.',
    sessions: {
      monday: stationSession(
        'Body Awareness',
        [
          { exercise: 'Brisk Walk', sets: 1, distance: 20, unit: 'min', notes: 'Get moving — the habit is the goal' },
          { exercise: 'Bodyweight Squat', sets: 3, reps: 10, rest: '90 sec', notes: 'Full depth, heels down, chest up' },
          { exercise: 'Push-ups', sets: 3, reps: 8, rest: '90 sec', notes: 'Knees down if needed — quality over quantity' },
          { exercise: 'Dead Bug', sets: 3, reps: 10, rest: '60 sec', notes: 'Core control. Slow and deliberate.' },
        ],
        'Week 1. Low bar. Just show up — the habit is more important than the workout.',
        30
      ),
      wednesday: runSession('First Run — Walk/Run', 2, 'Run 1 min, walk 2 min, repeat', null, 'No ego. Walk as much as needed. 20–25 min total.', 25),
      saturday: runSession('Easy Walk-Run', 3, 'Run 2 min, walk 1 min. Fully conversational.', null, 'Explore a route. Enjoy being outside.', 28),
    },
  },
  {
    week: 2,
    phase: 0,
    focus: 'Build the habit. Three sessions, no excuses.',
    sessions: {
      monday: stationSession(
        'Strength Fundamentals',
        [
          { exercise: 'Goblet Squat', sets: 3, reps: 12, weight: '8–10kg', rest: '90 sec', notes: 'Chest up, knees out, full depth' },
          { exercise: 'Dumbbell Row', sets: 3, reps: 10, weight: '8–10kg per side', rest: '90 sec', notes: 'Drive elbow back, not the hand' },
          { exercise: 'Plank', sets: 3, reps: 30, unit: 'sec', rest: '60 sec', notes: 'Squeeze glutes and abs throughout' },
          { exercise: 'Bodyweight Lunge', sets: 3, reps: 12, rest: '90 sec', notes: 'Each leg. Touch knee gently to floor.' },
        ],
        'Light weights. Perfect form. Lay the foundation.',
        35
      ),
      wednesday: runSession('Easy Run', 3, '9 min/km — fully conversational', null, 'If you need to walk, walk. Keep showing up.'),
      saturday: runSession('Easy Run', 4, '9 min/km — enjoy it', null, 'Slightly longer. Out and back or a loop. Bring music.'),
    },
  },
  {
    week: 3,
    phase: 0,
    focus: 'Running gets consistent. Introduce hip hinge pattern.',
    sessions: {
      monday: stationSession(
        'Core & Lower Body',
        [
          { exercise: 'Romanian Deadlift', sets: 3, reps: 10, weight: '2x10kg DBs', rest: '90 sec', notes: 'Hinge at hips, soft knees, back flat' },
          { exercise: 'Lateral Lunge', sets: 3, reps: 10, rest: '90 sec', notes: 'Push hips back, chest up' },
          { exercise: 'Bird Dog', sets: 3, reps: 10, rest: '60 sec', notes: 'Opposite arm and leg. Hold 2 sec at top.' },
          { exercise: 'Hollow Hold', sets: 3, reps: 20, unit: 'sec', rest: '60 sec', notes: 'Lower back pressed to floor at all times' },
        ],
        'Hip hinge is critical for the Hyrox sled and rowing. Master it now.',
        35
      ),
      wednesday: runSession('Continuous Easy Run', 3, '8:30–9 min/km easy', null, 'Goal: run 3km without stopping. Very slow if needed.'),
      saturday: runSession('First 5k Attempt', 5, '9 min/km — steady easy pace', null, 'Your first 5km! Pace yourself. It\'s a milestone.'),
    },
  },
  {
    week: 4,
    phase: 0,
    focus: 'Machines for the first time. SkiErg and Row.',
    sessions: {
      monday: stationSession(
        'Machine Introduction',
        [
          { exercise: 'SkiErg', sets: 3, distance: 200, unit: 'm', rest: '2 min', notes: 'Watch tutorial first. Arms pull down — drive with lats.' },
          { exercise: 'Rowing Machine', sets: 3, distance: 200, unit: 'm', rest: '2 min', notes: 'Legs → body → arms sequence. Catch position is key.' },
          { exercise: 'Goblet Squat', sets: 3, reps: 12, weight: '10–12kg', rest: '90 sec' },
          { exercise: 'Farmer Hold', sets: 3, reps: 30, unit: 'sec', weight: '2x10kg', rest: '90 sec', notes: 'Stand tall. Core tight. Shoulders back.' },
        ],
        'First time on the machines! Film yourself and compare form to tutorials.',
        40
      ),
      wednesday: runSession('Easy Run', 4, '8:30 min/km easy', null, 'Keep it comfortable. Focus on breathing rhythm.'),
      saturday: runSession('Easy Long Run', 5, '9 min/km easy', null, 'End of month 1. Look how far you\'ve come.'),
    },
  },
  {
    week: 5,
    phase: 0,
    focus: 'Add carries. Running stays easy.',
    sessions: {
      monday: stationSession(
        'Carries & Machine Build',
        [
          { exercise: 'SkiErg', sets: 3, distance: 300, unit: 'm', rest: '2 min', notes: 'Slightly longer. Find a steady rhythm.' },
          { exercise: 'DB Farmer Carry', sets: 3, distance: 30, unit: 'm', weight: '2x10kg', rest: '90 sec', notes: 'Walk tall. No leaning side to side.' },
          { exercise: 'Sandbag Hold Lunge', sets: 3, reps: 16, weight: '10kg', rest: '90 sec', notes: 'Hug the bag. Keep torso upright.' },
          { exercise: 'Rowing Machine', sets: 3, distance: 300, unit: 'm', rest: '90 sec', notes: 'Aim for consistent split per set' },
        ],
        'Carry strength is underrated. Awkward heavy loads build real Hyrox-specific fitness.',
        40
      ),
      wednesday: runSession('Progression Run', 4, '9 min/km for 2km then 8 min/km for 2km', null, 'First time running two paces in one session.'),
      saturday: runSession('Easy Long Run', 6, '9 min/km easy', null, 'Odd week = long run. 6km — new personal best!'),
    },
  },
  {
    week: 6,
    phase: 0,
    focus: 'Wall balls and full carry practice.',
    sessions: {
      monday: stationSession(
        'Full Movement Intro',
        [
          { exercise: 'SkiErg', sets: 4, distance: 300, unit: 'm', rest: '90 sec', notes: 'Build slightly each set' },
          { exercise: 'Farmer Carry', sets: 3, distance: 50, unit: 'm', weight: '2x12kg', rest: '90 sec', notes: 'Heavier than last week' },
          { exercise: 'Wall Balls', sets: 3, reps: 15, weight: '4kg', rest: '90 sec', notes: 'Full squat, throw above target, catch and squat again' },
          { exercise: 'Rowing Machine', sets: 3, distance: 400, unit: 'm', rest: '90 sec' },
        ],
        'Wall balls feel awkward at first. Stick with it — they\'re a huge part of race day.',
        45
      ),
      wednesday: runSession('Easy Run', 5, '8:30 min/km easy', null, 'Comfortable steady pace.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps'],
        'Even week = mini Hyrox sim! 4 stations + 4×1km runs. Very light sled. This is exploration — log times for future comparison.'
      ),
    },
  },
  {
    week: 7,
    phase: 0,
    focus: 'Volume increases. Stations get harder.',
    sessions: {
      monday: stationSession(
        'Station Circuit Build',
        [
          { exercise: 'SkiErg', sets: 2, distance: 500, unit: 'm', rest: '2 min', notes: 'Aim for consistent split time across sets' },
          { exercise: 'Rowing Machine', sets: 2, distance: 500, unit: 'm', rest: '2 min', notes: 'Match SkiErg effort level' },
          { exercise: 'Farmer Carry', sets: 3, distance: 50, unit: 'm', weight: '2x14kg', rest: '90 sec' },
          { exercise: 'Wall Balls', sets: 3, reps: 20, weight: '4kg', rest: '90 sec', notes: 'Aim for unbroken sets' },
          { exercise: 'Burpee Broad Jumps', sets: 2, distance: 15, unit: 'm', rest: '2 min', notes: 'Short but practise the pattern — land soft, jump forward' },
        ],
        '7 weeks in. This is a lifestyle now.',
        50
      ),
      wednesday: runSession('Steady Run', 6, '8–8:30 min/km comfortable', null, 'First 6km midweek!'),
      saturday: runSession('Long Run', 7, '8:30 min/km easy', null, 'Odd week = long run. 7km — ready for Phase 1 next week.'),
    },
  },
  {
    week: 8,
    phase: 0,
    focus: 'Pre-Phase 1 assessment week. Benchmark everything.',
    sessions: {
      monday: stationSession(
        'Movement Assessment',
        [
          { exercise: 'SkiErg', sets: 2, distance: 400, unit: 'm', rest: '2 min', notes: 'Film yourself — compare to week 4 footage' },
          { exercise: 'Rowing Machine', sets: 2, distance: 400, unit: 'm', rest: '2 min', notes: 'Note split times for each 400m' },
          { exercise: 'Burpee Broad Jumps', sets: 2, distance: 20, unit: 'm', rest: '2 min', notes: 'Controlled jumps, land soft' },
          { exercise: 'Farmer Carry', sets: 2, distance: 50, unit: 'm', weight: '2x14kg', rest: '90 sec', notes: 'How does this feel vs week 5?' },
          { exercise: 'Wall Balls', sets: 2, reps: 20, weight: '4kg', rest: '90 sec', notes: 'Rhythm check — can you go unbroken?' },
        ],
        '8 weeks in. Log everything today — this is your baseline before the real program begins.',
        50
      ),
      wednesday: runSession('Easy Run', 5, '8:30 min/km easy', null, 'Recovery pace. Enjoy the fitness you\'ve built.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps'],
        'Even week = 4-station sim. Your pre-Phase 1 benchmark. Log every station and run time carefully.'
      ),
    },
  },

  // ─────────── PHASE 1 — FOUNDATION (Weeks 9–12) ───────────
  {
    week: 9,
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
    week: 10,
    phase: 1,
    focus: 'Add sled work. Keep running easy.',
    sessions: {
      monday: stationSession(
        'Sled Introduction',
        [
          { exercise: 'SkiErg', sets: 4, distance: 400, unit: 'm', rest: '90 sec', notes: 'Slightly faster than last week' },
          { exercise: 'Sled Push', sets: 4, distance: 25, unit: 'm', weight: 'Bodyweight only', rest: '2 min', notes: 'Low hips, drive through heels' },
          { exercise: 'DB Farmer Carry', sets: 3, distance: 50, unit: 'm', weight: '2x12kg', rest: '90 sec', notes: 'Increase weight if W9 felt easy' },
          { exercise: 'Pull-ups', sets: 3, reps: 6, rest: '90 sec' },
        ],
        'First sled session — use very light weight. Technique first.',
        50
      ),
      wednesday: runSession('Easy Run', 4, '8–9 min/km', null, 'Nice and easy. Focus on breathing rhythm.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps'],
        'Even week = Hyrox sim. First 4 stations only + 4×1km runs. Light weight on sleds. Log times.'
      ),
    },
  },
  {
    week: 11,
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
      wednesday: runSession('Easy Run + Strides', 5, '8–9 min/km easy, last 400m with 2×100m strides', null, 'Strides = short 8-sec accelerations to 5km pace. Walk recovery.'),
      saturday: runSession('Long Run', 5, '8–9 min/km easy', null, 'Odd week = long run. Keep it conversational.'),
    },
  },
  {
    week: 12,
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
        'Even week = 6-station Hyrox sim. First 6 stations + 6×1km runs. Sled at light/moderate weight. Note your times!'
      ),
    },
  },

  // ─────────── PHASE 2 — BUILD (Weeks 13–16) ───────────
  {
    week: 13,
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
    week: 14,
    phase: 2,
    focus: 'First full Hyrox simulation. This is a big milestone.',
    sessions: {
      monday: stationSession(
        'Station Power Day',
        [
          { exercise: 'SkiErg', sets: 2, distance: 1000, unit: 'm', rest: '4 min', notes: 'Push harder than W13 — 70% effort' },
          { exercise: 'Sled Push', sets: 2, distance: 50, unit: 'm', weight: '+30kg', rest: '3 min', notes: 'Full race distance. Keep hips low.' },
          { exercise: 'Burpee Broad Jumps', sets: 2, distance: 40, unit: 'm', rest: '2 min' },
          { exercise: 'Rowing', sets: 2, distance: 1000, unit: 'm', rest: '4 min', notes: 'Target consistent split times' },
        ],
        'Focused power session before Saturday\'s full sim. Keep it controlled.',
        55
      ),
      wednesday: runSession('Interval Run', 7, '5 min easy warm-up, 3×800m at 6:00 min/km, cool-down', [{ reps: 3, distance: 0.8, pace: '6:00 min/km', rest: '2 min walk' }], 'First real intervals. Run by feel — hard but not sprint.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps', 'rowing', 'farmer_carry', 'sandbag_lunges', 'wall_balls'],
        'FULL HYROX SIMULATION #1. All 8 stations + 8×1km runs. Log everything. Don\'t go to max — aim for 75% effort. Focus on pacing.'
      ),
    },
  },
  {
    week: 15,
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
      saturday: runSession('Long Run', 9, '8 min/km easy', null, 'Odd week = 9km long run. You\'re in shape now!'),
    },
  },
  {
    week: 16,
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
      wednesday: runSession('Interval Run — HM Pace', 8, 'Warm-up 2km, 4×1km at 5:45 min/km, cool-down', [{ reps: 4, distance: 1, pace: '5:45 min/km', rest: '90 sec jog' }], 'Longest interval session yet. HM goal pace is ~6:00–6:15 min/km.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps', 'rowing', 'farmer_carry', 'sandbag_lunges', 'wall_balls'],
        'FULL HYROX SIMULATION #2. All 8 stations + 8×1km runs. Compare splits to Sim #1. Aim to improve total time by 5-10%.'
      ),
    },
  },

  // ─────────── PHASE 3 — PEAK (Weeks 17–21) ───────────
  {
    week: 17,
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
      wednesday: runSession('Long Midweek Run', 10, '7:30–8 min/km easy', null, 'First double-digit midweek! Very easy effort.'),
      saturday: runSession('Long Run', 11, '7:30–8 min/km easy', null, 'Odd week = 11km. New long run PR!'),
    },
  },
  {
    week: 18,
    phase: 3,
    focus: 'Third simulation. Peak simulation quality.',
    sessions: {
      monday: stationSession(
        'Full Stations at 80%',
        [
          { exercise: 'SkiErg', sets: 1, distance: 1000, unit: 'm', rest: '3 min', notes: '80% of max effort — should feel hard' },
          { exercise: 'Sled Push', sets: 1, distance: 50, unit: 'm', weight: '+40kg', rest: '3 min', notes: 'Increase weight from W16' },
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
      wednesday: runSession('Peak Interval Run', 10, 'Warm-up 2km, 5×1km at 5:30 min/km, cool-down', [{ reps: 5, distance: 1, pace: '5:30 min/km', rest: '90 sec jog' }], 'Your hardest run session. 5km of intervals at race pace.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps', 'rowing', 'farmer_carry', 'sandbag_lunges', 'wall_balls'],
        'FULL HYROX SIMULATION #3. Push to 85% effort. Target a personal best total time. Log every split.'
      ),
    },
  },
  {
    week: 19,
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
      saturday: runSession('PEAK Long Run', 12, '7:30 min/km easy', null, 'Odd week = 12km PEAK long run. Your longest run in training. Celebrate this! Fuel properly before and after.'),
    },
  },
  {
    week: 20,
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
      wednesday: runSession('Final Big Interval Session', 11, 'Warm-up 2km, 6×1km at 5:30 min/km, cool-down', [{ reps: 6, distance: 1, pace: '5:30 min/km', rest: '90 sec jog' }], 'Last big interval session. 6km of quality work. Finish strong.'),
      saturday: hyroxSimSession(
        ['skierg', 'sled_push', 'sled_pull', 'burpee_jumps', 'rowing', 'farmer_carry', 'sandbag_lunges', 'wall_balls'],
        'FULL HYROX SIMULATION #4. Max effort. Aim for a new personal best. This is the last full sim before taper. Race-day weights!'
      ),
    },
  },
  {
    week: 21,
    phase: 3,
    focus: 'Technical focus. Taper begins this Saturday.',
    sessions: {
      monday: stationSession(
        'Technical Drill Day',
        [
          { exercise: 'SkiErg — Technique Reps', sets: 3, distance: 300, unit: 'm', rest: '90 sec', notes: 'Focus on arm pull-down, not push-back' },
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

  // ─────────── PHASE 4 — TAPER (Weeks 22–24) ───────────
  {
    week: 22,
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
        'FINAL HYROX SIMULATION — Race Preview. All 8 stations at 90% effort. Dress rehearsal. Practice transitions, nutrition, mindset. Log every split.'
      ),
    },
  },
  {
    week: 23,
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
      wednesday: runSession('Sharpener Run', 6, 'Easy 4km warm-up, 4×200m strides, cool-down', [{ reps: 4, distance: 0.2, pace: '4:30–5:00 min/km', rest: '2 min walk' }], 'Strides wake the legs up without taxing them. You should feel FAST.'),
      saturday: runSession('Easy Confidence Run', 5, '8 min/km very easy', null, 'Odd week = easy run. Just 5km. Enjoy running. You\'re ready.'),
    },
  },
  {
    week: 24,
    phase: 4,
    focus: '🏁 RACE WEEK — Hyrox Sep 18 | Half Marathon Sep 27.',
    sessions: {
      monday: stationSession(
        'Pre-Race Activation',
        [
          { exercise: 'SkiErg', sets: 1, distance: 200, unit: 'm', rest: '2 min', notes: 'Just wake the movement pattern up' },
          { exercise: 'Rowing', sets: 1, distance: 200, unit: 'm', rest: '2 min' },
          { exercise: 'Burpee Broad Jumps', sets: 1, distance: 10, unit: 'm', rest: '2 min', notes: '5 reps only — stay explosive' },
          { exercise: 'Wall Balls', sets: 1, reps: 10, weight: '4kg', rest: '—' },
        ],
        'DO NOT tire yourself. 15–20 min total. Just feel the movements before race day.',
        20
      ),
      wednesday: runSession('Race Week Shake-out', 3, '8 min/km easy', null, 'Gentle 3km. Loose and easy. Trust your training.'),
      thursday: {
        type: 'race',
        title: '🏆 HYROX RACE DAY — Sep 18',
        notes: 'You\'ve done 24 weeks. You\'re ready. Trust your training, control your pace in the first 4 stations, and leave everything on the floor in the last 4. GO!',
        duration: 120,
        isRaceDay: true,
      },
      saturday: {
        type: 'race',
        title: '🏅 HALF MARATHON — Sep 27',
        notes: 'One week after Hyrox. Your legs will be tired but your aerobic engine is primed. Run smart — start conservative, finish strong. You\'ve earned this!',
        duration: 150,
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
  const dayOffsets = { monday: 0, wednesday: 2, thursday: 3, friday: 4, saturday: 5 }
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
  const weekNum = getWeekNumber(today)
  if (weekNum < 1 || weekNum > 24) return null
  const week = TRAINING_WEEKS[weekNum - 1]
  if (!week) return null
  const dayOfWeek = today.getDay() // 0=Sun, 1=Mon, 3=Wed, 4=Thu, 6=Sat
  const dayMap = { 1: 'monday', 3: 'wednesday', 4: 'thursday', 6: 'saturday' }
  const day = dayMap[dayOfWeek]
  if (!day || !week.sessions[day]) return null
  return { week, session: week.sessions[day], day, weekNum }
}

// Helper: get this week's sessions with dates
export function getThisWeekSessions() {
  const weekNum = getWeekNumber(new Date())
  if (weekNum < 1 || weekNum > 24) return null
  const week = TRAINING_WEEKS[weekNum - 1]
  return {
    weekNum,
    week,
    sessions: [
      { day: 'monday', date: getSessionDate(weekNum, 'monday'), session: week.sessions.monday },
      { day: 'wednesday', date: getSessionDate(weekNum, 'wednesday'), session: week.sessions.wednesday },
      { day: 'thursday', date: getSessionDate(weekNum, 'thursday'), session: week.sessions.thursday },
      { day: 'saturday', date: getSessionDate(weekNum, 'saturday'), session: week.sessions.saturday },
    ].filter(s => s.session),
  }
}
