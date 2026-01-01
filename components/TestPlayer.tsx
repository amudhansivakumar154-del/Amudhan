
import React, { useState, useEffect } from 'react';
import { Test, TestResult } from '../types';
import { Timer, ArrowRight, ArrowLeft, Flag, CheckCircle } from 'lucide-react';

interface TestPlayerProps {
  test: Test;
  studentId: string;
  onFinish: (result: TestResult) => void;
}

const TestPlayer: React.FC<TestPlayerProps> = ({ test, studentId, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (idx: number) => {
    setAnswers({ ...answers, [test.questions[currentIdx].id]: idx });
  };

  const handleSubmit = () => {
    let score = 0;
    const breakdown: Record<string, number> = {};

    test.questions.forEach(q => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctAnswer;
      
      if (!breakdown[q.subject]) breakdown[q.subject] = 0;
      
      if (test.type === TestType.NEET) {
          if (isCorrect) {
              score += 4;
              breakdown[q.subject] += 4;
          } else if (selected !== undefined) {
              score -= 1;
              breakdown[q.subject] -= 1;
          }
      } else {
          if (isCorrect) {
              score += 1;
              breakdown[q.subject] += 1;
          }
      }
    });

    const result: TestResult = {
      id: Math.random().toString(36).substr(2, 9),
      testId: test.id,
      studentId,
      score,
      maxScore: test.totalMarks,
      subjectBreakdown: breakdown,
      timestamp: new Date().toISOString(),
      answers,
    };

    setIsSubmitted(true);
    onFinish(result);
  };

  const currentQ = test.questions[currentIdx];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (isSubmitted) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg">{test.title}</h1>
          <span className="px-2 py-0.5 bg-slate-800 rounded text-xs border border-slate-700">{test.type}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-xl">
            <Timer className="w-5 h-5 text-blue-400" />
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          <button 
            onClick={handleSubmit}
            className="bg-blue-600 px-6 py-2 rounded font-bold hover:bg-blue-700 transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-80 bg-slate-50 border-r border-slate-200 p-6 overflow-y-auto hidden md:block">
          <h2 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Question Navigator</h2>
          <div className="grid grid-cols-5 gap-2">
            {test.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`w-10 h-10 rounded border flex items-center justify-center text-sm font-medium transition-colors
                  ${currentIdx === i ? 'bg-blue-600 border-blue-600 text-white' : 
                    answers[test.questions[i].id] !== undefined ? 'bg-green-100 border-green-200 text-green-700' : 
                    'bg-white border-slate-300 text-slate-600 hover:border-blue-400'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-3 h-3 rounded bg-green-500" /> Answered
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-3 h-3 rounded bg-blue-600" /> Current
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-3 h-3 rounded bg-white border border-slate-300" /> Not Visited
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-white p-12 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-slate-400 font-bold">QUESTION {currentIdx + 1} OF {test.questions.length}</span>
              <button className="flex items-center gap-1 text-slate-400 hover:text-yellow-600 transition-colors text-sm font-medium">
                <Flag className="w-4 h-4" /> Mark for Review
              </button>
            </div>

            <h2 className="text-2xl font-semibold text-slate-800 mb-8 leading-relaxed">
              {currentQ.question}
            </h2>

            <div className="space-y-4">
              {currentQ.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center justify-between group
                    ${answers[currentQ.id] === i ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-300 bg-slate-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold
                      ${answers[currentQ.id] === i ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-200 group-hover:border-slate-400'}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`font-medium ${answers[currentQ.id] === i ? 'text-blue-900' : 'text-slate-700'}`}>{option}</span>
                  </div>
                  {answers[currentQ.id] === i && <CheckCircle className="w-6 h-6 text-blue-600" />}
                </button>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="flex items-center gap-2 px-6 py-2 rounded-lg border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => currentIdx === test.questions.length - 1 ? handleSubmit() : setCurrentIdx(prev => prev + 1)}
                className="flex items-center gap-2 px-8 py-2 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900 transition-colors"
              >
                {currentIdx === test.questions.length - 1 ? 'Finish Exam' : 'Next Question'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TestPlayer;
import { TestType } from '../types';
