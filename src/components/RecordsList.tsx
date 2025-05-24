import React, { useState } from 'react';
import { format } from 'date-fns';
import { ExerciseRecord, FoodRecord, SleepRecord, WeightRecord } from '../types';

interface RecordsListProps {
  exerciseRecords: ExerciseRecord[];
  foodRecords: FoodRecord[];
  sleepRecords: SleepRecord[];
  weightRecords: WeightRecord[];
}

const RecordsList: React.FC<RecordsListProps> = ({
  exerciseRecords,
  foodRecords,
  sleepRecords,
  weightRecords,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'exercise' | 'food' | 'sleep' | 'weight'>('all');

  // 合并所有记录并按日期排序
  const allRecords = [
    ...exerciseRecords.map(r => ({ ...r, type: 'exercise' as const })),
    ...foodRecords.map(r => ({ ...r, type: 'food' as const })),
    ...sleepRecords.map(r => ({ ...r, type: 'sleep' as const })),
    ...weightRecords.map(r => ({ ...r, type: 'weight' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredRecords = activeCategory === 'all' 
    ? allRecords 
    : allRecords.filter(r => r.type === activeCategory);

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'exercise': return '🏃‍♂️';
      case 'food': return '🍎';
      case 'sleep': return '😴';
      case 'weight': return '⚖️';
      default: return '📝';
    }
  };

  const getRecordTitle = (record: any) => {
    switch (record.type) {
      case 'exercise':
        return `${record.type} - ${record.duration}分钟 ${record.calories}卡路里`;
      case 'food':
        return `${record.name} - ${record.calories}卡路里`;
      case 'sleep':
        return `睡眠 ${record.duration}小时 - 质量${record.quality}/5`;
      case 'weight':
        return `体重 ${record.weight}kg${record.bodyFat ? ` - 体脂${record.bodyFat}%` : ''}`;
      default:
        return '记录';
    }
  };

  const categories = [
    { id: 'all', label: '全部', icon: '📋' },
    { id: 'exercise', label: '运动', icon: '🏃‍♂️' },
    { id: 'food', label: '饮食', icon: '🍎' },
    { id: 'sleep', label: '睡眠', icon: '😴' },
    { id: 'weight', label: '体重', icon: '⚖️' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">记录历史</h2>
        
        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* 记录列表 */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📝</div>
            <p>暂无记录</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={`${record.type}-${record.id}`} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getRecordIcon(record.type)}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {getRecordTitle(record)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(record.date), 'yyyy年MM月dd日')}
                    </p>
                    {record.notes && (
                      <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  {record.type === 'exercise' && (
                    <div className="text-sm text-gray-500">
                      <div>{(record as ExerciseRecord).type}</div>
                    </div>
                  )}
                  {record.type === 'food' && (
                    <div className="text-sm text-gray-500">
                      <div>
                        {(record as FoodRecord).meal === 'breakfast' && '早餐'}
                        {(record as FoodRecord).meal === 'lunch' && '午餐'}
                        {(record as FoodRecord).meal === 'dinner' && '晚餐'}
                        {(record as FoodRecord).meal === 'snack' && '零食'}
                      </div>
                      {(record as FoodRecord).weight && (
                        <div>{(record as FoodRecord).weight}g</div>
                      )}
                    </div>
                  )}
                  {record.type === 'sleep' && (
                    <div className="text-sm text-gray-500">
                      <div>{(record as SleepRecord).bedtime} - {(record as SleepRecord).wakeTime}</div>
                    </div>
                  )}
                  {record.type === 'weight' && (
                    <div className="text-sm text-gray-500">
                      {(record as WeightRecord).muscle && (
                        <div>肌肉量: {(record as WeightRecord).muscle}%</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 统计信息 */}
      {filteredRecords.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">统计信息</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{exerciseRecords.length}</p>
              <p className="text-sm text-gray-600">运动记录</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{foodRecords.length}</p>
              <p className="text-sm text-gray-600">饮食记录</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{sleepRecords.length}</p>
              <p className="text-sm text-gray-600">睡眠记录</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{weightRecords.length}</p>
              <p className="text-sm text-gray-600">体重记录</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordsList; 