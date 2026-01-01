
import React, { useState, useEffect } from 'react';
import { TestResult, Question } from '../types';
import { getAIImprovementPlan } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';

interface AnalyticsProps {
  results: TestResult[];
  questions: Question[];
}

const Analytics: React.FC<AnalyticsProps> = ({ results, questions }) => {
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (results.length > 0) {
      handleGetAIInsights(results[0]);
    }
  }, [results]);

  const handleGetAIInsights = async (result: TestResult) => {
    setLoadingAI(true);
    const insight = await getAIImprovementPlan(result, questions);
    setAiInsight(insight);
    setLoadingAI(false);
  };

  if (results.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400">
        Take a test first to see your performance analytics.
      </div>
    );
  }

  const latestResult = results[0];
  const chartData = Object.entries(latestResult.subjectBreakdown).map(([name, value]) => ({
    name,
    score: value,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Performance Analytics</h1>
          <p className="text-slate-500">In-depth analysis of your recent academic progress.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium text-slate-500">Showing data for: </span>
           <select className="bg-white border border-slate-200 rounded-md px-3 py-1 text-sm outline-none">
             {results.map(r => <option key={r.id}>Test on {new Date(r.timestamp).toLocaleDateString()}</option>)}
           </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500 font-medium mb-1">Total Score</p>
                <p className="text-3xl font-bold text-slate-800">{latestResult.score} / {latestResult.maxScore}</p>
                <div className="mt-2 text-xs font-bold text-green-600 flex items-center gap-1">
                   <TrendingUp className="w-3 h-3" /> +5% vs average
                </div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500 font-medium mb-1">Accuracy</p>
                <p className="text-3xl font-bold text-slate-800">{Math.round((latestResult.score / latestResult.maxScore) * 100)}%</p>
                <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-blue-600 h-full" style={{ width: `${(latestResult.score / latestResult.maxScore) * 100}%` }}></div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500 font-medium mb-1">Percentile</p>
                <p className="text-3xl font-bold text-slate-800">84th</p>
                <div className="mt-2 text-xs font-bold text-blue-600">Top 15% of candidates</div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="font-semibold text-slate-800 mb-6">Subject Proficiency</h3>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-lg">AI Personal Tutor</h3>
              </div>
              
              {loadingAI ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 text-sm">Analyzing your performance patterns...</p>
                </div>
              ) : aiInsight ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-purple-400 text-xs font-bold uppercase mb-2">Overall Assessment</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{aiInsight.overallAssessment}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-purple-400 text-xs font-bold uppercase mb-2">Focus Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiInsight.focusTopics.map((topic: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-slate-200 border border-white/10 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-orange-400" /> {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-purple-400 text-xs font-bold uppercase mb-2">Suggested 7-Day Schedule</h4>
                    <div className="space-y-3">
                      {aiInsight.studySchedule.slice(0, 3).map((item: any, i: number) => (
                        <div key={i} className="flex gap-3 text-sm">
                          <div className="w-10 text-slate-500 font-mono shrink-0">{item.day}</div>
                          <div className="text-slate-300">{item.task}</div>
                        </div>
                      ))}
                      <button className="w-full text-center py-2 bg-white/5 rounded hover:bg-white/10 transition-colors text-xs font-bold text-slate-400">
                        View Full Schedule
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <button 
                    onClick={() => handleGetAIInsights(latestResult)}
                    className="px-6 py-2 bg-purple-600 rounded-lg font-bold hover:bg-purple-700 transition-colors"
                  >
                    Generate Study Plan
                  </button>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -mr-16 -mt-16 rounded-full"></div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" /> Upcoming Goals
             </h3>
             <div className="space-y-4">
                {[
                  { label: 'Master Organic Chemistry', progress: 45 },
                  { label: 'Solve 10 Physics Numericals', progress: 100 },
                  { label: 'Review Genetics Notes', progress: 12 },
                ].map((goal, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-600">{goal.label}</span>
                         <span className="font-bold text-slate-800">{goal.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className={`h-full ${goal.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${goal.progress}%` }}></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
