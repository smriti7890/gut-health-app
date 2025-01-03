import { useState, useEffect, DragEvent } from 'react';

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
  effect: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  foodGroup: string;
  dietaryInfo: {
    isVegan: boolean;
    isVegetarian: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
  };
  nutrients: {
    protein: number;
    fiber: number;
    probiotics: boolean;
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



interface SocialPost {
  id: string;
  username: string;
  recipe: Recipe;
  likes: number;
  likedBy: string[];
  timestamp: string;
}

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
    effect: 'Adds beneficial bacteria',
    impact: 'positive',
    description: 'Rich in probiotics and protein, supports gut health',
    foodGroup: 'Dairy & Alternatives',
    dietaryInfo: {
      isVegan: false,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: false
    },
    nutrients: {
      protein: 15,
      fiber: 0,
      probiotics: true
    }
  },
  {
    id: '2',
    name: 'Kimchi',
    category: 'probiotic',
    icon: '🥬',
    effect: 'Enhances gut diversity',
    impact: 'positive',
    description: 'Fermented vegetables full of healthy bacteria',
    foodGroup: 'Fermented Foods',
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true
    },
    nutrients: {
      protein: 2,
      fiber: 3,
      probiotics: true
    }
  },
  {
    id: '3',
    name: 'Quinoa',
    category: 'prebiotic',
    icon: '🌾',
    effect: 'Feeds good bacteria',
    impact: 'positive',
    description: 'High-fiber grain that supports gut bacteria',
    foodGroup: 'Grains',
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true
    },
    nutrients: {
      protein: 8,
      fiber: 5,
      probiotics: false
    }
  },
  {
    id: '4',
    name: 'Sauerkraut',
    category: 'probiotic',
    icon: '🥬',
    effect: 'Adds beneficial bacteria',
    impact: 'positive',
    description: 'Fermented cabbage rich in probiotics',
    foodGroup: 'Fermented Foods',
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true
    },
    nutrients: {
      protein: 1,
      fiber: 4,
      probiotics: true
    }
  },
  {
    id: '5',
    name: 'Sweet Potato',
    category: 'prebiotic',
    icon: '🍠',
    effect: 'Feeds beneficial bacteria',
    impact: 'positive',
    description: 'Rich in fiber and nutrients',
    foodGroup: 'Fruits & Vegetables',
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true
    },
    nutrients: {
      protein: 2,
      fiber: 4,
      probiotics: false
    }
  },
  {
    id: '6',
    name: 'Kombucha',
    category: 'probiotic',
    icon: '🫖',
    effect: 'Adds beneficial yeasts',
    impact: 'positive',
    description: 'Fermented tea with probiotics',
    foodGroup: 'Fermented Foods',
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true
    },
    nutrients: {
      protein: 0,
      fiber: 0,
      probiotics: true
    }
  },
  {
    id: '7',
    name: 'Processed Sugar',
    category: 'inflammatory',
    icon: '🍬',
    effect: 'Disrupts gut balance',
    impact: 'negative',
    description: 'Can lead to inflammation and bacterial imbalance',
    foodGroup: 'Snacks & Others',
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true
    },
    nutrients: {
      protein: 0,
      fiber: 0,
      probiotics: false
    }
  }
];

const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Probiotic Breakfast Bowl',
    createdBy: 'system',
    foods: [foodItems[0], foodItems[1]], // Greek Yogurt and Kimchi
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
    foods: [foodItems[2], foodItems[4]], // Quinoa and Sweet Potato
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
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeCreator, setShowRecipeCreator] = useState<boolean>(false);

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

  // Social features states
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);

  // Custom food form state
  const [newCustomFood, setNewCustomFood] = useState<Partial<FoodItem>>({
    name: '',
    category: 'neutral',
    icon: '🍽️',
    effect: '',
    impact: 'neutral',
    description: '',
    foodGroup: 'Snacks & Others',
    dietaryInfo: {
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: false,
      isDairyFree: false
    },
    nutrients: {
      protein: 0,
      fiber: 0,
      probiotics: false
    }
  });

  // Handler Functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile.username.trim()) {
      setIsAuthenticated(true);
    }
  };

  const handleFoodDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const foodId = e.dataTransfer.getData('foodId');
    const food = [...foodItems, ...customFoods].find(f => f.id === foodId);
    if (food) {
      handleFoodSelect(food);
    }
  };

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
    const healthChange = food.impact === 'positive' ? 5 : food.impact === 'negative' ? -5 : 0;
    const newHealth = Math.min(Math.max(gutHealth + healthChange, 0), 100);
    setGutHealth(newHealth);
    setRecentReactions(prev => [
      `${food.icon} ${food.name}: ${food.effect}`,
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
        effect: '',
        impact: 'neutral',
        description: '',
        foodGroup: 'Snacks & Others',
        dietaryInfo: {
          isVegan: false,
          isVegetarian: false,
          isGlutenFree: false,
          isDairyFree: false
        },
        nutrients: {
          protein: 0,
          fiber: 0,
          probiotics: false
        }
      });
    }
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

                    {/* Drag & Drop Zone */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFoodDrop}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8 hover:border-blue-500 transition-colors"
                    >
                      <p className="text-gray-600">Drag foods here to see how they affect your gut health</p>
                    </div>

                    {/* Food Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[...foodItems, ...customFoods].map((food) => (
                        <div
                          key={food.id}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData('foodId', food.id)}
                          className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all cursor-move"
                        >
                          <div className="text-3xl mb-2">{food.icon}</div>
                          <div className="font-medium">{food.name}</div>
                          <div className="text-sm text-gray-600">{food.category}</div>
                          <div className="mt-2 flex flex-wrap gap-1">
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
                        </div>
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
                      <h3 className="font-semibold text-gray-800 mb-4">Recent Effects</h3>
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
                    <h3 className="text-xl font-semibold mb-4">Add Custom Food</h3>
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
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          value={newCustomFood.category}
                          onChange={(e) => setNewCustomFood(prev => ({ 
                            ...prev, 
                            category: e.target.value as FoodItem['category']
                          }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="probiotic">Probiotic</option>
                          <option value="prebiotic">Prebiotic</option>
                          <option value="inflammatory">Inflammatory</option>
                          <option value="neutral">Neutral</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Effect</label>
                        <input
                          type="text"
                          value={newCustomFood.effect}
                          onChange={(e) => setNewCustomFood(prev => ({ ...prev, effect: e.target.value }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Impact</label>
                        <select
                          value={newCustomFood.impact}
                          onChange={(e) => setNewCustomFood(prev => ({ 
                            ...prev, 
                            impact: e.target.value as FoodItem['impact']
                          }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="positive">Positive</option>
                          <option value="negative">Negative</option>
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
                                    <div className="text-sm text-gray-600">{food.effect}</div>
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
                        onClick={() => setShowRecipeCreator(true)}
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
                      onClick={() => setShowRecipeCreator(true)}
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
                              onClick={() => {
                                if (!userProfile.favoriteRecipes.find(r => r.id === recipe.id)) {
                                  setUserProfile(prev => ({
                                    ...prev,
                                    favoriteRecipes: [...prev.favoriteRecipes, recipe]
                                  }));
                                }
                              }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
                              <span className="text-sm text-gray-600">
                                Score: {recipe.healthScore}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{recipe.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No saved recipes yet</p>
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

          {/* Food Selector Modal */}
          {showFoodSelector && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Add Food</h3>
                  <button
                    onClick={() => setShowFoodSelector(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search foods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...foodItems, ...customFoods]
                    .filter(food => 
                      food.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((food) => (
                <button
  key={food.id}
  onClick={() => {
    const newMealPlan = [...mealPlan];
    const dayIndex = newMealPlan.findIndex(d => d.day === selectedDay);
    if (dayIndex !== -1 && selectedMealType) {
      const mealTypeKey = selectedMealType.toLowerCase() as MealType;
      newMealPlan[dayIndex].meals[mealTypeKey].push(food);
      setMealPlan(newMealPlan);
      setShowFoodSelector(false);
    }
  }}
  className="p-4 rounded-lg border hover:border-blue-500 transition-all text-center"
>
                        <div className="text-3xl mb-2">{food.icon}</div>
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-gray-600">{food.category}</div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

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







