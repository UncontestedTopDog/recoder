# Appwrite 配置指南

本项目已集成 Appwrite 作为后端服务，支持用户认证和云端数据存储。请按照以下步骤完成配置：

## 1. 创建 Appwrite 项目

### 选项A：使用 Appwrite Cloud（推荐）
1. 访问 [Appwrite Cloud](https://cloud.appwrite.io/)
2. 注册账户并创建新项目
3. 记录项目ID

### 选项B：自托管 Appwrite
1. 按照 [Appwrite 安装指南](https://appwrite.io/docs/installation) 部署 Appwrite
2. 创建新项目
3. 记录服务器端点和项目ID

## 2. 配置项目设置

编辑 `src/lib/appwrite.ts` 文件，更新以下配置：

```typescript
export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1', // 或您的自托管端点
  projectId: 'YOUR_PROJECT_ID', // 替换为您的项目ID
  databaseId: 'health-records-db',
  collections: {
    exerciseRecords: 'exercise-records',
    foodRecords: 'food-records', 
    sleepRecords: 'sleep-records',
    weightRecords: 'weight-records',
  }
};
```

## 3. 创建数据库和集合

在 Appwrite 控制台中：

### 3.1 创建数据库
1. 进入 Databases 页面
2. 点击 "Create Database"
3. 名称设置为：`health-records-db`
4. Database ID 设置为：`health-records-db`

### 3.2 创建集合

为每种记录类型创建集合：

#### 运动记录集合 (exercise-records)
- Collection ID: `exercise-records`
- 权限：
  - Create: `users`
  - Read: `users`
  - Update: `users`
  - Delete: `users`

属性：
```
- userId (String, Required) - 用户ID
- date (String, Required) - 日期
- type (String, Required) - 运动类型
- duration (Integer, Required) - 时长（分钟）
- calories (Integer, Required) - 消耗卡路里
- notes (String, Optional) - 备注
```

#### 饮食记录集合 (food-records)
- Collection ID: `food-records`
- 相同权限设置

属性：
```
- userId (String, Required) - 用户ID
- date (String, Required) - 日期  
- meal (String, Required) - 餐次
- name (String, Required) - 食物名称
- calories (Integer, Required) - 卡路里
- weight (Integer, Optional) - 重量（克）
- notes (String, Optional) - 备注
```

#### 睡眠记录集合 (sleep-records)
- Collection ID: `sleep-records`
- 相同权限设置

属性：
```
- userId (String, Required) - 用户ID
- date (String, Required) - 日期
- bedtime (String, Required) - 入睡时间
- wakeTime (String, Required) - 起床时间
- duration (Float, Required) - 睡眠时长（小时）
- quality (Integer, Required) - 质量评分（1-5）
- notes (String, Optional) - 备注
```

#### 体重记录集合 (weight-records)
- Collection ID: `weight-records`
- 相同权限设置

属性：
```
- userId (String, Required) - 用户ID
- date (String, Required) - 日期
- weight (Float, Required) - 体重（公斤）
- bodyFat (Float, Optional) - 体脂率
- muscle (Float, Optional) - 肌肉量
```

## 4. 设置用户认证

在 Appwrite 控制台的 Auth 设置中：

1. 启用 Email/Password 认证
2. 设置密码要求（建议最少8位）
3. 配置 OAuth 提供商（可选）

## 5. 配置域名

在项目设置中添加允许的域名：
- 开发环境：`http://localhost:3000`
- 生产环境：您的域名

## 6. 启动应用

配置完成后，启动应用：

```bash
npm run dev
```

## 功能特性

✅ **用户认证**
- 邮箱密码注册/登录
- 自动维持登录状态
- 安全登出

✅ **云端数据同步**
- 所有健康数据自动同步到云端
- 多设备间无缝访问
- 实时数据更新

✅ **数据安全**
- 用户数据隔离
- 权限控制
- 安全的API访问

## 故障排除

### 常见问题

1. **连接错误**
   - 检查网络连接
   - 确认端点URL正确
   - 验证项目ID

2. **权限错误**
   - 确认集合权限设置正确
   - 检查用户认证状态

3. **数据库错误**
   - 确认数据库和集合ID匹配
   - 检查属性定义

### 调试技巧

1. 打开浏览器开发者工具查看网络请求
2. 检查控制台错误信息
3. 在 Appwrite 控制台查看日志

## 支持

如需帮助，请参考：
- [Appwrite 官方文档](https://appwrite.io/docs)
- [Appwrite Discord 社区](https://discord.gg/appwrite)
- [项目 GitHub Issues](https://github.com/your-repo/issues) 