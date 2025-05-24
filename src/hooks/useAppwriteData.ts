import { useState, useEffect } from 'react';
import { databaseService } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';
import { ExerciseRecord, FoodRecord, SleepRecord, WeightRecord } from '../types';

export function useAppwriteData() {
  const { user } = useAuth();
  
  const [exerciseRecords, setExerciseRecords] = useState<ExerciseRecord[]>([]);
  const [foodRecords, setFoodRecords] = useState<FoodRecord[]>([]);
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // 加载所有数据
  const loadAllData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [exercise, food, sleep, weight] = await Promise.all([
        databaseService.getExerciseRecords(user.$id),
        databaseService.getFoodRecords(user.$id),
        databaseService.getSleepRecords(user.$id),
        databaseService.getWeightRecords(user.$id),
      ]);

      setExerciseRecords(exercise);
      setFoodRecords(food);
      setSleepRecords(sleep);
      setWeightRecords(weight);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 用户变化时重新加载数据
  useEffect(() => {
    if (user) {
      loadAllData();
    } else {
      // 用户登出时清空数据
      setExerciseRecords([]);
      setFoodRecords([]);
      setSleepRecords([]);
      setWeightRecords([]);
    }
  }, [user]);

  // 添加运动记录
  const addExerciseRecord = async (record: Omit<ExerciseRecord, 'id'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newRecord = await databaseService.createExerciseRecord(record, user.$id);
      setExerciseRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (error) {
      console.error('Error adding exercise record:', error);
      throw error;
    }
  };

  // 添加饮食记录
  const addFoodRecord = async (record: Omit<FoodRecord, 'id'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newRecord = await databaseService.createFoodRecord(record, user.$id);
      setFoodRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (error) {
      console.error('Error adding food record:', error);
      throw error;
    }
  };

  // 添加睡眠记录
  const addSleepRecord = async (record: Omit<SleepRecord, 'id'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newRecord = await databaseService.createSleepRecord(record, user.$id);
      setSleepRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (error) {
      console.error('Error adding sleep record:', error);
      throw error;
    }
  };

  // 添加体重记录
  const addWeightRecord = async (record: Omit<WeightRecord, 'id'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newRecord = await databaseService.createWeightRecord(record, user.$id);
      setWeightRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (error) {
      console.error('Error adding weight record:', error);
      throw error;
    }
  };

  // 删除记录的方法
  const deleteExerciseRecord = async (id: string) => {
    try {
      await databaseService.deleteExerciseRecord(id);
      setExerciseRecords(prev => prev.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting exercise record:', error);
      throw error;
    }
  };

  const deleteFoodRecord = async (id: string) => {
    try {
      await databaseService.deleteFoodRecord(id);
      setFoodRecords(prev => prev.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting food record:', error);
      throw error;
    }
  };

  const deleteSleepRecord = async (id: string) => {
    try {
      await databaseService.deleteSleepRecord(id);
      setSleepRecords(prev => prev.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting sleep record:', error);
      throw error;
    }
  };

  const deleteWeightRecord = async (id: string) => {
    try {
      await databaseService.deleteWeightRecord(id);
      setWeightRecords(prev => prev.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting weight record:', error);
      throw error;
    }
  };

  return {
    // 数据
    exerciseRecords,
    foodRecords,
    sleepRecords,
    weightRecords,
    loading,
    
    // 添加方法
    addExerciseRecord,
    addFoodRecord,
    addSleepRecord,
    addWeightRecord,
    
    // 删除方法
    deleteExerciseRecord,
    deleteFoodRecord,
    deleteSleepRecord,
    deleteWeightRecord,
    
    // 重新加载
    refetch: loadAllData,
  };
} 