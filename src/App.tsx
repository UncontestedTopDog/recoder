import React, { useState } from 'react';
import { Activity, Utensils, Moon, Scale, BarChart3, Plus, LogOut, User, Cloud } from 'lucide-react';
import { ExerciseRecord, FoodRecord, SleepRecord, WeightRecord } from './types';
import { useAuth } from './contexts/AuthContext';
import { useAppwriteData } from './hooks/useAppwriteData';
import Dashboard from './components/Dashboard';
import ExerciseForm from './components/ExerciseForm';
import FoodForm from './components/FoodForm';
import SleepForm from './components/SleepForm';
import WeightForm from './components/WeightForm';
import RecordsList from './components/RecordsList';
import AuthModal from './components/AuthModal';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exercise' | 'food' | 'sleep' | 'weight' | 'records'>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, logout, loading: authLoading } = useAuth();
  const {
    exerciseRecords,
    foodRecords,
    sleepRecords,
    weightRecords,
    loading: dataLoading,
    addExerciseRecord,
    addFoodRecord,
    addSleepRecord,
    addWeightRecord,
  } = useAppwriteData();

  const handleAddExercise = async (record: Omit<ExerciseRecord, 'id'>) => {
    try {
      await addExerciseRecord(record);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding exercise record:', error);
      alert('添加运动记录失败，请重试');
    }
  };

  const handleAddFood = async (record: Omit<FoodRecord, 'id'>) => {
    try {
      await addFoodRecord(record);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding food record:', error);
      alert('添加饮食记录失败，请重试');
    }
  };

  const handleAddSleep = async (record: Omit<SleepRecord, 'id'>) => {
    try {
      await addSleepRecord(record);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding sleep record:', error);
      alert('添加睡眠记录失败，请重试');
    }
  };

  const handleAddWeight = async (record: Omit<WeightRecord, 'id'>) => {
    try {
      await addWeightRecord(record);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding weight record:', error);
      alert('添加体重记录失败，请重试');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setActiveTab('dashboard');
      setShowForm(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: '仪表盘', icon: BarChart3 },
    { id: 'exercise', label: '运动', icon: Activity },
    { id: 'food', label: '饮食', icon: Utensils },
    { id: 'sleep', label: '睡眠', icon: Moon },
    { id: 'weight', label: '体重', icon: Scale },
  ];

  // 如果还在检查认证状态，显示加载
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 如果用户未登录，显示登录提示
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">健康管理记录</h1>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <User size={20} />
              登录/注册
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">📊</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              欢迎使用健康管理记录
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              记录您的运动、饮食、睡眠和体重数据，通过数据可视化了解健康趋势，实现更好的健康管理。
              现在支持云端同步，您的数据在多设备间无缝同步。
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg flex items-center gap-2 mx-auto"
            >
              <Cloud size={24} />
              开始使用
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">🏃‍♂️</div>
                <h3 className="font-semibold text-gray-900">运动记录</h3>
                <p className="text-gray-600 text-sm mt-2">记录运动类型、时长和消耗卡路里</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">🍎</div>
                <h3 className="font-semibold text-gray-900">饮食管理</h3>
                <p className="text-gray-600 text-sm mt-2">追踪每日饮食和卡路里摄入</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">😴</div>
                <h3 className="font-semibold text-gray-900">睡眠跟踪</h3>
                <p className="text-gray-600 text-sm mt-2">监控睡眠时长和质量</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">⚖️</div>
                <h3 className="font-semibold text-gray-900">体重监控</h3>
                <p className="text-gray-600 text-sm mt-2">记录体重变化和体脂率</p>
              </div>
            </div>
          </div>
        </main>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  const renderContent = () => {
    if (dataLoading && !exerciseRecords.length && !foodRecords.length) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载您的健康数据...</p>
        </div>
      );
    }

    if (showForm) {
      switch (activeTab) {
        case 'exercise':
          return <ExerciseForm onSubmit={handleAddExercise} onCancel={() => setShowForm(false)} />;
        case 'food':
          return <FoodForm onSubmit={handleAddFood} onCancel={() => setShowForm(false)} />;
        case 'sleep':
          return <SleepForm onSubmit={handleAddSleep} onCancel={() => setShowForm(false)} />;
        case 'weight':
          return <WeightForm onSubmit={handleAddWeight} onCancel={() => setShowForm(false)} />;
        default:
          return null;
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            exerciseRecords={exerciseRecords}
            foodRecords={foodRecords}
            sleepRecords={sleepRecords}
            weightRecords={weightRecords}
          />
        );
      case 'records':
        return (
          <RecordsList
            exerciseRecords={exerciseRecords}
            foodRecords={foodRecords}
            sleepRecords={sleepRecords}
            weightRecords={weightRecords}
          />
        );
      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === 'exercise' && '🏃‍♂️'}
              {activeTab === 'food' && '🍎'}
              {activeTab === 'sleep' && '😴'}
              {activeTab === 'weight' && '⚖️'}
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {activeTab === 'exercise' && '记录运动'}
              {activeTab === 'food' && '记录饮食'}
              {activeTab === 'sleep' && '记录睡眠'}
              {activeTab === 'weight' && '记录体重'}
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus size={20} />
              添加记录
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">健康管理记录</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Cloud size={16} />
              <span>已同步到云端</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={16} />
              <span>{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <LogOut size={16} />
              <span>登出</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setShowForm(false);
                  }}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => {
                setActiveTab('records');
                setShowForm(false);
              }}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 记录列表
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App; 