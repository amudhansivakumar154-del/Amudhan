
import React from 'react';
import { UserRole, User, Test, TestResult } from '../types';
import { LayoutDashboard, BookOpen, ClipboardList, BarChart3, Users, PlusCircle } from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (view: string) => void;
  tests: Test[];
  results: TestResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, tests, results }) => {
  const getStats = () => {
    switch (user.role) {
      case UserRole.ADMIN:
      case UserRole.PRINCIPAL:
        return [
          { label: 'Total Students', value: '1,240', icon: Users, color: 'text-blue-600' },
          { label: 'Active Teachers', value: '45', icon: UserRole.TEACHER, iconComponent: Users, color: 'text-green-600' },
          { label: 'Tests Conducted', value: tests.length.toString(), icon: ClipboardList, color: 'text-purple-600' },
          { label: 'Avg Performance', value: '72%', icon: BarChart3, color: 'text-orange-600' },
        ];
      case UserRole.TEACHER:
        return [
          { label: 'My Classes', value: '4', icon: Users, color: 'text-blue-600' },
          { label: 'Tests Created', value: tests.length.toString(), icon: PlusCircle, color: 'text-green-600' },
          { label: 'Pending Evaluations', value: '12', icon: ClipboardList, color: 'text-red-600' },
          { label: 'Class Average', value: '68%', icon: BarChart3, color: 'text-purple-600' },
        ];
      case UserRole.STUDENT:
        return [
          { label: 'Tests Taken', value: results.length.toString(), icon: ClipboardList, color: 'text-blue-600' },
          { label: 'Global Rank', value: '#42', icon: BarChart3, color: 'text-green-600' },
          { label: 'Avg Score', value: results.length ? `${Math.round(results.reduce((a, b) => a + (b.score/b.maxScore*100), 0) / results.length)}%` : '0%', icon: BookOpen, color: 'text-purple-600' },
          { label: 'Goal Progress', value: '85%', icon: PlusCircle, color: 'text-orange-600' },
        ];
    }
  };

  const stats = getStats();

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user.name}</h1>
        <p className="text-slate-500">Here's what's happening in your {user.role.toLowerCase()} dashboard.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-opacity-10 ${stat.color.replace('text', 'bg')}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              {user.role === UserRole.STUDENT ? 'Recent Test Results' : 'Recent Active Tests'}
            </h2>
            <button onClick={() => onNavigate(user.role === UserRole.STUDENT ? 'analytics' : 'tests')} className="text-blue-600 text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {(user.role === UserRole.STUDENT ? results : tests).slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-white flex items-center justify-center border border-slate-200">
                    <ClipboardList className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      {'title' in item ? item.title : `Result for Test #${item.testId.slice(0, 5)}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {'type' in item ? item.type : `Scored ${item.score}/${item.maxScore}`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate(user.role === UserRole.STUDENT ? 'analytics' : 'tests')}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
            {((user.role === UserRole.STUDENT ? results : tests).length === 0) && (
              <div className="text-center py-8 text-slate-400">No data available yet.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            {user.role === UserRole.STUDENT ? (
              <>
                <button onClick={() => onNavigate('tests')} className="w-full p-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Take a Practice Test
                </button>
                <button onClick={() => onNavigate('analytics')} className="w-full p-4 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" /> Analyze My Performance
                </button>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('generator')} className="w-full p-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" /> Generate New Test
                </button>
                <button onClick={() => onNavigate('questions')} className="w-full p-4 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Manage Question Bank
                </button>
                <button onClick={() => onNavigate('users')} className="w-full p-4 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Users className="w-5 h-5" /> Manage Users
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
