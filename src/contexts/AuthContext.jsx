import React, { createContext, useContext, useState, useEffect } from 'react';

// 创建认证上下文
const AuthContext = createContext();

// 模拟用户数据
const MOCK_USERS = {
  'test@example.com': {
    id: '1',
    name: 'AI Stylist',
    email: 'test@example.com',
    avatar: null,
    provider: 'email'
  },
  'google_user': {
    id: '2',
    name: 'Google User',
    email: 'google@example.com',
    avatar: 'https://via.placeholder.com/40x40/4285f4/ffffff?text=G',
    provider: 'google'
  },
  'apple_user': {
    id: '3',
    name: 'Apple User',
    email: 'apple@example.com',
    avatar: 'https://via.placeholder.com/40x40/000000/ffffff?text=A',
    provider: 'apple'
  }
};

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 从localStorage恢复用户状态
  useEffect(() => {
    const savedUser = localStorage.getItem('ai_wardrobe_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('ai_wardrobe_user');
      }
    }
  }, []);

  // 模拟Google登录
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = MOCK_USERS.google_user;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('ai_wardrobe_user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // 模拟Apple登录
  const loginWithApple = async () => {
    setIsLoading(true);
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = MOCK_USERS.apple_user;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('ai_wardrobe_user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // 模拟邮箱密码登录
  const loginWithEmail = async (email, password) => {
    setIsLoading(true);
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单的模拟验证
      if (email === 'test@example.com' && password === 'password') {
        const userData = MOCK_USERS[email];
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('ai_wardrobe_user', JSON.stringify(userData));
        
        return { success: true, user: userData };
      } else {
        throw new Error('邮箱或密码错误');
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // 模拟邮箱注册
  const registerWithEmail = async (email, password, name) => {
    setIsLoading(true);
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 检查邮箱是否已存在
      if (MOCK_USERS[email]) {
        throw new Error('该邮箱已被注册');
      }
      
      // 创建新用户
      const userData = {
        id: Date.now().toString(),
        name: name || 'AI Stylist',
        email,
        avatar: null,
        provider: 'email'
      };
      
      // 添加到模拟数据库
      MOCK_USERS[email] = userData;
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('ai_wardrobe_user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // 退出登录
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ai_wardrobe_user');
  };

  // 检查是否需要登录
  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      return false; // 需要登录
    }
    if (callback) callback();
    return true; // 已登录，可以继续
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    loginWithGoogle,
    loginWithApple,
    loginWithEmail,
    registerWithEmail,
    logout,
    requireAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook用于使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;