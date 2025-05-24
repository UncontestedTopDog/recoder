import React, { useState } from 'react';
import { format } from 'date-fns';
import { WeightRecord } from '../types';

interface WeightFormProps {
  onSubmit: (record: Omit<WeightRecord, 'id'>) => void;
  onCancel: () => void;
}

const WeightForm: React.FC<WeightFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: '',
    bodyFat: '',
    muscle: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weight) {
      alert('请填写体重');
      return;
    }

    onSubmit({
      date: formData.date,
      weight: parseFloat(formData.weight),
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
      muscle: formData.muscle ? parseFloat(formData.muscle) : undefined,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">记录体重</h2>
        
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              体重 (公斤) *
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="65.5"
              min="20"
              max="200"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                体脂率 (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.bodyFat}
                onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="15.5"
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                肌肉量 (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.muscle}
                onChange={(e) => setFormData({ ...formData, muscle: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="35.0"
                min="10"
                max="60"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">💡 测量建议</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 建议每天同一时间测量（如早晨起床后、如厕后）</li>
              <li>• 穿轻便衣物或不穿衣物测量</li>
              <li>• 保持体秤放置在硬质、平坦的地面上</li>
              <li>• 体脂率和肌肉量需要专用体脂秤才能测量</li>
            </ul>
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

export default WeightForm; 