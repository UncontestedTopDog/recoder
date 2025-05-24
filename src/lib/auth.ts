import { account, ID } from './appwrite';
import { Models } from 'appwrite';

export interface AuthUser extends Models.User<Models.Preferences> {}

class AuthService {
  // 获取当前用户
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      return await account.get();
    } catch (error) {
      console.log('No active session');
      return null;
    }
  }

  // 注册新用户
  async register(email: string, password: string, name: string): Promise<AuthUser> {
    try {
      const userId = ID.unique();
      const user = await account.create(userId, email, password, name);
      
      // 注册后自动登录
      await this.login(email, password);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // 用户登录
  async login(email: string, password: string): Promise<Models.Session> {
    try {
      return await account.createSession(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // 用户登出
  async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // 发送邮箱验证
  async sendEmailVerification(): Promise<void> {
    try {
      await account.createVerification('http://localhost:3000/verify');
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // 重置密码
  async resetPassword(email: string): Promise<void> {
    try {
      await account.createRecovery(email, 'http://localhost:3000/reset-password');
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService(); 