import React, { useState } from 'react';
import { format } from 'date-fns';
import { SleepRecord } from '../types';

interface SleepFormProps {
  onSubmit: (record: Omit<SleepRecord, 'id'>) => void;
  onCancel: () => void;
}

const SleepForm: React.FC<SleepFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    bedtime: '22:00',
    wakeTime: '07:00',
    quality: 3 as 1 | 2 | 3 | 4 | 5,
    notes: '',
  });

  const calculateDuration = (bedtime: string, wakeTime: string): number => {
    const [bedHour, bedMin] = bedtime.split(':').map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    
    let bedMinutes = bedHour * 60 + bedMin;
    let wakeMinutes = wakeHour * 60 + wakeMin;
    
    // 如果唤醒时间小于睡觉时间，说明跨越了午夜
    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60;
    }
    
    return Math.round((wakeMinutes - bedMinutes) / 60 * 10) / 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const duration = calculateDuration(formData.bedtime, formData.wakeTime);
    
    onSubmit({
      date: formData.date,
      bedtime: formData.bedtime,
      wakeTime: formData.wakeTime,
      duration,
      quality: formData.quality,
      notes: formData.notes || undefined,
    });
  };

  const qualityLabels = {
    1: '很差',
    2: '较差',
    3: '一般',
    4: '良好',
    5: '很好',
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">记录睡眠</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日期 *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                入睡时间 *
              </label>
              <input
                type="time"
                value={formData.bedtime}
                onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                起床时间 *
              </label>
              <input
                type="time"
                value={formData.wakeTime}
                onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              睡眠时长: {calculateDuration(formData.bedtime, formData.wakeTime)} 小时
            </label>
            <div className="text-sm text-gray-500">
              系统会根据入睡和起床时间自动计算
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              睡眠质量 *
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, quality: rating as any })}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    formData.quality === rating
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {rating === 1 && '😫'}
                    {rating === 2 && '😴'}
                    {rating === 3 && '😊'}
                    {rating === 4 && '😄'}
                    {rating === 5 && '🤩'}
                  </div>
                  <div className="text-xs">{qualityLabels[rating as keyof typeof qualityLabels]}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              备注
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="记录睡眠环境、梦境、感受等..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              保存记录
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SleepForm; 