import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subDays, isWithinInterval } from 'date-fns';
import { ExerciseRecord, FoodRecord, SleepRecord, WeightRecord } from '../types';

interface DashboardProps {
  exerciseRecords: ExerciseRecord[];
  foodRecords: FoodRecord[];
  sleepRecords: SleepRecord[];
  weightRecords: WeightRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({
  exerciseRecords,
  foodRecords,
  sleepRecords,
  weightRecords,
}) => {
  // 获取最近7天的数据
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'yyyy-MM-dd');
  });

  // 计算每日卡路里数据
  const dailyCaloriesData = last7Days.map(date => {
    const exerciseForDay = exerciseRecords.filter(r => r.date === date);
    const foodForDay = foodRecords.filter(r => r.date === date);
    
    const caloriesBurned = exerciseForDay.reduce((sum, r) => sum + r.calories, 0);
    const caloriesConsumed = foodForDay.reduce((sum, r) => sum + r.calories, 0);
    
    return {
      date: format(new Date(date), 'MM/dd'),
      consumed: caloriesConsumed,
      burned: caloriesBurned,
      net: caloriesConsumed - caloriesBurned,
    };
  });

  // 计算体重趋势数据
  const weightTrendData = weightRecords
    .slice(-14) // 最近14条记录
    .map(record => ({
      date: format(new Date(record.date), 'MM/dd'),
      weight: record.weight,
      bodyFat: record.bodyFat || 0,
    }));

  // 统计数据
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayExercise = exerciseRecords.filter(r => r.date === today);
  const todayFood = foodRecords.filter(r => r.date === today);
  const todaySleep = sleepRecords.find(r => r.date === today);
  const latestWeight = weightRecords[weightRecords.length - 1];

  const todayStats = {
    exerciseMinutes: todayExercise.reduce((sum, r) => sum + r.duration, 0),
    caloriesBurned: todayExercise.reduce((sum, r) => sum + r.calories, 0),
    caloriesConsumed: todayFood.reduce((sum, r) => sum + r.calories, 0),
    sleepHours: todaySleep?.duration || 0,
    sleepQuality: todaySleep?.quality || 0,
  };

  return (
    <div className="space-y-6">
      {/* 今日概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">今日运动</p>
              <p className="text-2xl font-bold text-blue-600">{todayStats.exerciseMinutes}分钟</p>
            </div>
            <div className="text-3xl">🏃‍♂️</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">消耗 {todayStats.caloriesBurned} 卡路里</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">今日饮食</p>
              <p className="text-2xl font-bold text-green-600">{todayStats.caloriesConsumed}</p>
            </div>
            <div className="text-3xl">🍎</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">卡路里摄入</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">昨晚睡眠</p>
              <p className="text-2xl font-bold text-purple-600">{todayStats.sleepHours}小时</p>
            </div>
            <div className="text-3xl">😴</div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-xs text-gray-500 mr-2">质量:</span>
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < todayStats.sleepQuality ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">当前体重</p>
              <p className="text-2xl font-bold text-red-600">
                {latestWeight ? `${latestWeight.weight}kg` : '--'}
              </p>
            </div>
            <div className="text-3xl">⚖️</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {latestWeight?.bodyFat ? `体脂率: ${latestWeight.bodyFat}%` : '暂无体脂数据'}
          </p>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 卡路里趋势 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">最近7天卡路里趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyCaloriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  value,
                  name === 'consumed' ? '摄入' : name === 'burned' ? '消耗' : '净值'
                ]}
              />
              <Bar dataKey="consumed" fill="#10b981" name="consumed" />
              <Bar dataKey="burned" fill="#f59e0b" name="burned" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 体重趋势 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">体重变化趋势</h3>
          {weightTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number, name: string) => [
                  `${value}${name === 'weight' ? 'kg' : '%'}`,
                  name === 'weight' ? '体重' : '体脂率'
                ]} />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="weight"
                />
                {weightTrendData.some(d => d.bodyFat > 0) && (
                  <Line 
                    type="monotone" 
                    dataKey="bodyFat" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="bodyFat"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              暂无体重数据
            </div>
          )}
        </div>
      </div>

      {/* 本周总结 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">本周总结</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {exerciseRecords
                .filter(r => {
                  const recordDate = new Date(r.date);
                  const weekStart = subDays(new Date(), 7);
                  return isWithinInterval(recordDate, { start: weekStart, end: new Date() });
                })
                .reduce((sum, r) => sum + r.duration, 0)}
            </p>
            <p className="text-sm text-gray-600">分钟运动</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {foodRecords
                .filter(r => {
                  const recordDate = new Date(r.date);
                  const weekStart = subDays(new Date(), 7);
                  return isWithinInterval(recordDate, { start: weekStart, end: new Date() });
                })
                .reduce((sum, r) => sum + r.calories, 0)}
            </p>
            <p className="text-sm text-gray-600">卡路里摄入</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {(sleepRecords
                .filter(r => {
                  const recordDate = new Date(r.date);
                  const weekStart = subDays(new Date(), 7);
                  return isWithinInterval(recordDate, { start: weekStart, end: new Date() });
                })
                .reduce((sum, r) => sum + r.duration, 0) / 
                sleepRecords.filter(r => {
                  const recordDate = new Date(r.date);
                  const weekStart = subDays(new Date(), 7);
                  return isWithinInterval(recordDate, { start: weekStart, end: new Date() });
                }).length || 0).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">平均睡眠小时</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 