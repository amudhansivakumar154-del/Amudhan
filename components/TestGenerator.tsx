
import React, { useState } from 'react';
import { TestType, Test, QuestionSubject, Question } from '../types';
import { SAMPLE_QUESTIONS } from '../constants';
import { Sparkles, Save, Trash2, Plus } from 'lucide-react';

interface TestGeneratorProps {
  onSave: (test: Test) => void;
}

const TestGenerator: React.FC<TestGeneratorProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TestType>(TestType.SCHOOL);
  const [duration, setDuration] = useState(60);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  const handleAddQuestion = () => {
    // In a real app, this would open a modal to select from bank
    const randomQ = SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)];
    if (!selectedQuestions.find(q => q.id === randomQ.id)) {
      setSelectedQuestions([...selectedQuestions, { ...randomQ, id: Math.random().toString(36).substr(2, 9) }]);
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== id));
  };

  const handleCreateTest = () => {
    if (!title || selectedQuestions.length === 0) return;
    const newTest: Test = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      type,
      questions: selectedQuestions,
      durationMinutes: duration,
      totalMarks: selectedQuestions.length * (type === TestType.NEET ? 4 : 1),
      createdAt: new Date().toISOString(),
    };
    onSave(newTest);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Test Generator</h1>
          <p className="text-slate-500">Create customized assessments for your students.</p>
        </div>
        <button
          onClick={handleCreateTest}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" /> Save Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-4">Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Test Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Mid-term Physics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Test Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TestType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={TestType.SCHOOL}>School Exam</option>
                  <option value={TestType.NEET}>NEET Pattern</option>
                  <option value={TestType.BOARDS}>Board Exams</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h2 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Suggestion
            </h2>
            <p className="text-sm text-blue-700 mb-4">
              Based on your selection, I recommend adding more Mechanics questions to balance the test.
            </p>
            <button className="text-xs font-bold text-blue-600 hover:underline">Add Suggested Questions →</button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Questions ({selectedQuestions.length})</h2>
            <button 
              onClick={handleAddQuestion}
              className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>

          {selectedQuestions.map((q, idx) => (
            <div key={q.id} className="bg-white p-4 rounded-lg border border-slate-200 group relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Question {idx + 1} • {q.subject}</span>
                <button 
                  onClick={() => handleRemoveQuestion(q.id)}
                  className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-800 font-medium">{q.question}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {q.options.map((opt, i) => (
                  <div key={i} className={`text-sm p-2 rounded ${i === q.correctAnswer ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-slate-50 text-slate-600'}`}>
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {selectedQuestions.length === 0 && (
            <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
              <Plus className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">Start by adding questions from the bank.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestGenerator;
