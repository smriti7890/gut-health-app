
import { useState, useEffect, DragEvent } from 'react';

// Language support
type SupportedLanguage = 'en' | 'es' | 'zh' | 'hi' | 'ar';

interface LanguageContent {
  [key: string]: {
    [key: string]: string;
  };
}

interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  dailyValue: number;
  category: 'macronutrient' | 'vitamin' | 'mineral' | 'other';
}

interface MicrobeInfo {
  name: string;
  type: 'beneficial' | 'harmful' | 'neutral';
  description: string;
  effects: string[];
  population: number; // Represents relative abundance
  studies: StudyReference[];
}

interface StudyReference {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  url: string;
  findings: string;
}

interface FoodItem {
  id: string;
  name: string;
  category: 'probiotic' | 'prebiotic' | 'inflammatory' | 'neutral';
  icon: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  foodGroup: string;
  nutrients: Nutrient[];
  microbes: MicrobeInfo[];
  culturalInfo: {
    origins: string[];
    traditions: string[];
    alternatives: string[];
  };
  dietaryInfo: {
    isVegan: boolean;
    isVegetarian: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
    isHalal: boolean;
    isKosher: boolean;
  };
  studies: StudyReference[];
  customFood?: boolean;
  createdBy?: string;
  editable?: boolean;
}

interface HealthTrend {
  date: string;
  gutHealth: number;
  microbiomeBalance: number;
  nutrientLevels: {
    [key: string]: number;
  };
  symptoms: string[];
}

interface Quiz {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  questions: QuizQuestion[];
  requiredScore: number;
  studyMaterials: StudyReference[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  relatedStudies: StudyReference[];
}

interface Recipe {
  id: string;
  name: string;
  createdBy: string;
  foods: FoodItem[];
  description: string;
  instructions: string[];
  healthScore: number;
  nutrientProfile: Nutrient[];
  microbiomeImpact: MicrobeInfo[];
  culturalOrigin: string;
  dietaryCategories: string[];
  likes: number;
  likedBy: string[];
  tags: string[];
  createdAt: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTime: string;
  servings: number;
  studies: StudyReference[];
}

interface UserProfile {
  username: string;
  favoriteRecipes: Recipe[];
  healthScore: number;
  healthTrends: HealthTrend[];
  completedQuizzes: {
    quizId: string;
    score: number;
    date: string;
  }[];
  dietaryPreferences: {
    restrictions: string[];
    culturalPreferences: string[];
    allergies: string[];
  };
  language: SupportedLanguage;
  following: string[];
  followers: string[];
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
  totalNutrients: Nutrient[];
  microbiomeImpact: MicrobeInfo[];
}

type MealType = keyof MealPlan['meals'];






const languageContent: LanguageContent = {
  en: {
    appName: 'Gut Health Explorer',
    welcome: 'Track, learn, and improve your gut health',
    lowNutrient: 'Low in {nutrient}',
    nutrientSuggestion: 'Try adding foods rich in {nutrient} to your diet',
    // Add more translations
  },
  es: {
    appName: 'Explorador de Salud Digestiva',
    welcome: 'Monitorea, aprende y mejora tu salud digestiva',
    lowNutrient: 'Bajo en {nutrient}',
    nutrientSuggestion: 'Intenta agregar alimentos ricos en {nutrient} a tu dieta',
    // Add more translations
  },
  zh: {
    appName: '肠道健康探索器',
    welcome: '追踪、学习并改善肠道健康',
    lowNutrient: '{nutrient}含量低',
    nutrientSuggestion: '尝试添加富含{nutrient}的食物',
    // Add more translations
  },
  hi: {
    appName: 'पाचन स्वास्थ्य अन्वेषक',
    welcome: 'अपने पाचन स्वास्थ्य को ट्रैक करें, सीखें और सुधारें',
    lowNutrient: '{nutrient} की कमी',
    nutrientSuggestion: 'अपने आहार में {nutrient} युक्त खाद्य पदार्थ शामिल करें',
    // Add more translations
  },
  ar: {
    appName: 'مستكشف صحة الأمعاء',
    welcome: 'تتبع وتعلم وحسن صحة أمعائك',
    lowNutrient: 'منخفض في {nutrient}',
    nutrientSuggestion: 'حاول إضافة أطعمة غنية بـ {nutrient} إلى نظامك الغذائي',
    // Add more translations
  }
};


// Scientific studies database
const scientificStudies: StudyReference[] = [
  {
    title: 'The Role of Gut Microbiota in Immune Homeostasis and Autoimmunity',
    authors: ['Wu, H.J.', 'Wu, E.'],
    journal: 'Gut Microbes',
    year: 2012,
    doi: '10.4161/gmic.19320',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3337124/',
    findings: 'Demonstrates the crucial role of gut microbiota in maintaining immune system balance.'
  },
  {
    title: 'Gut microbiome and its role in obesity and insulin resistance',
    authors: ['Mazidi, M.', 'Rezaie, P.', 'Kengne, A.P.', 'Mobarhan, M.G.', 'Ferns, G.A.'],
    journal: 'Journal of Cellular Physiology',
    year: 2016,
    doi: '10.1002/jcp.25518',
    url: 'https://pubmed.ncbi.nlm.nih.gov/27459855/',
    findings: 'Links gut microbiome composition to metabolic health outcomes.'
  }
];

// Microbiome information
const microbeDatabase: MicrobeInfo[] = [
  {
    name: 'Lactobacillus acidophilus',
    type: 'beneficial',
    description: 'Common probiotic bacteria that helps maintain gut barrier function',
    effects: [
      'Improves digestion',
      'Enhances immune function',
      'Produces vitamin K and B vitamins'
    ],
    population: 0.8,
    studies: [scientificStudies[0]]
  },
  {
    name: 'Bifidobacterium longum',
    type: 'beneficial',
    description: 'Helps maintain gut health and boost immune system',
    effects: [
      'Reduces inflammation',
      'Improves gut barrier function',
      'Helps digest complex carbohydrates'
    ],
    population: 0.9,
    studies: [scientificStudies[1]]
  }
];

// Cultural food information
const culturalFoodData = {
  asian: {
    fermented: ['Kimchi', 'Miso', 'Natto'],
    probiotic: ['Kombucha', 'Pickled vegetables'],
    traditional: ['Green tea', 'Seaweed']
  },
  mediterranean: {
    fermented: ['Yogurt', 'Olives'],
    probiotic: ['Kefir', 'Pickled vegetables'],
    traditional: ['Olive oil', 'Fish']
  },
  indian: {
    fermented: ['Lassi', 'Dosa'],
    probiotic: ['Buttermilk', 'Pickled vegetables'],
    traditional: ['Turmeric', 'Ginger']
  }
};

const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Greek Yogurt',
    category: 'probiotic',
    icon: '🥛',
    impact: 'positive',
    description: 'Rich in probiotics and protein, supports digestive health',
    foodGroup: 'Dairy & Alternatives',
    nutrients: [
      {
        name: 'Protein',
        amount: 15,
        unit: 'g',
        dailyValue: 30,
        category: 'macronutrient'
      },
      {
        name: 'Calcium',
        amount: 200,
        unit: 'mg',
        dailyValue: 20,
        category: 'mineral'
      }
    ],
    microbes: [microbeDatabase[0]],
    culturalInfo: {
      origins: ['Mediterranean', 'Middle Eastern'],
      traditions: ['Traditional breakfast food', 'Used in marinades'],
      alternatives: ['Coconut yogurt', 'Almond yogurt']
    },
    dietaryInfo: {
      isVegan: false,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: false,
      isHalal: true,
      isKosher: true
    },
    studies: [scientificStudies[0]]
  },
  {
    id: '2',
    name: 'Kimchi',
    category: 'probiotic',
    icon: '🥬',
    impact: 'positive',
    description: 'Traditional Korean fermented vegetables rich in probiotics',
    foodGroup: 'Fermented Foods',
    nutrients: [
      {
        name: 'Vitamin C',
        amount: 18,
        unit: 'mg',
        dailyValue: 20,
        category: 'vitamin'
      },
      {
        name: 'Fiber',
        amount: 2.4,
        unit: 'g',
        dailyValue: 10,
        category: 'macronutrient'
      }
    ],
    microbes: [microbeDatabase[0], microbeDatabase[1]],
    culturalInfo: {
      origins: ['Korean'],
      traditions: ['Daily staple', 'Traditional fermentation process'],
      alternatives: ['Sauerkraut', 'Pickled vegetables']
    },
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true,
      isHalal: true,
      isKosher: true
    },
    studies: [scientificStudies[1]]
  }
];

// Quiz data with difficulty levels
const quizzes: Quiz[] = [
  {
    id: 'basics-1',
    level: 'beginner',
    topic: 'Gut Health Basics',
    questions: [
      {
        id: 'q1',
        question: 'What percentage of your immune system is located in your gut?',
        options: ['30%', '50%', '70%', '90%'],
        correctAnswer: 2,
        explanation: 'About 70% of your immune system is located in your gut, making it crucial for overall health.',
        difficulty: 'easy',
        relatedStudies: [scientificStudies[0]]
      }
    ],
    requiredScore: 70,
    studyMaterials: [scientificStudies[0]]
  },
  {
    id: 'advanced-1',
    level: 'advanced',
    topic: 'Microbiome Interactions',
    questions: [
      {
        id: 'q2',
        question: 'Which metabolites produced by gut bacteria are essential for brain function?',
        options: [
          'Short-chain fatty acids',
          'Amino acids',
          'Neurotransmitters',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'Gut bacteria produce various compounds including SCFAs, amino acids, and neurotransmitters that influence brain function.',
        difficulty: 'hard',
        relatedStudies: [scientificStudies[1]]
      }
    ],
    requiredScore: 80,
    studyMaterials: [scientificStudies[1]]
  }
];



export default function Home() {
  // Core states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: '',
    favoriteRecipes: [],
    healthScore: 70,
    healthTrends: [],
    completedQuizzes: [],
    dietaryPreferences: {
      restrictions: [],
      culturalPreferences: [],
      allergies: []
    },
    language: 'en',
    following: [],
    followers: []
  });

  // Language and accessibility
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  
  // UI states
  const [activeTab, setActiveTab] = useState<'meter' | 'planner' | 'social' | 'profile' | 'learn'>('meter');
  const [activeSection, setActiveSection] = useState<'main' | 'microbiome' | 'nutrients' | 'studies'>('main');
  
  // Health tracking states
  const [gutHealth, setGutHealth] = useState<number>(70);
  const [microbiomeBalance, setMicrobiomeBalance] = useState<number>(50);
  const [recentReactions, setRecentReactions] = useState<string[]>([]);
  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [meterFoods, setMeterFoods] = useState<FoodItem[]>([]);

  // Learning states
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizProgress, setQuizProgress] = useState<{
    currentQuestion: number;
    score: number;
    answers: number[];
  }>({
    currentQuestion: 0,
    score: 0,
    answers: []
  });
  const [showStudyMaterial, setShowStudyMaterial] = useState<boolean>(false);
  const [selectedStudy, setSelectedStudy] = useState<StudyReference | null>(null);

  // Food and recipe states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFoodGroup, setSelectedFoodGroup] = useState<string>('All');
  const [selectedDietaryFilters, setSelectedDietaryFilters] = useState<string[]>([]);
  const [selectedCulturalPreferences, setSelectedCulturalPreferences] = useState<string[]>([]);
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);
  const [showAddCustomFood, setShowAddCustomFood] = useState<boolean>(false);
  const [showFoodSelector, setShowFoodSelector] = useState<boolean>(false);
  const [showMicrobiomeView, setShowMicrobiomeView] = useState<boolean>(false);
  const [showNutrientAnalysis, setShowNutrientAnalysis] = useState<boolean>(false);

  // Microbiome visualization states
  const [selectedMicrobe, setSelectedMicrobe] = useState<MicrobeInfo | null>(null);
  const [microbiomeData, setMicrobiomeData] = useState<{
    beneficial: number;
    harmful: number;
    neutral: number;
  }>({
    beneficial: 70,
    harmful: 10,
    neutral: 20
  });

  // Nutrient tracking states
  const [dailyNutrients, setDailyNutrients] = useState<Nutrient[]>([]);
  const [nutrientGoals, setNutrientGoals] = useState<{[key: string]: number}>({});

  // Handler Functions
  const updateMicrobiomeBalance = (newFoods: FoodItem[]) => {
    const beneficialCount = newFoods.filter(f => 
      f.microbes.some(m => m.type === 'beneficial')).length;
    const harmfulCount = newFoods.filter(f => 
      f.microbes.some(m => m.type === 'harmful')).length;
    
    const totalFoods = newFoods.length || 1;
    const newBalance = Math.min(
      Math.max(
        ((beneficialCount - harmfulCount) / totalFoods) * 100 + 50,
        0
      ),
      100
    );
    
    setMicrobiomeBalance(newBalance);
    updateHealthTrends();
  };

  const updateNutrientProfile = (foods: FoodItem[]) => {
    const nutrients: { [key: string]: Nutrient } = {};
    
    foods.forEach(food => {
      food.nutrients.forEach(nutrient => {
        if (!nutrients[nutrient.name]) {
          nutrients[nutrient.name] = { ...nutrient, amount: 0 };
        }
        nutrients[nutrient.name].amount += nutrient.amount;
      });
    });

    setDailyNutrients(Object.values(nutrients));
  };

  const handleFoodDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const foodId = e.dataTransfer.getData('foodId');
    const food = [...foodItems, ...customFoods].find(f => f.id === foodId);
    if (food) {
      const newFood = { ...food, id: `meter-${Date.now()}`, editable: true };
      const newFoods = [...meterFoods, newFood];
      setMeterFoods(newFoods);
      updateGutHealth(newFood.impact);
      updateMicrobiomeBalance(newFoods);
      updateNutrientProfile(newFoods);
    }
  };

  const updateGutHealth = (impact: 'positive' | 'negative' | 'neutral') => {
    const healthChange = impact === 'positive' ? 5 : impact === 'negative' ? -5 : 0;
    setGutHealth(prev => {
      const newHealth = Math.min(Math.max(prev + healthChange, 0), 100);
      return newHealth;
    });
  };

  const updateHealthTrends = () => {
    const newTrend: HealthTrend = {
      date: new Date().toISOString(),
      gutHealth,
      microbiomeBalance,
      nutrientLevels: dailyNutrients.reduce((acc, nutrient) => ({
        ...acc,
        [nutrient.name]: nutrient.amount
      }), {}),
      symptoms: []
    };

    setHealthTrends(prev => [...prev, newTrend]);
  };

  const startQuiz = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    const availableQuizzes = quizzes.filter(q => q.level === difficulty);
    if (availableQuizzes.length > 0) {
      const randomQuiz = availableQuizzes[Math.floor(Math.random() * availableQuizzes.length)];
      setCurrentQuiz(randomQuiz);
      setQuizProgress({
        currentQuestion: 0,
        score: 0,
        answers: []
      });
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (!currentQuiz) return;

    const isCorrect = currentQuiz.questions[quizProgress.currentQuestion].correctAnswer === answerIndex;
    const newScore = isCorrect ? quizProgress.score + 1 : quizProgress.score;
    const newAnswers = [...quizProgress.answers, answerIndex];

    if (quizProgress.currentQuestion + 1 < currentQuiz.questions.length) {
      setQuizProgress({
        currentQuestion: quizProgress.currentQuestion + 1,
        score: newScore,
        answers: newAnswers
      });
    } else {
      // Quiz completed
      const finalScore = (newScore / currentQuiz.questions.length) * 100;
      if (finalScore >= currentQuiz.requiredScore) {
        setUserProfile(prev => ({
          ...prev,
          completedQuizzes: [
            ...prev.completedQuizzes,
            {
              quizId: currentQuiz.id,
              score: finalScore,
              date: new Date().toISOString()
            }
          ]
        }));
      }
      setShowStudyMaterial(true);
    }
  };



  // More Handler Functions
  const calculateNutrientScore = (nutrients: Nutrient[]): number => {
    const essentialNutrients = ['Protein', 'Fiber', 'Vitamin C', 'Calcium', 'Iron'];
    let score = 0;
    
    essentialNutrients.forEach(nutrient => {
      const found = nutrients.find(n => n.name === nutrient);
      if (found && found.dailyValue >= 20) {
        score += 20;
      }
    });
    
    return Math.min(score, 100);
  };

  const getMicrobiomeStatus = (): string => {
    if (microbiomeBalance > 70) return 'Excellent';
    if (microbiomeBalance > 50) return 'Good';
    if (microbiomeBalance > 30) return 'Fair';
    return 'Needs Improvement';
  };

  const getHealthColor = () => {
    if (gutHealth > 70) return 'text-green-500';
    if (gutHealth > 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const translate = (key: string, params?: Record<string, string>): string => {
    let text = languageContent[currentLanguage]?.[key] || languageContent.en[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
      });
    }
    
    return text;
  };

  // UI Components Start
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {!isAuthenticated ? (
        // Login Page with Language Selection
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">{translate('appName')}</h1>
              <p className="mt-2 text-gray-600">{translate('welcome')}</p>
            </div>

            {/* Language Selector */}
            <div className="flex justify-center space-x-2 mb-6">
              {(['en', 'es', 'zh', 'hi', 'ar'] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCurrentLanguage(lang)}
                  className={`px-3 py-1 rounded-full ${
                    currentLanguage === lang
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (userProfile.username.trim()) {
                setIsAuthenticated(true);
              }
            }} className="mt-8 space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  {translate('username')}
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={userProfile.username}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={translate('enterUsername')}
                />
              </div>

              {/* Cultural Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translate('culturalPreferences')}
                </label>
                <div className="space-y-2">
                  {Object.keys(culturalFoodData).map((culture) => (
                    <label key={culture} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userProfile.dietaryPreferences.culturalPreferences.includes(culture)}
                        onChange={(e) => {
                          setUserProfile(prev => ({
                            ...prev,
                            dietaryPreferences: {
                              ...prev.dietaryPreferences,
                              culturalPreferences: e.target.checked
                                ? [...prev.dietaryPreferences.culturalPreferences, culture]
                                : prev.dietaryPreferences.culturalPreferences.filter(c => c !== culture)
                            }
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{translate(culture)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translate('dietaryRestrictions')}
                </label>
                <div className="space-y-2">
                  {['vegan', 'vegetarian', 'glutenFree', 'dairyFree'].map((restriction) => (
                    <label key={restriction} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userProfile.dietaryPreferences.restrictions.includes(restriction)}
                        onChange={(e) => {
                          setUserProfile(prev => ({
                            ...prev,
                            dietaryPreferences: {
                              ...prev.dietaryPreferences,
                              restrictions: e.target.checked
                                ? [...prev.dietaryPreferences.restrictions, restriction]
                                : prev.dietaryPreferences.restrictions.filter(r => r !== restriction)
                            }
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{translate(restriction)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {translate('startJourney')}
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
                <h1 className="text-xl font-bold text-gray-800">{translate('appName')}</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    {translate('welcome')}, {userProfile.username}
                  </span>
                  <div className={`px-3 py-1 rounded-full ${getHealthColor()} bg-opacity-10`}>
                    {translate('healthScore')}: {gutHealth}%
                  </div>
                  <select
                    value={currentLanguage}
                    onChange={(e) => setCurrentLanguage(e.target.value as SupportedLanguage)}
                    className="ml-2 border rounded-md px-2 py-1"
                  >
                    {(['en', 'es', 'zh', 'hi', 'ar'] as SupportedLanguage[]).map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </header>

          <div className="pt-16 pb-16">
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
                    {translate('gutHealthMeter')}
                  </button>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className={`px-3 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'planner'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {translate('mealPlanner')}
                  </button>
                  <button
                    onClick={() => setActiveTab('learn')}
                    className={`px-3 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'learn'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {translate('learn')}
                  </button>
                  <button
                    onClick={() => setActiveTab('social')}
                    className={`px-3 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'social'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {translate('community')}
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-3 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'profile'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {translate('profile')}
                  </button>
                </nav>
              </div>
            </div>

            {/* Secondary Navigation for Meter Tab */}
            {activeTab === 'meter' && (
              <div className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex space-x-4 py-2">
                    <button
                      onClick={() => setActiveSection('main')}
                      className={`px-3 py-1 rounded-full ${
                        activeSection === 'main'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      {translate('overview')}
                    </button>
                    <button
                      onClick={() => setActiveSection('microbiome')}
                      className={`px-3 py-1 rounded-full ${
                        activeSection === 'microbiome'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      {translate('microbiome')}
                    </button>
                    <button
                      onClick={() => setActiveSection('nutrients')}
                      className={`px-3 py-1 rounded-full ${
                        activeSection === 'nutrients'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      {translate('nutrients')}
                    </button>
                    <button
                      onClick={() => setActiveSection('studies')}
                      className={`px-3 py-1 rounded-full ${
                        activeSection === 'studies'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      {translate('studies')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 py-8">


    {activeTab === 'meter' && (
                <div className="space-y-8">
                  {activeSection === 'main' && (
                    <>
                      {/* Gut Health Meter Section */}
                      <section className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                          {translate('gutHealthMeter')}
                        </h2>
                        
                        {/* Health Meters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          {/* Overall Gut Health */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">{translate('overallGutHealth')}</span>
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

                          {/* Microbiome Balance */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">{translate('microbiomeBalance')}</span>
                              <span className="text-2xl font-bold text-blue-500">
                                {microbiomeBalance}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div
                                className="h-4 rounded-full transition-all duration-500 bg-blue-500"
                                style={{ width: `${microbiomeBalance}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Drag & Drop Zone */}
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleFoodDrop}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8 hover:border-blue-500 transition-colors min-h-[200px] flex flex-col items-center justify-center"
                        >
                          <p className="text-gray-600 mb-4">{translate('dragFoodsHere')}</p>
                          
                          {/* Added Foods Display */}
                          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                            {meterFoods.map((food) => (
                              <div
                                key={food.id}
                                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-2xl">{food.icon}</span>
                                  <button
                                    onClick={() => {
                                      const newFoods = meterFoods.filter(f => f.id !== food.id);
                                      setMeterFoods(newFoods);
                                      updateMicrobiomeBalance(newFoods);
                                      updateNutrientProfile(newFoods);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </div>
                                <div className="font-medium">{food.name}</div>
                                <div className="text-sm text-gray-600">{translate(food.impact)}</div>
                                {food.studies.length > 0 && (
                                  <button
                                    onClick={() => {
                                      setSelectedStudy(food.studies[0]);
                                      setActiveSection('studies');
                                    }}
                                    className="text-xs text-blue-500 hover:text-blue-700 mt-2"
                                  >
                                    {translate('viewStudy')}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Real-time Analysis */}
                        {meterFoods.length > 0 && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-2">
                              {translate('realTimeAnalysis')}
                            </h3>
                            <ul className="space-y-2">
                              <li className="flex items-center">
                                <span className="w-1/3 text-gray-600">{translate('beneficialFoods')}:</span>
                                <span className="text-green-600">
                                  {meterFoods.filter(f => f.impact === 'positive').length}
                                </span>
                              </li>
                              <li className="flex items-center">
                                <span className="w-1/3 text-gray-600">{translate('harmfulFoods')}:</span>
                                <span className="text-red-600">
                                  {meterFoods.filter(f => f.impact === 'negative').length}
                                </span>
                              </li>
                              <li className="flex items-center">
                                <span className="w-1/3 text-gray-600">{translate('microbiomeStatus')}:</span>
                                <span className="text-blue-600">
                                  {getMicrobiomeStatus()}
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </section>

                      {/* Health Trends */}
                      <section className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                          {translate('healthTrends')}
                        </h3>
                        <div className="space-y-4">
                          {healthTrends.slice(-5).map((trend, index) => (
                            <div key={index} className="border-b pb-4">
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600">
                                  {new Date(trend.date).toLocaleDateString()}
                                </span>
                                <span className={`font-medium ${
                                  trend.gutHealth > 70 ? 'text-green-500' :
                                  trend.gutHealth > 40 ? 'text-yellow-500' : 'text-red-500'
                                }`}>
                                  {trend.gutHealth}%
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {translate('microbiomeBalance')}: {trend.microbiomeBalance}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </>
                  )}

                  {activeSection === 'microbiome' && (
                    <section className="bg-white rounded-lg shadow-lg p-6">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        {translate('microbiomeVisualization')}
                      </h2>
                      
                      {/* Microbiome Distribution */}
                      <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4">{translate('bacterialDistribution')}</h3>
                        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="absolute h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${microbiomeData.beneficial}%` }}
                          ></div>
                          <div
                            className="absolute h-full bg-red-500 transition-all duration-500"
                            style={{ 
                              left: `${microbiomeData.beneficial}%`,
                              width: `${microbiomeData.harmful}%` 
                            }}
                          ></div>
                          <div
                            className="absolute h-full bg-gray-400 transition-all duration-500"
                            style={{ 
                              left: `${microbiomeData.beneficial + microbiomeData.harmful}%`,
                              width: `${microbiomeData.neutral}%` 
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                          <span className="text-green-500">{translate('beneficial')}: {microbiomeData.beneficial}%</span>
                          <span className="text-red-500">{translate('harmful')}: {microbiomeData.harmful}%</span>
                          <span className="text-gray-500">{translate('neutral')}: {microbiomeData.neutral}%</span>
                        </div>
                      </div>

                      {/* Microbe Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {microbeDatabase.map((microbe) => (
                          <div
                            key={microbe.name}
                            className="border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                            onClick={() => setSelectedMicrobe(microbe)}
                          >
                            <h4 className="font-medium text-gray-800">{microbe.name}</h4>
                            <p className="text-sm text-gray-600 mt-2">{microbe.description}</p>
                            <div className="mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                microbe.type === 'beneficial' ? 'bg-green-100 text-green-800' :
                                microbe.type === 'harmful' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {translate(microbe.type)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

              {activeSection === 'nutrients' && (
                    <section className="bg-white rounded-lg shadow-lg p-6">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        {translate('nutrientAnalysis')}
                      </h2>

                      {/* Nutrient Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-green-50 rounded-lg p-4">
                          <h3 className="font-medium text-green-800 mb-2">{translate('macronutrients')}</h3>
                          {dailyNutrients
                            .filter(n => n.category === 'macronutrient')
                            .map(nutrient => (
                              <div key={nutrient.name} className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{nutrient.name}</span>
                                  <span>{nutrient.amount}{nutrient.unit}</span>
                                </div>
                                <div className="w-full bg-green-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${Math.min(nutrient.dailyValue, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4">
                          <h3 className="font-medium text-blue-800 mb-2">{translate('vitamins')}</h3>
                          {dailyNutrients
                            .filter(n => n.category === 'vitamin')
                            .map(nutrient => (
                              <div key={nutrient.name} className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{nutrient.name}</span>
                                  <span>{nutrient.amount}{nutrient.unit}</span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${Math.min(nutrient.dailyValue, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                          <h3 className="font-medium text-purple-800 mb-2">{translate('minerals')}</h3>
                          {dailyNutrients
                            .filter(n => n.category === 'mineral')
                            .map(nutrient => (
                              <div key={nutrient.name} className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{nutrient.name}</span>
                                  <span>{nutrient.amount}{nutrient.unit}</span>
                                </div>
                                <div className="w-full bg-purple-200 rounded-full h-2">
                                  <div
                                    className="bg-purple-500 h-2 rounded-full"
                                    style={{ width: `${Math.min(nutrient.dailyValue, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Nutrient Recommendations */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="font-medium text-gray-800 mb-4">{translate('recommendations')}</h3>
                        <div className="space-y-4">
                          {dailyNutrients
                            .filter(n => n.dailyValue < 50)
                            .map(nutrient => (
                              <div key={nutrient.name} className="flex items-start">
                                <span className="text-red-500 mr-2">⚠️</span>
                                <div>
                                  <p className="text-gray-800">
                                    {translate('lowNutrient', { nutrient: nutrient.name })}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {translate('nutrientSuggestion', { nutrient: nutrient.name })}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {activeSection === 'studies' && (
                    <section className="bg-white rounded-lg shadow-lg p-6">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        {translate('scientificStudies')}
                      </h2>

                      {selectedStudy ? (
                        <div className="space-y-6">
                          <button
                            onClick={() => setSelectedStudy(null)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            ← {translate('backToStudies')}
                          </button>

                          <div className="bg-blue-50 rounded-lg p-6">
                            <h3 className="text-xl font-medium text-gray-800 mb-4">
                              {selectedStudy.title}
                            </h3>
                            <div className="space-y-4">
                              <p className="text-gray-600">
                                <span className="font-medium">{translate('authors')}:</span>{' '}
                                {selectedStudy.authors.join(', ')}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">{translate('journal')}:</span>{' '}
                                {selectedStudy.journal} ({selectedStudy.year})
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">{translate('keyFindings')}:</span>{' '}
                                {selectedStudy.findings}
                              </p>
                              <a
                                href={selectedStudy.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 block mt-4"
                              >
                                {translate('readFullStudy')} →
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {scientificStudies.map((study) => (
                            <div
                              key={study.doi}
                              className="border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                              onClick={() => setSelectedStudy(study)}
                            >
                              <h3 className="font-medium text-gray-800 mb-2">{study.title}</h3>
                              <p className="text-sm text-gray-600">{study.findings}</p>
                              <div className="mt-2 text-sm text-gray-500">
                                {study.journal} ({study.year})
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  )}
                </div>
              )}

              {activeTab === 'learn' && (
                <div className="space-y-8">
                  {!currentQuiz ? (
                    <>
                      {/* Quiz Selection */}
                      <section className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                          {translate('quizzes')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {['beginner', 'intermediate', 'advanced'].map((level) => (
                            <div key={level} className="border rounded-lg p-6">
                              <h3 className="text-lg font-medium text-gray-800 mb-2">
                                {translate(level)}
                              </h3>
                              <p className="text-gray-600 mb-4">
                                {translate(`${level}Description`)}
                              </p>
                              <button
                                onClick={() => startQuiz(level as 'beginner' | 'intermediate' | 'advanced')}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                              >
                                {translate('startQuiz')}
                              </button>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Study Materials */}
                      <section className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                          {translate('studyMaterials')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {scientificStudies.map((study) => (
                            <div key={study.doi} className="border rounded-lg p-4">
                              <h3 className="font-medium text-gray-800 mb-2">{study.title}</h3>
                              <p className="text-sm text-gray-600 mb-4">{study.findings}</p>
                              <a
                                href={study.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                              >
                                {translate('readMore')} →
                              </a>
                            </div>
                          ))}
                        </div>
                      </section>
                    </>
                  ) : (
                    <section className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {currentQuiz.topic}
                        </h2>
                        <span className="text-gray-600">
                          {translate('question')} {quizProgress.currentQuestion + 1}/{currentQuiz.questions.length}
                        </span>
                      </div>

                      {!showStudyMaterial ? (
                        <div className="space-y-6">
                          <div className="bg-blue-50 rounded-lg p-6">
                            <h3 className="text-xl font-medium text-gray-800 mb-4">
                              {currentQuiz.questions[quizProgress.currentQuestion].question}
                            </h3>
                            <div className="space-y-4">
                              {currentQuiz.questions[quizProgress.currentQuestion].options.map((option, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleQuizAnswer(index)}
                                  className="w-full text-left p-4 rounded-lg bg-white hover:bg-gray-50 border transition-colors"
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          {quizProgress.answers.includes(currentQuiz.questions[quizProgress.currentQuestion].correctAnswer) && (
                            <div className="bg-green-50 rounded-lg p-4">
                              <p className="text-green-800">
                                {currentQuiz.questions[quizProgress.currentQuestion].explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="bg-blue-50 rounded-lg p-6">
                            <h3 className="text-xl font-medium text-gray-800 mb-4">
                              {translate('quizComplete')}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {translate('score')}: {Math.round((quizProgress.score / currentQuiz.questions.length) * 100)}%
                            </p>
                            {currentQuiz.studyMaterials.map((study, index) => (
                              <div key={index} className="mb-4">
                                <h4 className="font-medium text-gray-800 mb-2">{study.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{study.findings}</p>
                                <a
                                  href={study.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  {translate('readMore')} →
                                </a>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              setCurrentQuiz(null);
                              setShowStudyMaterial(false);
                            }}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            {translate('backToQuizzes')}
                          </button>
                        </div>
                      )}
                    </section>
                  )}
                </div>
              )}

    {activeTab === 'profile' && (
                <div className="space-y-8">
                  {/* Profile Overview */}
                  <section className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="bg-blue-100 rounded-full p-4">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold">{userProfile.username}</h2>
                        <p className="text-gray-600">{translate('memberSince')}: {
                          new Date().toLocaleDateString()
                        }</p>
                      </div>
                    </div>

                    {/* Health Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="font-medium text-green-800 mb-2">{translate('gutHealth')}</h3>
                        <div className="text-3xl font-bold text-green-600">{gutHealth}%</div>
                        <p className="text-sm text-green-700 mt-1">{translate('healthStatus')}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-medium text-blue-800 mb-2">{translate('quizzesCompleted')}</h3>
                        <div className="text-3xl font-bold text-blue-600">
                          {userProfile.completedQuizzes.length}
                        </div>
                        <p className="text-sm text-blue-700 mt-1">{translate('averageScore')}: {
                          userProfile.completedQuizzes.length > 0
                            ? Math.round(userProfile.completedQuizzes.reduce((acc, quiz) => acc + quiz.score, 0) / userProfile.completedQuizzes.length)
                            : 0
                        }%</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h3 className="font-medium text-purple-800 mb-2">{translate('savedRecipes')}</h3>
                        <div className="text-3xl font-bold text-purple-600">
                          {userProfile.favoriteRecipes.length}
                        </div>
                        <p className="text-sm text-purple-700 mt-1">{translate('recipesTracked')}</p>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">{translate('preferences')}</h3>
                      <div className="space-y-4">
                        {/* Dietary Preferences */}
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">{translate('dietaryPreferences')}</h4>
                          <div className="flex flex-wrap gap-2">
                            {userProfile.dietaryPreferences.restrictions.map((restriction) => (
                              <span
                                key={restriction}
                                className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm"
                              >
                                {translate(restriction)}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Cultural Preferences */}
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">{translate('culturalPreferences')}</h4>
                          <div className="flex flex-wrap gap-2">
                            {userProfile.dietaryPreferences.culturalPreferences.map((culture) => (
                              <span
                                key={culture}
                                className="px-3 py-1 bg-blue-100 rounded-full text-blue-700 text-sm"
                              >
                                {translate(culture)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Health Trends */}
                  <section className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">{translate('healthTrends')}</h3>
                    <div className="space-y-4">
                      {healthTrends.map((trend, index) => (
                        <div key={index} className="border-b pb-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">
                              {new Date(trend.date).toLocaleDateString()}
                            </span>
                            <span className={`font-medium ${
                              trend.gutHealth > 70 ? 'text-green-500' :
                              trend.gutHealth > 40 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {trend.gutHealth}%
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {translate('microbiomeBalance')}: {trend.microbiomeBalance}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
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
                <span className="text-xs">{translate('health')}</span>
              </button>
              <button
                onClick={() => setActiveTab('planner')}
                className={`flex flex-col items-center p-2 ${
                  activeTab === 'planner' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">📋</span>
                <span className="text-xs">{translate('planner')}</span>
              </button>
              <button
                onClick={() => setActiveTab('learn')}
                className={`flex flex-col items-center p-2 ${
                  activeTab === 'learn' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">📚</span>
                <span className="text-xs">{translate('learn')}</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center p-2 ${
                  activeTab === 'profile' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">👤</span>
                <span className="text-xs">{translate('profile')}</span>
              </button>
            </div>
          </nav>
        </>
      )}
    </main>
  );
}