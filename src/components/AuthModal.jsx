import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { 
    loginWithGoogle, 
    loginWithApple, 
    loginWithEmail, 
    registerWithEmail, 
    isLoading 
  } = useAuth();

  // 重置表单
  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
    setErrors({});
  };

  // 切换模式
  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 验证表单
  const validateForm = () => {
    const newErrors = {};

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    }

    // 注册模式下的额外验证
    if (mode === 'register') {
      if (!formData.name) {
        newErrors.name = '请输入姓名';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '请确认密码';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '两次输入的密码不一致';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理Google登录
  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        onClose();
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: '登录失败，请重试' });
    }
  };

  // 处理Apple登录
  const handleAppleLogin = async () => {
    try {
      const result = await loginWithApple();
      if (result.success) {
        onClose();
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: '登录失败，请重试' });
    }
  };

  // 处理邮箱登录/注册
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let result;
      if (mode === 'login') {
        result = await loginWithEmail(formData.email, formData.password);
      } else {
        result = await registerWithEmail(formData.email, formData.password, formData.name);
      }

      if (result.success) {
        onClose();
        resetForm();
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: mode === 'login' ? '登录失败，请重试' : '注册失败，请重试' });
    }
  };

  // 关闭模态框
  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* 关闭按钮 */}
        <button className="auth-modal-close" onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* 标题 */}
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            {mode === 'login' ? '欢迎回来' : '加入我们'}
          </h2>
          <p className="auth-modal-subtitle">
            {mode === 'login' ? '登录您的账户以继续' : '创建账户开始您的时尚之旅'}
          </p>
        </div>

        {/* 社交登录按钮 */}
        <div className="auth-social-buttons">
          <button 
            className="auth-social-button google" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <div className="social-icon google-icon">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span>Continue with Google</span>
          </button>

          <button 
            className="auth-social-button apple" 
            onClick={handleAppleLogin}
            disabled={isLoading}
          >
            <div className="social-icon apple-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* 分隔线 */}
        <div className="auth-divider">
          <span>或</span>
        </div>

        {/* 邮箱登录表单 */}
        <form className="auth-form" onSubmit={handleEmailSubmit}>
          {mode === 'register' && (
            <div className="auth-input-group">
              <input
                type="text"
                name="name"
                placeholder="姓名"
                value={formData.name}
                onChange={handleInputChange}
                className={`auth-input ${errors.name ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.name && <span className="auth-error">{errors.name}</span>}
            </div>
          )}

          <div className="auth-input-group">
            <input
              type="email"
              name="email"
              placeholder="电子邮箱"
              value={formData.email}
              onChange={handleInputChange}
              className={`auth-input ${errors.email ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.email && <span className="auth-error">{errors.email}</span>}
          </div>

          <div className="auth-input-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="密码"
                value={formData.password}
                onChange={handleInputChange}
                className={`auth-input ${errors.password ? 'error' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="auth-error">{errors.password}</span>}
          </div>

          {mode === 'register' && (
            <div className="auth-input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="确认密码"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}
            </div>
          )}

          {errors.general && (
            <div className="auth-error general-error">{errors.general}</div>
          )}

          <button 
            type="submit" 
            className="auth-submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              mode === 'login' ? '登录' : '注册'
            )}
          </button>
        </form>

        {/* 切换模式 */}
        <div className="auth-toggle">
          <span>
            {mode === 'login' ? '没有账户？' : '已有账户？'}
            <button 
              type="button" 
              className="auth-toggle-button" 
              onClick={toggleMode}
              disabled={isLoading}
            >
              {mode === 'login' ? '立即注册' : '登录'}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;