import { databases, appwriteConfig, ID } from './appwrite';
import { Query } from 'appwrite';
import { ExerciseRecord, FoodRecord, SleepRecord, WeightRecord } from '../types';

class DatabaseService {
  // 创建文档的通用方法
  private async createDocument<T>(
    collectionId: string, 
    data: Omit<T, 'id'> & { userId: string }
  ): Promise<T> {
    try {
      const document = await databases.createDocument(
        appwriteConfig.databaseId,
        collectionId,
        ID.unique(),
        data
      );
      return { ...document, id: document.$id } as T;
    } catch (error) {
      console.error('Create document error:', error);
      throw error;
    }
  }

  // 获取文档的通用方法
  private async getDocuments<T>(
    collectionId: string,
    userId: string
  ): Promise<T[]> {
    try {
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        collectionId,
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
      );
      return result.documents.map(doc => ({ ...doc, id: doc.$id })) as T[];
    } catch (error) {
      console.error('Get documents error:', error);
      throw error;
    }
  }

  // 更新文档的通用方法
  private async updateDocument<T>(
    collectionId: string,
    documentId: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const document = await databases.updateDocument(
        appwriteConfig.databaseId,
        collectionId,
        documentId,
        data
      );
      return { ...document, id: document.$id } as T;
    } catch (error) {
      console.error('Update document error:', error);
      throw error;
    }
  }

  // 删除文档的通用方法
  private async deleteDocument(collectionId: string, documentId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        collectionId,
        documentId
      );
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  }

  // 运动记录相关方法
  async createExerciseRecord(data: Omit<ExerciseRecord, 'id'>, userId: string): Promise<ExerciseRecord> {
    return this.createDocument<ExerciseRecord>(
      appwriteConfig.collections.exerciseRecords,
      { ...data, userId }
    );
  }

  async getExerciseRecords(userId: string): Promise<ExerciseRecord[]> {
    return this.getDocuments<ExerciseRecord>(
      appwriteConfig.collections.exerciseRecords,
      userId
    );
  }

  async updateExerciseRecord(id: string, data: Partial<ExerciseRecord>): Promise<ExerciseRecord> {
    return this.updateDocument<ExerciseRecord>(
      appwriteConfig.collections.exerciseRecords,
      id,
      data
    );
  }

  async deleteExerciseRecord(id: string): Promise<void> {
    return this.deleteDocument(appwriteConfig.collections.exerciseRecords, id);
  }

  // 饮食记录相关方法
  async createFoodRecord(data: Omit<FoodRecord, 'id'>, userId: string): Promise<FoodRecord> {
    return this.createDocument<FoodRecord>(
      appwriteConfig.collections.foodRecords,
      { ...data, userId }
    );
  }

  async getFoodRecords(userId: string): Promise<FoodRecord[]> {
    return this.getDocuments<FoodRecord>(
      appwriteConfig.collections.foodRecords,
      userId
    );
  }

  async updateFoodRecord(id: string, data: Partial<FoodRecord>): Promise<FoodRecord> {
    return this.updateDocument<FoodRecord>(
      appwriteConfig.collections.foodRecords,
      id,
      data
    );
  }

  async deleteFoodRecord(id: string): Promise<void> {
    return this.deleteDocument(appwriteConfig.collections.foodRecords, id);
  }

  // 睡眠记录相关方法
  async createSleepRecord(data: Omit<SleepRecord, 'id'>, userId: string): Promise<SleepRecord> {
    return this.createDocument<SleepRecord>(
      appwriteConfig.collections.sleepRecords,
      { ...data, userId }
    );
  }

  async getSleepRecords(userId: string): Promise<SleepRecord[]> {
    return this.getDocuments<SleepRecord>(
      appwriteConfig.collections.sleepRecords,
      userId
    );
  }

  async updateSleepRecord(id: string, data: Partial<SleepRecord>): Promise<SleepRecord> {
    return this.updateDocument<SleepRecord>(
      appwriteConfig.collections.sleepRecords,
      id,
      data
    );
  }

  async deleteSleepRecord(id: string): Promise<void> {
    return this.deleteDocument(appwriteConfig.collections.sleepRecords, id);
  }

  // 体重记录相关方法
  async createWeightRecord(data: Omit<WeightRecord, 'id'>, userId: string): Promise<WeightRecord> {
    return this.createDocument<WeightRecord>(
      appwriteConfig.collections.weightRecords,
      { ...data, userId }
    );
  }

  async getWeightRecords(userId: string): Promise<WeightRecord[]> {
    return this.getDocuments<WeightRecord>(
      appwriteConfig.collections.weightRecords,
      userId
    );
  }

  async updateWeightRecord(id: string, data: Partial<WeightRecord>): Promise<WeightRecord> {
    return this.updateDocument<WeightRecord>(
      appwriteConfig.collections.weightRecords,
      id,
      data
    );
  }

  async deleteWeightRecord(id: string): Promise<void> {
    return this.deleteDocument(appwriteConfig.collections.weightRecords, id);
  }
}

export const databaseService = new DatabaseService(); 