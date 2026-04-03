// Indian foods database with protein and calorie values
// Protein targets: 1.6–2g per kg bodyweight
// For 75kg person: 120–150g protein/day

export const FOOD_CATEGORIES = [
  { id: 'eggs_dairy', name: 'Eggs & Dairy', icon: '🥚' },
  { id: 'meat_fish', name: 'Meat & Fish', icon: '🍗' },
  { id: 'legumes', name: 'Dal & Legumes', icon: '🫘' },
  { id: 'grains', name: 'Rice & Rotis', icon: '🍚' },
  { id: 'supplements', name: 'Supplements', icon: '💊' },
  { id: 'snacks', name: 'Snacks & Others', icon: '🥜' },
]

// protein in grams, calories in kcal (per serving)
export const FOODS = [
  // Eggs & Dairy
  { id: 'eggs_whole', name: 'Whole Egg', category: 'eggs_dairy', serving: '1 egg (50g)', protein: 6, calories: 70, carbs: 0.5, fat: 5 },
  { id: 'eggs_white', name: 'Egg White', category: 'eggs_dairy', serving: '1 egg white (30g)', protein: 3.5, calories: 17, carbs: 0, fat: 0 },
  { id: 'paneer', name: 'Paneer', category: 'eggs_dairy', serving: '100g', protein: 18, calories: 265, carbs: 1.2, fat: 20 },
  { id: 'curd_low', name: 'Curd (low fat)', category: 'eggs_dairy', serving: '200g (1 cup)', protein: 7, calories: 80, carbs: 8, fat: 2 },
  { id: 'greek_yogurt', name: 'Greek Yogurt', category: 'eggs_dairy', serving: '150g', protein: 15, calories: 130, carbs: 7, fat: 5 },
  { id: 'milk_full', name: 'Whole Milk', category: 'eggs_dairy', serving: '250ml (1 glass)', protein: 8, calories: 150, carbs: 12, fat: 8 },
  { id: 'milk_skim', name: 'Skim Milk', category: 'eggs_dairy', serving: '250ml', protein: 8.5, calories: 90, carbs: 12, fat: 0.5 },
  { id: 'cheese_slice', name: 'Processed Cheese Slice', category: 'eggs_dairy', serving: '1 slice (20g)', protein: 4, calories: 65, carbs: 1, fat: 5 },
  { id: 'cottage_cheese', name: 'Cottage Cheese (Chhena)', category: 'eggs_dairy', serving: '100g', protein: 12, calories: 100, carbs: 2, fat: 5 },

  // Meat & Fish
  { id: 'chicken_breast', name: 'Chicken Breast (cooked)', category: 'meat_fish', serving: '100g', protein: 31, calories: 165, carbs: 0, fat: 3.6 },
  { id: 'chicken_whole', name: 'Chicken (with bone)', category: 'meat_fish', serving: '150g piece', protein: 25, calories: 180, carbs: 0, fat: 8 },
  { id: 'egg_bhurji', name: 'Egg Bhurji (2 eggs)', category: 'meat_fish', serving: '1 serving', protein: 12, calories: 180, carbs: 3, fat: 12 },
  { id: 'tuna', name: 'Canned Tuna', category: 'meat_fish', serving: '100g (½ can)', protein: 25, calories: 120, carbs: 0, fat: 2.5 },
  { id: 'fish_rohu', name: 'Rohu Fish (cooked)', category: 'meat_fish', serving: '150g', protein: 27, calories: 130, carbs: 0, fat: 2.5 },
  { id: 'mutton', name: 'Mutton Curry (lean)', category: 'meat_fish', serving: '150g', protein: 26, calories: 250, carbs: 2, fat: 14 },

  // Dal & Legumes
  { id: 'dal_toor', name: 'Toor Dal (cooked)', category: 'legumes', serving: '1 katori (150g)', protein: 8, calories: 120, carbs: 18, fat: 2 },
  { id: 'dal_moong', name: 'Moong Dal (cooked)', category: 'legumes', serving: '1 katori (150g)', protein: 7, calories: 105, carbs: 18, fat: 0.8 },
  { id: 'chana_dal', name: 'Chana Dal (cooked)', category: 'legumes', serving: '1 katori (150g)', protein: 9, calories: 160, carbs: 25, fat: 2 },
  { id: 'rajma', name: 'Rajma Curry', category: 'legumes', serving: '1 katori (150g)', protein: 10, calories: 175, carbs: 28, fat: 2.5 },
  { id: 'chole', name: 'Chole (chickpeas)', category: 'legumes', serving: '1 katori (150g)', protein: 11, calories: 190, carbs: 30, fat: 3 },
  { id: 'sprouts', name: 'Mixed Sprouts', category: 'legumes', serving: '1 cup (100g)', protein: 9, calories: 80, carbs: 10, fat: 1 },
  { id: 'soya_chunks', name: 'Soya Chunks (cooked)', category: 'legumes', serving: '50g dry (150g cooked)', protein: 26, calories: 170, carbs: 15, fat: 0.5 },
  { id: 'tofu', name: 'Tofu', category: 'legumes', serving: '100g', protein: 8, calories: 70, carbs: 2, fat: 4 },

  // Grains & Carbs
  { id: 'rice_cooked', name: 'Rice (cooked)', category: 'grains', serving: '1 cup (150g)', protein: 3, calories: 205, carbs: 45, fat: 0.4 },
  { id: 'roti_wheat', name: 'Wheat Roti', category: 'grains', serving: '1 roti (40g)', protein: 3, calories: 120, carbs: 24, fat: 1.5 },
  { id: 'oats', name: 'Oatmeal (cooked)', category: 'grains', serving: '1 cup (250g)', protein: 5, calories: 160, carbs: 28, fat: 3 },
  { id: 'poha', name: 'Poha', category: 'grains', serving: '1 plate (200g)', protein: 4, calories: 250, carbs: 50, fat: 4 },
  { id: 'upma', name: 'Upma', category: 'grains', serving: '1 cup (200g)', protein: 5, calories: 210, carbs: 35, fat: 6 },
  { id: 'idli', name: 'Idli', category: 'grains', serving: '2 pieces (80g)', protein: 3.5, calories: 85, carbs: 17, fat: 0.4 },
  { id: 'dosa', name: 'Plain Dosa', category: 'grains', serving: '1 large (80g)', protein: 4, calories: 150, carbs: 30, fat: 2.5 },
  { id: 'bread_brown', name: 'Brown Bread', category: 'grains', serving: '2 slices (60g)', protein: 5, calories: 160, carbs: 30, fat: 2 },

  // Supplements
  { id: 'whey_protein', name: 'Whey Protein Shake', category: 'supplements', serving: '1 scoop (30g)', protein: 24, calories: 120, carbs: 3, fat: 1.5 },
  { id: 'casein_protein', name: 'Casein Protein', category: 'supplements', serving: '1 scoop (35g)', protein: 25, calories: 130, carbs: 4, fat: 2 },

  // Snacks & Others
  { id: 'peanut_butter', name: 'Peanut Butter', category: 'snacks', serving: '2 tbsp (32g)', protein: 8, calories: 190, carbs: 7, fat: 16 },
  { id: 'almonds', name: 'Almonds', category: 'snacks', serving: '30g (23 almonds)', protein: 6, calories: 170, carbs: 6, fat: 15 },
  { id: 'banana', name: 'Banana', category: 'snacks', serving: '1 medium (120g)', protein: 1.3, calories: 105, carbs: 27, fat: 0.3 },
  { id: 'sweet_potato', name: 'Sweet Potato (boiled)', category: 'snacks', serving: '150g', protein: 2, calories: 135, carbs: 32, fat: 0.1 },
  { id: 'chikki', name: 'Peanut Chikki', category: 'snacks', serving: '1 piece (30g)', protein: 4, calories: 140, carbs: 16, fat: 7 },
  { id: 'roasted_chana', name: 'Roasted Chana', category: 'snacks', serving: '50g', protein: 10, calories: 175, carbs: 26, fat: 3 },
  { id: 'makhana', name: 'Makhana (fox nuts)', category: 'snacks', serving: '30g', protein: 3, calories: 100, carbs: 20, fat: 0.5 },
  { id: 'sattu', name: 'Sattu (barley powder)', category: 'snacks', serving: '30g in water', protein: 6, calories: 105, carbs: 17, fat: 1 },
]

export const SUPPLEMENTS = [
  {
    id: 'creatine',
    name: 'Creatine Monohydrate',
    dose: '5g',
    timing: 'Post-workout (or any time)',
    why: 'Improves strength, power output, and recovery. Non-negotiable for Hyrox training.',
    color: '#6366f1',
  },
  {
    id: 'protein_shake',
    name: 'Protein Shake',
    dose: '1 scoop (30g)',
    timing: 'Post-workout if daily protein < 120g',
    why: 'Hit your protein target to support muscle building and recovery.',
    color: '#f97316',
  },
  {
    id: 'vitamin_d3',
    name: 'Vitamin D3',
    dose: '2000–4000 IU',
    timing: 'Morning with food',
    why: 'Bone health, immune function, and testosterone regulation. Most Indians are deficient.',
    color: '#f59e0b',
  },
  {
    id: 'magnesium',
    name: 'Magnesium Glycinate',
    dose: '300–400mg',
    timing: 'Before bed',
    why: 'Muscle recovery, sleep quality, and reduces cramping. Especially important on heavy training days.',
    color: '#22c55e',
  },
]
