export interface ExerciseRecord {
  id: string;
  date: string;
  type: string;
  duration: number; // 分钟
  calories: number;
  notes?: string;
}

export interface FoodRecord {
  id: string;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  weight?: number; // 克
  notes?: string;
}

export interface SleepRecord {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number; // 小时
  quality: 1 | 2 | 3 | 4 | 5; // 1-5分
  notes?: string;
}

export interface WeightRecord {
  id: string;
  date: string;
  weight: number; // 公斤
  bodyFat?: number; // 体脂率百分比
  muscle?: number; // 肌肉量百分比
}

export type RecordType = 'exercise' | 'food' | 'sleep' | 'weight'; 