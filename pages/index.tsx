import { useState } from 'react';

interface BacteriaInfo {
  name: string;
  description: string;
  benefits: string[];
  location: string;
  icon: string;
  category: 'beneficial' | 'essential' | 'protective';
}

interface DigestiveOrgan {
  name: string;
  description: string;
  role: string;
  bacteria: string[];
  position: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const bacteriaData: BacteriaInfo[] = [
  {
    name: 'Lactobacillus',
    description: 'Friendly bacteria that helps break down food and supports immune function',
    benefits: ['Improves digestion', 'Produces vitamin K', 'Fights harmful bacteria'],
    location: 'Small intestine and colon',
    icon: '🦠',
    category: 'beneficial'
  },
  {
    name: 'Bifidobacterium',
    description: 'Essential bacteria that helps maintain digestive health',
    benefits: ['Supports immune system', 'Produces B vitamins', 'Helps absorb nutrients'],
    location: 'Large intestine',
    icon: '🔬',
    category: 'essential'
  },
  {
    name: 'Escherichia coli',
    description: 'Beneficial strains that help with vitamin production',
    benefits: ['Produces vitamin K2', 'Helps digest food', 'Prevents harmful bacterial growth'],
    location: 'Large intestine',
    icon: '🧬',
    category: 'protective'
  }
];

const digestiveSystem: DigestiveOrgan[] = [
  {
    name: 'Stomach',
    description: 'Breaks down food using acid and enzymes',
    role: 'Initial digestion and protein breakdown',
    bacteria: ['Lactobacillus'],
    position: 'top-1/3'
  },
  {
    name: 'Small Intestine',
    description: 'Absorbs nutrients from digested food',
    role: 'Nutrient absorption and further digestion',
    bacteria: ['Lactobacillus', 'Bifidobacterium'],
    position: 'middle'
  },
  {
    name: 'Large Intestine',
    description: 'Absorbs water and processes waste',
    role: 'Water absorption and bacterial fermentation',
    bacteria: ['Bifidobacterium', 'Escherichia coli'],
    position: 'bottom-1/3'
  }
];

const quizQuestions: QuizQuestion[] = [
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
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showSymptomResults, setShowSymptomResults] = useState<boolean>(false);

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

  const filteredBacteria = bacteriaData.filter(bacteria =>
    activeFilter === 'all' ? true : bacteria.category === activeFilter
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Interactive Gut Health Explorer</h1>
          <p className="text-gray-600 mt-2">Discover and learn about your digestive system</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Digestive System Explorer</h2>
        <div className="relative bg-white rounded-lg shadow-lg p-6 min-h-[400px]">
          {digestiveSystem.map((organ) => (
            <div
              key={organ.name}
              className={`absolute ${organ.position === 'top-1/3' ? 'top-12' : organ.position === 'middle' ? 'top-1/2 -translate-y-1/2' : 'bottom-12'} 
                left-1/2 transform -translate-x-1/2 cursor-pointer transition-all
                ${selectedOrgan === organ.name ? 'scale-110' : 'hover:scale-105'}`}
              onClick={() => setSelectedOrgan(organ.name)}
            >
              <div className="bg-blue-100 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-blue-800">{organ.name}</h3>
                {selectedOrgan === organ.name && (
                  <div className="mt-4 animate-fadeIn">
                    <p className="text-sm text-gray-600">{organ.description}</p>
                    <p className="text-sm text-blue-700 mt-2">{organ.role}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bacteria Filter</h2>
        <div className="flex gap-4 mb-6">
          {['all', 'beneficial', 'essential', 'protective'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full ${
                activeFilter === filter
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBacteria.map((bacteria) => (
            <div
              key={bacteria.name}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4 animate-pulse">{bacteria.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{bacteria.name}</h3>
              <p className="text-gray-600 mb-4">{bacteria.description}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Benefits:</p>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {bacteria.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
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
                <li>Ensure you're staying hydrated throughout the day</li>
                <li>Consider consulting with a healthcare professional for personalized advice</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-400">
            {'Learn more about your gut health by consulting with healthcare professionals'}
          </p>
        </div>
      </footer>
    </main>
  );
}
