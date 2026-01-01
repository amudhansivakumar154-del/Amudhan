
import React, { useState } from 'react';
import { UserRole, User, Test, TestResult, Question } from './types';
import { MOCK_USERS, SAMPLE_QUESTIONS } from './constants';
import Dashboard from './components/Dashboard';
import TestGenerator from './components/TestGenerator';
import TestPlayer from './components/TestPlayer';
import Analytics from './components/Analytics';
import { LayoutDashboard, BookOpen, ClipboardList, BarChart3, Users, LogOut, Settings, Bell, Search } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [activeTest, setActiveTest] = useState<Test | null>(null);

  const handleCreateTest = (newTest: Test) => {
    setTests([newTest, ...tests]);
    setCurrentView('tests');
  };

  const handleFinishTest = (result: TestResult) => {
    setResults([result, ...results]);
    setActiveTest(null);
    setCurrentView('analytics');
  };

  const startTest = (test: Test) => {
    setActiveTest(test);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tests', label: 'Assessments', icon: ClipboardList },
    ...(currentUser.role !== UserRole.STUDENT ? [
      { id: 'generator', label: 'Generator', icon: Settings },
      { id: 'questions', label: 'Question Bank', icon: BookOpen },
      { id: 'users', label: 'Community', icon: Users },
    ] : [
      { id: 'analytics', label: 'Insights', icon: BarChart3 },
    ]),
  ];

  const renderContent = () => {
    if (activeTest) {
      return <TestPlayer test={activeTest} studentId={currentUser.id} onFinish={handleFinishTest} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={currentUser} onNavigate={setCurrentView} tests={tests} results={results} />;
      case 'generator':
        return <TestGenerator onSave={handleCreateTest} />;
      case 'tests':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">All Assessments</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map(test => (
                <div key={test.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between mb-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase">{test.type}</span>
                    <span className="text-slate-400 text-xs font-medium">{test.durationMinutes} mins</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{test.title}</h3>
                  <p className="text-sm text-slate-500 mb-6">{test.questions.length} Questions • {test.totalMarks} Marks</p>
                  <button 
                    onClick={() => startTest(test)}
                    className="w-full py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900"
                  >
                    Start Exam
                  </button>
                </div>
              ))}
              {tests.length === 0 && <div className="text-slate-400">No tests available. Create one first!</div>}
            </div>
          </div>
        );
      case 'analytics':
        return <Analytics results={results} questions={SAMPLE_QUESTIONS} />;
      case 'questions':
        return <div className="p-12 text-center text-slate-500">Question Bank Manager Coming Soon.</div>;
      case 'users':
        return (
           <div className="p-6">
             <h1 className="text-2xl font-bold mb-6">Role Management</h1>
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">Role</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_USERS.map(user => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            user.role === UserRole.ADMIN ? 'bg-red-50 text-red-700' :
                            user.role === UserRole.PRINCIPAL ? 'bg-purple-50 text-purple-700' :
                            user.role === UserRole.TEACHER ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{user.email}</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 font-medium hover:underline text-sm">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
        );
      default:
        return <Dashboard user={currentUser} onNavigate={setCurrentView} tests={tests} results={results} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">EQ</div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">EduQuest AI</h1>
          </div>
          
          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-6 p-2 rounded-lg bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
               <img src={`https://picsum.photos/seed/${currentUser.id}/100/100`} alt="Avatar" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
              <select 
                value={currentUser.id}
                onChange={(e) => setCurrentUser(MOCK_USERS.find(u => u.id === e.target.value)!)}
                className="text-[10px] text-slate-500 bg-transparent outline-none cursor-pointer"
              >
                {MOCK_USERS.map(u => <option key={u.id} value={u.id}>{u.role}</option>)}
              </select>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-96">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search tests, results, or students..." className="bg-transparent border-none outline-none text-sm ml-2 w-full" />
          </div>
          <div className="flex items-center gap-4">
             <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <button className="p-2 text-slate-400 hover:text-slate-600">
                <Settings className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
