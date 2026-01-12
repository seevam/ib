'use client';

import { useState } from 'react';

interface Question {
  id: number;
  title: string;
  content: string;
  questionType: 'multiple_choice' | 'short_answer' | 'essay' | 'calculation';
  difficulty: 'easy' | 'medium' | 'hard';
  options: any;
  correctAnswer: string;
  explanation: string;
}

interface Subject {
  id: number;
  name: string;
  displayName: string;
}

interface Props {
  questions: Question[];
  subject: Subject;
  userId: number;
}

export default function QuestionPractice({ questions, subject, userId }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [aiInput, setAiInput] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setShowAIAssistant(false);
      setAiMessages([]);
      setAiInput('');
      setHasSubmitted(false);
      setEvaluation(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserAnswer('');
      setShowAIAssistant(false);
      setAiMessages([]);
      setAiInput('');
      setHasSubmitted(false);
      setEvaluation(null);
    }
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim()) {
      alert('Please provide an answer before submitting.');
      return;
    }

    setIsEvaluating(true);
    setHasSubmitted(true);

    try {
      const response = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: {
            title: currentQuestion.title,
            content: currentQuestion.content,
            correctAnswer: currentQuestion.correctAnswer,
            explanation: currentQuestion.explanation,
            subject: subject.displayName,
            difficulty: currentQuestion.difficulty,
          },
          userAnswer,
          userId,
          questionId: currentQuestion.id,
        }),
      });

      const result = await response.json();
      setEvaluation(result);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      alert('Failed to evaluate answer. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleAIChat = async () => {
    if (!aiInput.trim()) return;

    const userMessage = { role: 'user', content: aiInput };
    setAiMessages([...aiMessages, userMessage]);
    setAiInput('');
    setIsLoadingAI(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...aiMessages, userMessage],
          question: {
            title: currentQuestion.title,
            content: currentQuestion.content,
            correctAnswer: currentQuestion.correctAnswer,
            explanation: currentQuestion.explanation,
            subject: subject.displayName,
            difficulty: currentQuestion.difficulty,
          },
          userAnswer,
        }),
      });

      const data = await response.json();
      setAiMessages([...aiMessages, userMessage, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAiMessages([
        ...aiMessages,
        userMessage,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleGetHint = async () => {
    setIsLoadingAI(true);
    setShowAIAssistant(true);

    try {
      const response = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: {
            title: currentQuestion.title,
            content: currentQuestion.content,
            correctAnswer: currentQuestion.correctAnswer,
            explanation: currentQuestion.explanation,
            subject: subject.displayName,
            difficulty: currentQuestion.difficulty,
          },
          conversationHistory: aiMessages,
        }),
      });

      const data = await response.json();
      setAiMessages([...aiMessages, { role: 'assistant', content: data.hint }]);
    } catch (error) {
      console.error('Error getting hint:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Question Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {currentQuestion.questionType.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{currentQuestion.title}</h2>
            </div>
            <div className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{currentQuestion.content}</p>
          </div>

          {currentQuestion.questionType === 'multiple_choice' && currentQuestion.options && (
            <div className="space-y-2 mb-6">
              {Object.entries(currentQuestion.options as Record<string, string>).map(([key, value]) => (
                <label
                  key={key}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    userAnswer === key
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${hasSubmitted ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={key}
                    checked={userAnswer === key}
                    onChange={(e) => !hasSubmitted && setUserAnswer(e.target.value)}
                    disabled={hasSubmitted}
                    className="mr-3"
                  />
                  <span className="font-medium mr-2">{key}.</span>
                  <span>{value}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.questionType !== 'multiple_choice' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer:</label>
              <textarea
                value={userAnswer}
                onChange={(e) => !hasSubmitted && setUserAnswer(e.target.value)}
                disabled={hasSubmitted}
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none ${
                  hasSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                rows={6}
                placeholder="Type your answer here..."
              />
            </div>
          )}

          {/* Evaluation Result */}
          {evaluation && (
            <div className={`p-4 rounded-lg mb-6 ${evaluation.isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {evaluation.isCorrect ? (
                  <>
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-green-900">Correct!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-orange-900">Not quite right</span>
                  </>
                )}
                <span className="ml-auto font-bold text-lg">Score: {evaluation.score}/100</span>
              </div>
              <p className="text-gray-700 mb-3">{evaluation.feedback}</p>
              {evaluation.suggestions && evaluation.suggestions.length > 0 && (
                <div>
                  <p className="font-medium text-gray-900 mb-1">Suggestions:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {evaluation.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!hasSubmitted ? (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim() || isEvaluating}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  {isEvaluating ? 'Evaluating...' : 'Submit Answer'}
                </button>
                <button
                  onClick={handleGetHint}
                  disabled={isLoadingAI}
                  className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                >
                  Get Hint
                </button>
              </>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex >= questions.length - 1}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                Next Question
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex >= questions.length - 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Tutor</h3>
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showAIAssistant ? 'Hide' : 'Show'}
            </button>
          </div>

          {showAIAssistant ? (
            <>
              <div className="mb-4 h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-3">
                {aiMessages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm mt-8">
                    <div className="text-4xl mb-2">🤖</div>
                    <p>Ask me anything about this question!</p>
                    <p className="mt-2">I'm here to guide your thinking, not give you the answer.</p>
                  </div>
                ) : (
                  aiMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-100 ml-4'
                          : 'bg-gray-100 mr-4'
                      }`}
                    >
                      <div className="text-xs font-medium mb-1 text-gray-600">
                        {message.role === 'user' ? 'You' : 'AI Tutor'}
                      </div>
                      <div className="text-sm text-gray-800">{message.content}</div>
                    </div>
                  ))
                )}
                {isLoadingAI && (
                  <div className="bg-gray-100 mr-4 p-3 rounded-lg">
                    <div className="text-xs font-medium mb-1 text-gray-600">AI Tutor</div>
                    <div className="text-sm text-gray-600">Thinking...</div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                  placeholder="Ask for help..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-sm"
                  disabled={isLoadingAI}
                />
                <button
                  onClick={handleAIChat}
                  disabled={!aiInput.trim() || isLoadingAI}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🤖</div>
              <p className="text-gray-600 text-sm mb-4">
                Need help? Click "Show" to chat with your AI tutor!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
