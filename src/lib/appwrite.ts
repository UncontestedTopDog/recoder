import { Client, Account, Databases, ID } from 'appwrite';

// Appwrite配置 - 请在Appwrite控制台创建项目后替换这些值
export const appwriteConfig = {
  endpoint: 'https://fra.cloud.appwrite.io/v1', // Appwrite Cloud端点
  projectId: '20250524112500', // 替换为您的项目ID
  databaseId: 'health-records-db', // 数据库ID
  collections: {
    exerciseRecords: 'exercise-records',
    foodRecords: 'food-records', 
    sleepRecords: 'sleep-records',
    weightRecords: 'weight-records',
  }
};

// 创建Appwrite客户端
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// 导出服务
export const account = new Account(client);
export const databases = new Databases(client);

export { ID }; 