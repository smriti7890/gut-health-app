import { useState, useEffect } from 'react';

interface UserProfile {
  username: string;
  favoriteRecipes: Recipe[];
  healthScore: number;
  following: string[];
  followers: string[];
}

interface FoodItem {
  id: string;
  name: string;
  category: 'probiotic' | 'prebiotic' | 'inflammatory' | 'neutral';
  icon: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  foodGroup: string;
  dietaryInfo: {
    isVegan: boolean;
    isVegetarian: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
  };
  customFood?: boolean;
  createdBy?: string;
}

interface Recipe {
  id: string;
  name: string;
  createdBy: string;
  foods: FoodItem[];
  description: string;
  healthScore: number;
  likes: number;
  likedBy: string[];
  tags: string[];
  createdAt: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface MealPlan {
  day: string;
  meals: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    snacks: FoodItem[];
  };
  healthScore: number;
}

type MealType = keyof MealPlan['meals'];

// Food emoji mapping
const foodEmojis: { [key: string]: string[] } = {
  'Fruits': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥝', '🍍', '🥭', '🍎'],
  'Vegetables': ['🥬', '🥦', '🥒', '🌶️', '🫑', '🥕', '🧅', '🧄', '🍆', '🥔', '🥑', '🍅', '🥗'],
  'Proteins': ['🥩', '🍗', '🍖', '🍣', '🍤', '🥚', '🫘', '🥜'],
  'Dairy': ['🥛', '🧀', '🫕', '🧈', '🍦'],
  'Grains': ['🍚', '🍜', '🥖', '🥨', '🥯', '🥞', '🧇'],
  'Drinks': ['🫖', '☕', '🧃', '🥤', '🧋'],
  'Other': ['🍯', '🫃', '🥫', '🍪', '🍩']
};

const foodCategories = [
  'All',
  'Fruits & Vegetables',
  'Proteins',
  'Grains',
  'Dairy & Alternatives',
  'Fermented Foods',
  'Snacks & Others'
] as const;

const dietaryFilters = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'glutenFree', label: 'Gluten Free' },
  { id: 'dairyFree', label: 'Dairy Free' }
];

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;


const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Greek Yogurt',
    category: 'probiotic',
    icon: '🥛',
    impact: 'positive',
    description: 'Rich in probiotics and protein',
    foodGroup: 'Dairy & Alternatives',
    dietaryInfo: {
      isVegan: false,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: false
    }
  },
  {
    id: '2',
    name: 'Kimchi',
    category: 'probiotic',
    icon: '🥬',
    impact: 'positive',
    description: 'Fermented vegetables with probiotics',
    foodGroup: 'Fermented Foods',
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true
    }
  },
  {
    id: '3',
    name: 'Quinoa',
    category: 'prebiotic',
    icon: '🌾',
    impact: 'positive',
    description: 'High-fiber, nutrient-rich grain',
    foodGroup: 'Grains',
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true
    }
  },
  {
    id: '4',
    name: 'Sauerkraut',
    category: 'probiotic',
    icon: '🥬',
    impact: 'positive',
    description: 'Fermented cabbage with probiotics',
    foodGroup: 'Fermented Foods',
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true
    }
  },
  {
    id: '5',
    name: 'Sweet Potato',
    category: 'prebiotic',
    icon: '🍠',
    impact: 'positive',
    description: 'Rich in fiber and nutrients',
    foodGroup: 'Fruits & Vegetables',
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true
    }
  }
];

const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Probiotic Breakfast Bowl',
    createdBy: 'system',
    foods: [
      {
        ...foodItems[0], // Greek Yogurt
        id: 'recipe-1-food-1'
      },
      {
        ...foodItems[1], // Kimchi
        id: 'recipe-1-food-2'
      }
    ],
    description: 'A gut-healthy breakfast bowl packed with probiotics',
    healthScore: 85,
    likes: 24,
    likedBy: [],
    tags: ['breakfast', 'probiotic', 'high-protein'],
    createdAt: new Date().toISOString(),
    mealType: 'breakfast'
  },
  {
    id: '2',
    name: 'Gut Health Power Lunch',
    createdBy: 'system',
    foods: [
      {
        ...foodItems[2], // Quinoa
        id: 'recipe-2-food-1'
      },
      {
        ...foodItems[4], // Sweet Potato
        id: 'recipe-2-food-2'
      }
    ],
    description: 'A fiber-rich lunch that supports digestive health',
    healthScore: 90,
    likes: 18,
    likedBy: [],
    tags: ['lunch', 'high-fiber', 'vegetarian'],
    createdAt: new Date().toISOString(),
    mealType: 'lunch'
  }
];

const quizQuestions = [
  {
    question: 'What percentage of your immune system is located in your gut?',
    options: ['30%', '50%', '70%', '90%'],
    correctAnswer: 2,
    explanation: 'About 70% of your immune system is located in your gut, making it crucial for overall health.'
  },
  {
    question: 'Which of these bacteria is essential for vitamin K production?',
    options: ['Lactobacillus', 'Bifidobacterium', 'Escherichia coli', 'None of these'],
    correctAnswer: 0,
    explanation: 'Lactobacillus helps produce vitamin K, which is important for blood clotting and bone health.'
  },
  {
    question: 'Where is most of the bacterial fermentation process completed?',
    options: ['Stomach', 'Small Intestine', 'Large Intestine', 'Esophagus'],
    correctAnswer: 2,
    explanation: 'The large intestine is where most bacterial fermentation occurs, producing beneficial compounds.'
  }
];

const symptoms = [
  'Bloating',
  'Digestive Discomfort',
  'Changes in Appetite',
  'Fatigue',
  'Mood Changes'
];



export default function Home() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: '',
    favoriteRecipes: [],
    healthScore: 70,
    following: [],
    followers: []
  });

  // Core app states
  const [activeTab, setActiveTab] = useState<'meter' | 'planner' | 'social' | 'profile'>('meter');
  const [gutHealth, setGutHealth] = useState<number>(70);
  const [recentReactions, setRecentReactions] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  // Food and recipe states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFoodGroup, setSelectedFoodGroup] = useState<string>('All');
  const [selectedDietaryFilters, setSelectedDietaryFilters] = useState<string[]>([]);
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);
  const [showAddCustomFood, setShowAddCustomFood] = useState<boolean>(false);
  const [showFoodSelector, setShowFoodSelector] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [showRecipeCreator, setShowRecipeCreator] = useState<boolean>(false);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState<string>('Fruits');

  // New recipe creation states
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    name: '',
    description: '',
    foods: [],
    tags: [],
    mealType: 'breakfast'
  });

  // Meal planning states
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([
    {
      day: 'Monday',
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      healthScore: 0
    },
    {
      day: 'Tuesday',
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      healthScore: 0
    },
    {
      day: 'Wednesday',
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      healthScore: 0
    },
    {
      day: 'Thursday',
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      healthScore: 0
    },
    {
      day: 'Friday',
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      healthScore: 0
    },
    {
      day: 'Saturday',
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      healthScore: 0
    },
    {
      day: 'Sunday',
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      healthScore: 0
    }
  ]);

  // Custom food states
  const [newCustomFood, setNewCustomFood] = useState<Partial<FoodItem>>({
    name: '',
    category: 'neutral',
    icon: '🍽️',
    impact: 'neutral',
    description: '',
    foodGroup: 'Snacks & Others',
    dietaryInfo: {
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: false,
      isDairyFree: false
    }
  });

  // Handler Functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile.username.trim()) {
      setIsAuthenticated(true);
    }
  };

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
    const healthChange = food.impact === 'positive' ? 5 : food.impact === 'negative' ? -5 : 0;
    const newHealth = Math.min(Math.max(gutHealth + healthChange, 0), 100);
    setGutHealth(newHealth);
    setRecentReactions(prev => [
      `${food.icon} ${food.name}`,
      ...prev.slice(0, 4)
    ]);
  };

  const addCustomFood = () => {
    if (newCustomFood.name) {
      const customFood: FoodItem = {
        ...newCustomFood as FoodItem,
        id: `custom-${Date.now()}`,
        customFood: true,
        createdBy: userProfile.username
      };
      setCustomFoods(prev => [...prev, customFood]);
      setShowAddCustomFood(false);
      setNewCustomFood({
        name: '',
        category: 'neutral',
        icon: '🍽️',
        impact: 'neutral',
        description: '',
        foodGroup: 'Snacks & Others',
        dietaryInfo: {
          isVegan: false,
          isVegetarian: false,
          isGlutenFree: false,
          isDairyFree: false
        }
      });
    }
  };

  const createNewRecipe = () => {
    if (newRecipe.name && newRecipe.foods?.length) {
      const recipe: Recipe = {
        ...newRecipe as Recipe,
        id: `recipe-${Date.now()}`,
        createdBy: userProfile.username,
        likes: 0,
        likedBy: [],
        healthScore: calculateRecipeHealthScore(newRecipe.foods || []),
        createdAt: new Date().toISOString()
      };
      setRecipes(prev => [recipe, ...prev]);
      setNewRecipe({
        name: '',
        description: '',
        foods: [],
        tags: [],
        mealType: 'breakfast'
      });
      setShowRecipeCreator(false);
    }
  };

  const calculateRecipeHealthScore = (foods: FoodItem[]): number => {
    const positiveCount = foods.filter(f => f.impact === 'positive').length;
    const negativeCount = foods.filter(f => f.impact === 'negative').length;
    return Math.min(Math.max(
      Math.round((positiveCount / foods.length) * 100 - (negativeCount / foods.length) * 30),
      0
    ), 100);
  };

  const toggleRecipeLike = (recipeId: string) => {
    setRecipes(prev => prev.map(recipe => {
      if (recipe.id === recipeId) {
        const isLiked = recipe.likedBy.includes(userProfile.username);
        return {
          ...recipe,
          likes: isLiked ? recipe.likes - 1 : recipe.likes + 1,
          likedBy: isLiked 
            ? recipe.likedBy.filter(user => user !== userProfile.username)
            : [...recipe.likedBy, userProfile.username]
        };
      }
      return recipe;
    }));
  };

  const saveRecipe = (recipe: Recipe) => {
    if (!userProfile.favoriteRecipes.find(r => r.id === recipe.id)) {
      setUserProfile(prev => ({
        ...prev,
        favoriteRecipes: [...prev.favoriteRecipes, recipe]
      }));
    }
  };

  const getHealthColor = () => {
    if (gutHealth > 70) return 'text-green-500';
    if (gutHealth > 40) return 'text-yellow-500';
    return 'text-red-500';
  };


return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {!isAuthenticated ? (
        // Login Page
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">Gut Health Explorer</h1>
              <p className="mt-2 text-gray-600">Track, learn, and improve your gut health</p>
            </div>
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={userProfile.username}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Your Journey
              </button>
            </form>
          </div>
        </div>
      ) : (
        // Main App
        <>
          <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Gut Health Explorer</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Welcome, {userProfile.username}
                  </span>
                  <div className={`px-3 py-1 rounded-full ${getHealthColor()} bg-opacity-10`}>
                    Health Score: {gutHealth}%
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Emoji Picker Modal */}
          {showEmojiPicker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Select an Emoji</h3>
                  <button
                    onClick={() => setShowEmojiPicker(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                
                {/* Emoji Categories */}
                <div className="flex overflow-x-auto pb-2 mb-4">
                  {Object.keys(foodEmojis).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedEmojiCategory(category)}
                      className={`flex-shrink-0 px-3 py-1 rounded-full mr-2 ${
                        selectedEmojiCategory === category
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Emoji Grid */}
                <div className="grid grid-cols-6 gap-2">
                  {foodEmojis[selectedEmojiCategory].map((emoji, index) => (
                    <button
                      key={`${emoji}-${index}`}
                      onClick={() => {
                        setNewCustomFood(prev => ({ ...prev, icon: emoji }));
                        setShowEmojiPicker(false);
                      }}
                      className="text-2xl p-2 hover:bg-gray-100 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-16 pb-16"> {/* Padding for fixed header and bottom nav */}
            {/* Tab Navigation */}
            <div className="bg-white border-b">
              <div className="max-w-7xl mx-auto px-4">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('meter')}
                    className={`px-3 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'meter'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Gut Health Meter
                  </button>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className={`px-3 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'planner'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Meal Planner
                  </button>
                  <button
                    onClick={() => setActiveTab('social')}
                    className={`px-3 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'social'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Community Recipes
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-3 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'profile'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Profile
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 py-8">

{activeTab === 'meter' && (
                <div className="space-y-8">
                  {/* Gut Health Meter Section */}
                  <section className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gut Health Meter</h2>
                    
                    {/* Health Meter */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Current Gut Health</span>
                        <span className={`text-2xl font-bold ${getHealthColor()}`}>
                          {gutHealth}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full transition-all duration-500 ${
                            gutHealth > 70 ? 'bg-green-500' : gutHealth > 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${gutHealth}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Food Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[...foodItems, ...customFoods].map((food) => (
                        <button
                          key={food.id}
                          onClick={() => handleFoodSelect(food)}
                          className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all text-center"
                        >
                          <div className="text-3xl mb-2">{food.icon}</div>
                          <div className="font-medium">{food.name}</div>
                          <div className="text-sm text-gray-600">{food.foodGroup}</div>
                          <div className="mt-2 flex flex-wrap gap-1 justify-center">
                            {food.impact === 'positive' && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                Beneficial
                              </span>
                            )}
                            {food.impact === 'negative' && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                Harmful
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Add Custom Food Button */}
                    <button
                      onClick={() => setShowAddCustomFood(true)}
                      className="mt-6 w-full py-3 px-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      + Add Custom Food
                    </button>
                  </section>

                  {/* Recent Reactions */}
                  {recentReactions.length > 0 && (
                    <section className="bg-white rounded-lg shadow-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Recent Foods</h3>
                      <ul className="space-y-2">
                        {recentReactions.map((reaction, index) => (
                          <li key={index} className="text-gray-600">{reaction}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              )}

              {/* Custom Food Modal */}
              {showAddCustomFood && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Add Custom Food</h3>
                      <button
                        onClick={() => setShowAddCustomFood(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      addCustomFood();
                    }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={newCustomFood.name}
                          onChange={(e) => setNewCustomFood(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Food Group</label>
                        <select
                          value={newCustomFood.foodGroup}
                          onChange={(e) => setNewCustomFood(prev => ({ ...prev, foodGroup: e.target.value }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          {foodCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Choose an Emoji</label>
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(true)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-left"
                        >
                          {newCustomFood.icon} Select Emoji
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Impact on Gut Health</label>
                        <select
                          value={newCustomFood.impact}
                          onChange={(e) => setNewCustomFood(prev => ({ 
                            ...prev, 
                            impact: e.target.value as FoodItem['impact']
                          }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="positive">Beneficial</option>
                          <option value="negative">Harmful</option>
                          <option value="neutral">Neutral</option>
                        </select>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setShowAddCustomFood(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Add Food
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}


      {activeTab === 'planner' && (
                <div className="space-y-8">
                  {/* Day Navigation */}
                  <div className="flex overflow-x-auto pb-2 -mx-2 px-2">
                    {mealPlan.map((day) => (
                      <button
                        key={day.day}
                        onClick={() => setSelectedDay(day.day)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full mr-2 ${
                          selectedDay === day.day
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.day}
                      </button>
                    ))}
                  </div>

                  {/* Meal Planner Grid */}
                  {mealPlan.map((day) => (
                    <div 
                      key={day.day}
                      className={day.day === selectedDay ? '' : 'hidden'}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(day.meals).map(([mealType, foods]) => (
                          <div key={mealType} className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold capitalize">{mealType}</h3>
                              <button
                                onClick={() => {
                                  setSelectedMealType(mealType);
                                  setShowFoodSelector(true);
                                }}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                + Add Food
                              </button>
                            </div>
                            <div className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4">
                              {foods.map((food, index) => (
                                <div
                                  key={index}
                                  className="flex items-center bg-gray-50 rounded p-2 mb-2"
                                >
                                  <span className="text-2xl mr-2">{food.icon}</span>
                                  <div>
                                    <div className="font-medium">{food.name}</div>
                                    <div className="text-sm text-gray-600">{food.foodGroup}</div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const newMealPlan = [...mealPlan];
                                      const dayIndex = newMealPlan.findIndex(d => d.day === day.day);
                                      newMealPlan[dayIndex].meals[mealType as keyof typeof day.meals] =
                                        foods.filter((_, i) => i !== index);
                                      setMealPlan(newMealPlan);
                                    }}
                                    className="ml-auto text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Save as Recipe Button */}
                      <button
                        onClick={() => {
                          const dayFoods = Object.values(day.meals).flat();
                          if (dayFoods.length > 0) {
                            setNewRecipe({
                              name: `${day.day}'s Meals`,
                              description: 'Custom meal plan recipe',
                              foods: dayFoods,
                              tags: [],
                              mealType: 'breakfast'
                            });
                            setShowRecipeCreator(true);
                          }
                        }}
                        className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Save Day as Recipe
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Community Recipes</h2>
                    <button
                      onClick={() => {
                        setNewRecipe({
                          name: '',
                          description: '',
                          foods: [],
                          tags: [],
                          mealType: 'breakfast'
                        });
                        setShowRecipeCreator(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Share New Recipe
                    </button>
                  </div>

                  {/* Recipe Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                      <div key={recipe.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold">{recipe.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              recipe.healthScore > 70 ? 'bg-green-100 text-green-800' :
                              recipe.healthScore > 40 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              Score: {recipe.healthScore}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-2">{recipe.description}</p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {recipe.foods.map((food, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-sm"
                              >
                                {food.icon} {food.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="border-t px-6 py-4 bg-gray-50 flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            By {recipe.createdBy}
                          </div>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => toggleRecipeLike(recipe.id)}
                              className={`flex items-center space-x-1 ${
                                recipe.likedBy.includes(userProfile.username)
                                  ? 'text-red-500'
                                  : 'text-gray-500 hover:text-red-500'
                              }`}
                            >
                              <span>❤️</span>
                              <span>{recipe.likes}</span>
                            </button>
                            <button
                              onClick={() => saveRecipe(recipe)}
                              className={`text-blue-500 hover:text-blue-700 ${
                                userProfile.favoriteRecipes.some(r => r.id === recipe.id)
                                  ? 'opacity-50 cursor-not-allowed'
                                  : ''
                              }`}
                              disabled={userProfile.favoriteRecipes.some(r => r.id === recipe.id)}
                            >
                              {userProfile.favoriteRecipes.some(r => r.id === recipe.id)
                                ? 'Saved'
                                : 'Save'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipe Creator Modal */}
              {showRecipeCreator && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Create New Recipe</h3>
                      <button
                        onClick={() => setShowRecipeCreator(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      createNewRecipe();
                    }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Recipe Name</label>
                        <input
                          type="text"
                          value={newRecipe.name}
                          onChange={(e) => setNewRecipe(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={newRecipe.description}
                          onChange={(e) => setNewRecipe(prev => ({ ...prev, description: e.target.value }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Meal Type</label>
                        <select
                          value={newRecipe.mealType}
                          onChange={(e) => setNewRecipe(prev => ({ ...prev, mealType: e.target.value as Recipe['mealType'] }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          {mealTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setShowRecipeCreator(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Create Recipe
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}


{activeTab === 'profile' && (
                <div className="space-y-8">
                  {/* Profile Header */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 rounded-full p-4">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold">{userProfile.username}</h2>
                        <p className="text-gray-600">Gut Health Score: {gutHealth}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Saved Recipes */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Saved Recipes</h3>
                    {userProfile.favoriteRecipes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userProfile.favoriteRecipes.map((recipe) => (
                          <div key={recipe.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{recipe.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                recipe.healthScore > 70 ? 'bg-green-100 text-green-800' :
                                recipe.healthScore > 40 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                Score: {recipe.healthScore}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{recipe.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {recipe.foods.map((food, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs"
                                >
                                  {food.icon} {food.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No saved recipes yet. Explore the community recipes to find some!</p>
                    )}
                  </div>

                  {/* Health Progress */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Health Progress</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Overall Gut Health</span>
                          <span className={getHealthColor()}>{gutHealth}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              gutHealth > 70 ? 'bg-green-500' : gutHealth > 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${gutHealth}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <div className="flex justify-around items-center px-4 py-2">
              <button
                onClick={() => setActiveTab('meter')}
                className={`flex flex-col items-center p-2 ${
                  activeTab === 'meter' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">📊</span>
                <span className="text-xs">Health</span>
              </button>
              <button
                onClick={() => setActiveTab('planner')}
                className={`flex flex-col items-center p-2 ${
                  activeTab === 'planner' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">📋</span>
                <span className="text-xs">Planner</span>
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`flex flex-col items-center p-2 ${
                  activeTab === 'social' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">👥</span>
                <span className="text-xs">Community</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center p-2 ${
                  activeTab === 'profile' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">👤</span>
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </nav>
        </>
      )}
    </main>
  );
}




