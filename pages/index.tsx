import { useState } from 'react';

interface FoodItem {
  name: string;
  category: 'probiotic' | 'prebiotic' | 'inflammatory' | 'neutral';
  icon: string;
  effect: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface GutReaction {
  message: string;
  healthImpact: number;
  color: string;
}

const foodItems: FoodItem[] = [
  {
    name: 'Yogurt',
    category: 'probiotic',
    icon: '🥛',
    effect: 'Adds beneficial bacteria',
    impact: 'positive',
    description: 'Rich in probiotics that support gut flora'
  },
  {
    name: 'Kimchi',
    category: 'probiotic',
    icon: '🥬',
    effect: 'Enhances gut diversity',
    impact: 'positive',
    description: 'Fermented vegetables full of healthy bacteria'
  },
  {
    name: 'Garlic',
    category: 'prebiotic',
    icon: '🧄',
    effect: 'Feeds good bacteria',
    impact: 'positive',
    description: 'Prebiotic that helps beneficial bacteria thrive'
  },
  {
    name: 'Processed Sugar',
    category: 'inflammatory',
    icon: '🍬',
    effect: 'Disrupts gut balance',
    impact: 'negative',
    description: 'Can lead to inflammation and bacterial imbalance'
  },
  {
    name: 'Green Vegetables',
    category: 'prebiotic',
    icon: '🥦',
    effect: 'Supports gut health',
    impact: 'positive',
    description: 'High in fiber and nutrients for gut health'
  },
  {
    name: 'Fast Food',
    category: 'inflammatory',
    icon: '🍔',
    effect: 'Increases inflammation',
    impact: 'negative',
    description: 'Can disturb gut bacterial balance'
  },
  {
    name: 'Banana',
    category: 'prebiotic',
    icon: '🍌',
    effect: 'Feeds beneficial bacteria',
    impact: 'positive',
    description: 'Contains prebiotics that support gut health'
  },
  {
    name: 'Kombucha',
    category: 'probiotic',
    icon: '🫖',
    effect: 'Adds beneficial yeasts',
    impact: 'positive',
    description: 'Fermented tea with probiotics and antioxidants'
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Interactive Gut Health Explorer</h1>
          <p className="text-gray-600 mt-2">Discover how different foods affect your gut health</p>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {foodItems.map((food) => (
              <button
                key={food.name}
                onClick={() => handleFoodSelect(food)}
                className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-2">{food.icon}</div>
                <div className="font-medium">{food.name}</div>
                <div className="text-sm text-gray-600">{food.category}</div>
              </button>
            ))}
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

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-400">
            Learn more about your gut health by consulting with healthcare professionals
          </p>
        </div>
      </footer>
    </main>
  );
}
