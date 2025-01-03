import { useState, useEffect } from 'react';

interface DietaryRestriction {
  id: string;
  name: string;
  description: string;
  excludedIngredients: string[];
}

interface FoodItem {
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

interface SocialPost {
  id: string;
  username: string;
  content: string;
  mealPlan?: MealPlan;
  likes: number;
  comments: Comment[];
  timestamp: string;
}

interface Comment {
  id: string;
  username: string;
  content: string;
  timestamp: string;
}

interface UserPreferences {
  dietaryRestrictions: string[];
  favoriteFood: string[];
  healthGoals: string[];
  excludedIngredients: string[];
}

const dietaryRestrictions: DietaryRestriction[] = [
  {
    id: 'vegan',
    name: 'Vegan',
    description: 'No animal products',
    excludedIngredients: ['dairy', 'eggs', 'meat', 'fish']
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'No meat or fish',
    excludedIngredients: ['meat', 'fish']
  },
  {
    id: 'gluten-free',
    name: 'Gluten Free',
    description: 'No gluten-containing ingredients',
    excludedIngredients: ['wheat', 'barley', 'rye']
  },
  {
    id: 'dairy-free',
    name: 'Dairy Free',
    description: 'No dairy products',
    excludedIngredients: ['milk', 'cheese', 'yogurt']
  }
];

const foodCategories = [
  'Fruits & Vegetables',
  'Proteins',
  'Grains',
  'Dairy & Alternatives',
  'Fermented Foods',
  'Snacks & Others'
] as const;

const foodItems: FoodItem[] = [
  {
    name: 'Greek Yogurt',
    category: 'probiotic',
    icon: '🥛',
    effect: 'Adds beneficial bacteria',
    impact: 'positive',
    description: 'Rich in probiotics and protein',
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
    name: 'Tempeh',
    category: 'probiotic',
    icon: '🫘',
    effect: 'Supports gut health',
    impact: 'positive',
    description: 'Fermented soy product rich in protein',
    foodGroup: 'Proteins',
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true
    },
    nutrients: {
      protein: 20,
      fiber: 4,
      probiotics: true
    }
  },
  {
    name: 'Quinoa',
    category: 'prebiotic',
    icon: '🌾',
    effect: 'Feeds beneficial bacteria',
    impact: 'positive',
    description: 'Complete protein and fiber-rich grain',
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
  // Add more foods here...
];

const healthGoals = [
  'Improve Digestion',
  'Reduce Bloating',
  'Boost Energy',
  'Strengthen Immune System',
  'Reduce Inflammation'
];

const mealTemplates = {
  'High Fiber': {
    breakfast: ['Oatmeal', 'Berries', 'Chia Seeds'],
    lunch: ['Quinoa', 'Lentils', 'Mixed Vegetables'],
    dinner: ['Brown Rice', 'Black Beans', 'Steamed Greens'],
    snacks: ['Apple', 'Almonds']
  },
  'Gut Health': {
    breakfast: ['Greek Yogurt', 'Banana', 'Honey'],
    lunch: ['Kimchi', 'Brown Rice', 'Tofu'],
    dinner: ['Tempeh', 'Sauerkraut', 'Sweet Potato'],
    snacks: ['Kombucha', 'Mixed Nuts']
  },
  // Add more templates...
};

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
  // Core states
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [gutHealth, setGutHealth] = useState<number>(70);
  const [recentReactions, setRecentReactions] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showSymptomResults, setShowSymptomResults] = useState<boolean>(false);

  // New states for enhanced features
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFoodGroup, setSelectedFoodGroup] = useState<string>('all');
  const [showFoodSelector, setShowFoodSelector] = useState<boolean>(false);
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('planner');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    dietaryRestrictions: [],
    favoriteFood: [],
    healthGoals: [],
    excludedIngredients: []
  });
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [favoriteMeals, setFavoriteMeals] = useState<{[key: string]: FoodItem[]}>({});
  const [showMealTemplates, setShowMealTemplates] = useState<boolean>(false);
  const [currentTemplate, setCurrentTemplate] = useState<string>('');

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

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [username, setUsername] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Enhanced filtering and recommendation functions
  const filteredFoods = foodItems.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedFoodGroup === 'all' || food.foodGroup === selectedFoodGroup;
    const matchesDiet = userPreferences.dietaryRestrictions.length === 0 || 
      userPreferences.dietaryRestrictions.every(restriction => {
        switch(restriction) {
          case 'vegan':
            return food.dietaryInfo.isVegan;
          case 'vegetarian':
            return food.dietaryInfo.isVegetarian;
          case 'gluten-free':
            return food.dietaryInfo.isGlutenFree;
          case 'dairy-free':
            return food.dietaryInfo.isDairyFree;
          default:
            return true;
        }
      });
    return matchesSearch && matchesGroup && matchesDiet;
  });

  // Function to get meal recommendations
  const getMealRecommendations = () => {
    return filteredFoods.filter(food => {
      // Check if food aligns with health goals
      const matchesGoals = userPreferences.healthGoals.some(goal => {
        switch(goal) {
          case 'Improve Digestion':
            return food.category === 'probiotic';
          case 'Reduce Inflammation':
            return food.impact === 'positive';
          case 'Boost Energy':
            return food.nutrients.protein > 5;
          default:
            return true;
        }
      });
      return matchesGoals;
    });
  };

  // Handler functions
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

  const getHealthColor = () => {
    if (gutHealth > 70) return 'text-green-500';
    if (gutHealth > 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleAnswerSubmit = (answerIndex: number): void => {
    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = (): void => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };

  const toggleSymptom = (symptom: string): void => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  // New function to handle dietary restrictions
  const toggleDietaryRestriction = (restriction: string) => {
    setUserPreferences(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  // Function to save meal as favorite
  const saveFavoriteMeal = (meal: FoodItem[]) => {
    const mealKey = `favorite-${Object.keys(favoriteMeals).length + 1}`;
    setFavoriteMeals(prev => ({
      ...prev,
      [mealKey]: meal
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-4 py-2">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex flex-col items-center p-2 ${activeTab === 'planner' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <span className="text-xl">📋</span>
            <span className="text-xs">Planner</span>
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`flex flex-col items-center p-2 ${activeTab === 'foods' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <span className="text-xl">🥗</span>
            <span className="text-xs">Foods</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-col items-center p-2 ${activeTab === 'quiz' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <span className="text-xl">❓</span>
            <span className="text-xs">Quiz</span>
          </button>
          <button
            onClick={() => setShowPreferences(true)}
            className={`flex flex-col items-center p-2 ${showPreferences ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <span className="text-xl">⚙️</span>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Preferences</h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Dietary Restrictions</h4>
                <div className="flex flex-wrap gap-2">
                  {dietaryRestrictions.map((restriction) => (
                    <button
                      key={restriction.id}
                      onClick={() => toggleDietaryRestriction(restriction.id)}
                      className={`px-3 py-1 rounded-full border ${
                        userPreferences.dietaryRestrictions.includes(restriction.id)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {restriction.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Health Goals</h4>
                <div className="flex flex-wrap gap-2">
                  {healthGoals.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => {
                        setUserPreferences(prev => ({
                          ...prev,
                          healthGoals: prev.healthGoals.includes(goal)
                            ? prev.healthGoals.filter(g => g !== goal)
                            : [...prev.healthGoals, goal]
                        }));
                      }}
                      className={`px-3 py-1 rounded-full border ${
                        userPreferences.healthGoals.includes(goal)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Favorite Foods</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {userPreferences.favoriteFood.length === 0 ? (
                    <p className="text-gray-500 text-sm">No favorite foods added yet</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {userPreferences.favoriteFood.map((foodName) => (
                        <span key={foodName} className="bg-white px-3 py-1 rounded-full text-sm border">
                          {foodName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Gut Health Explorer</h1>
          <p className="text-gray-600 mt-2">Discover and plan your gut-healthy meals</p>
        </div>
      </header>

      {/* Main Content - Conditionally rendered based on activeTab */}
      {activeTab === 'foods' && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Food Explorer</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedFoodGroup('all')}
                  className={`px-4 py-2 rounded-full ${
                    selectedFoodGroup === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  All Foods
                </button>
                {foodCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedFoodGroup(category)}
                    className={`px-4 py-2 rounded-full ${
                      selectedFoodGroup === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredFoods.map((food) => (
                <button
                  key={food.name}
                  onClick={() => handleFoodSelect(food)}
                  className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all text-center"
                >
                  <div className="text-3xl mb-2">{food.icon}</div>
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-gray-600">{food.category}</div>
                  {/* Dietary Tags */}
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {food.dietaryInfo.isVegan && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Vegan</span>
                    )}
                    {food.dietaryInfo.isGlutenFree && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">GF</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {selectedFood && (
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{selectedFood.name}</h3>
                <p className="text-gray-700 mb-2">{selectedFood.description}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="font-medium">Protein:</span> {selectedFood.nutrients.protein}g
                  </div>
                  <div>
                    <span className="font-medium">Fiber:</span> {selectedFood.nutrients.fiber}g
                  </div>
                  {selectedFood.nutrients.probiotics && (
                    <div className="text-green-600">Contains Probiotics</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'planner' && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Meal Planner</h2>
            <button
              onClick={() => setShowMealTemplates(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Quick Templates
            </button>
          </div>

          {/* Meal Templates Modal */}
          {showMealTemplates && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 m-4 max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Meal Templates</h3>
                  <button
                    onClick={() => setShowMealTemplates(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  {Object.entries(mealTemplates).map(([name, template]) => (
                    <button
                      key={name}
                      onClick={() => {
                        setCurrentTemplate(name);
                        // Implementation for applying template
                        setShowMealTemplates(false);
                      }}
                      className="w-full p-4 text-left rounded-lg border hover:border-blue-500 transition-all"
                    >
                      <h4 className="font-medium">{name}</h4>
                      <p className="text-sm text-gray-600">
                        {template.breakfast.join(', ')}...
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            {!isLoggedIn ? (
              <div className="text-center py-8">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-4 py-2 border rounded-lg mr-4"
                />
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start Planning
                </button>
              </div>
            ) : (
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
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {day.day}
                    </button>
                  ))}
                </div>

                {mealPlan.map((day) => (
                  <div 
                    key={day.day} 
                    className={`mb-8 border-b pb-6 ${
                      selectedDay && selectedDay !== day.day ? 'hidden' : ''
                    }`}
                  >
                    <h3 className="text-xl font-semibold mb-4">{day.day}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(day.meals).map(([mealType, foods]) => (
                        <div key={mealType} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium capitalize">{mealType}</h4>
                            <button
                              onClick={() => {
                                setSelectedDay(day.day);
                                setSelectedMealType(mealType);
                                setShowFoodSelector(true);
                              }}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              + Add Food
                            </button>
                          </div>
                          <div className="min-h-[100px] bg-white rounded border-2 border-gray-300 p-2">
                            {foods.map((food: FoodItem, index: number) => (
                              <div key={index} className="flex items-center bg-blue-50 rounded p-2 mb-2">
                                <span className="mr-2">{food.icon}</span>
                                <span>{food.name}</span>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'quiz' && (
        <section className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Test Your Gut Knowledge</h2>
          {!quizStarted && !showResults ? (
            <div className="text-center">
              <button
                onClick={() => setQuizStarted(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          ) : showResults ? (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Quiz Complete!</h3>
              <p className="text-lg mb-4">Your Score: {score}/{quizQuestions.length}</p>
              <button
                onClick={resetQuiz}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{quizQuestions[currentQuestion].question}</h3>
              <div className="space-y-4">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSubmit(index)}
                    className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <footer className="bg-gray-800 text-white py-8 mb-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-400">
            Learn more about your gut health by consulting with healthcare professionals
          </p>
        </div>
      </footer>
    </main>
  );
}