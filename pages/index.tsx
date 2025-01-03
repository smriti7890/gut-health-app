import { useState, useEffect } from 'react';

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


const foodItems: FoodItem[] = [
  {
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
    name: 'Salmon',
    category: 'neutral',
    icon: '🐟',
    effect: 'Provides omega-3 fatty acids',
    impact: 'positive',
    description: 'Anti-inflammatory protein source',
    foodGroup: 'Proteins',
    dietaryInfo: {
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: true,
      isDairyFree: true
    },
    nutrients: {
      protein: 22,
      fiber: 0,
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

  // Food search and filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFoodGroup, setSelectedFoodGroup] = useState<string>('All');
  const [showFoodSelector, setShowFoodSelector] = useState<boolean>(false);
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedDietaryFilters, setSelectedDietaryFilters] = useState<string[]>([]);
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);
  const [showAddCustomFood, setShowAddCustomFood] = useState<boolean>(false);

  // Meal planning states
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

  // Filter functions
  const filteredFoods = [...foodItems, ...customFoods].filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedFoodGroup === 'All' || food.foodGroup === selectedFoodGroup;
    const matchesDietary = selectedDietaryFilters.length === 0 || 
      selectedDietaryFilters.every(filter => {
        switch(filter) {
          case 'vegan':
            return food.dietaryInfo.isVegan;
          case 'vegetarian':
            return food.dietaryInfo.isVegetarian;
          case 'glutenFree':
            return food.dietaryInfo.isGlutenFree;
          case 'dairyFree':
            return food.dietaryInfo.isDairyFree;
          default:
            return true;
        }
      });
    return matchesSearch && matchesGroup && matchesDietary;
  });

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

  
const addFoodToMeal = (food: FoodItem) => {
    const newMealPlan = [...mealPlan];
    const dayIndex = newMealPlan.findIndex(d => d.day === selectedDay);
    if (dayIndex !== -1 && selectedMealType) {
      const mealTypeKey = selectedMealType.toLowerCase() as keyof MealPlan['meals'];
      if (mealTypeKey in newMealPlan[dayIndex].meals) {
        newMealPlan[dayIndex].meals[mealTypeKey].push(food);
        setMealPlan(newMealPlan);
        setShowFoodSelector(false);
      }
    }
  };


  const removeFoodFromMeal = (dayIndex: number, mealType: string, foodIndex: number) => {
    const newMealPlan = [...mealPlan];
    const mealTypeKey = mealType.toLowerCase() as keyof MealPlan['meals'];
    if (mealTypeKey in newMealPlan[dayIndex].meals) {
      newMealPlan[dayIndex].meals[mealTypeKey] = 
        newMealPlan[dayIndex].meals[mealTypeKey].filter((_, i) => i !== foodIndex);
      setMealPlan(newMealPlan);
    }
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

  const toggleDietaryFilter = (filter: string) => {
    setSelectedDietaryFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };



return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Food Selector Modal */}
      {showFoodSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add Food to {selectedMealType}</h3>
              <button
                onClick={() => setShowFoodSelector(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Food Group Filters */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Food Groups</h4>
                <div className="flex flex-wrap gap-2">
                  {foodCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedFoodGroup(category)}
                      className={`px-3 py-1 rounded-full ${
                        selectedFoodGroup === category
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Filters */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Dietary Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {dietaryFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => toggleDietaryFilter(filter.id)}
                      className={`px-3 py-1 rounded-full border ${
                        selectedDietaryFilters.includes(filter.id)
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <button
                    key={food.name}
                    onClick={() => addFoodToMeal(food)}
                    className="p-4 rounded-lg border hover:border-blue-500 transition-all text-center"
                  >
                    <div className="text-3xl mb-2">{food.icon}</div>
                    <div className="font-medium">{food.name}</div>
                    <div className="text-sm text-gray-600">{food.category}</div>
                    <div className="flex flex-wrap gap-1 mt-2 justify-center">
                      {food.dietaryInfo.isVegan && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Vegan</span>
                      )}
                      {food.dietaryInfo.isGlutenFree && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">GF</span>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No foods match your search criteria
                </div>
              )}
            </div>

            {/* Add Custom Food Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAddCustomFood(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                Don't see what you're looking for? Add a custom food
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Food Modal */}
      {showAddCustomFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Add Custom Food</h3>
            {/* Add custom food form here if you want this feature */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddCustomFood(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


 <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Gut Health Explorer</h1>
          <p className="text-gray-600 mt-2">Plan and track your gut-healthy meals</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Food Reaction Simulator</h2>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Gut Health Meter</h3>
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

          {selectedFood && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Food Effect:</h4>
              <p className="text-gray-700">{selectedFood.description}</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Recent Reactions:</h4>
            <ul className="space-y-2">
              {recentReactions.map((reaction, index) => (
                <li key={index} className="text-gray-600">{reaction}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Weekly Meal Planner</h2>
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
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                          {foods.map((food, index) => (
                            <div key={index} className="flex items-center bg-blue-50 rounded p-2 mb-2">
                              <span className="mr-2">{food.icon}</span>
                              <span>{food.name}</span>
                              <button
                                onClick={() => removeFoodFromMeal(
                                  mealPlan.findIndex(d => d.day === day.day),
                                  mealType,
                                  index
                                )}
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

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">Symptom Checker</h2>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">Select any symptoms you&apos;re experiencing:</p>
            <div className="flex flex-wrap gap-3">
              {symptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedSymptoms.includes(symptom)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>
          {selectedSymptoms.length > 0 && (
            <button
              onClick={() => setShowSymptomResults(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Analyze Symptoms
            </button>
          )}
          {showSymptomResults && selectedSymptoms.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Potential Considerations:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Consider keeping a food diary to identify trigger foods</li>
                <li>Monitor your stress levels as they can affect gut health</li>
                <li>Ensure you&apos;re staying hydrated throughout the day</li>
                <li>Consider consulting with a healthcare professional for personalized advice</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center px-4 py-2">
          <button
            onClick={() => setSelectedDay(mealPlan[0].day)}
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <span className="text-xl">📋</span>
            <span className="text-xs">Planner</span>
          </button>
          <button
            onClick={() => setShowFoodSelector(true)}
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <span className="text-xl">🍽️</span>
            <span className="text-xs">Add Food</span>
          </button>
          <button
            onClick={() => setQuizStarted(true)}
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <span className="text-xl">📚</span>
            <span className="text-xs">Quiz</span>
          </button>
        </div>
      </nav>

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