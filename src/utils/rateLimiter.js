// 请求频率限制器
// 临时前端安全措施，防止API滥用

class RateLimiter {
  constructor(maxRequests = 5, windowMs = 60000) { // 默认每分钟最多5次请求
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  // 检查是否可以发起请求
  canMakeRequest() {
    const now = Date.now();
    
    // 清理过期的请求记录
    this.requests = this.requests.filter(timestamp => 
      now - timestamp < this.windowMs
    );
    
    // 检查是否超过限制
    if (this.requests.length >= this.maxRequests) {
      return {
        allowed: false,
        remainingTime: this.windowMs - (now - this.requests[0]),
        message: `请求过于频繁，请等待 ${Math.ceil((this.windowMs - (now - this.requests[0])) / 1000)} 秒后重试`
      };
    }
    
    return {
      allowed: true,
      remaining: this.maxRequests - this.requests.length - 1
    };
  }
  
  // 记录一次请求
  recordRequest() {
    this.requests.push(Date.now());
  }
  
  // 获取剩余请求次数
  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(timestamp => 
      now - timestamp < this.windowMs
    );
    return Math.max(0, this.maxRequests - this.requests.length);
  }
  
  // 获取下次可请求时间
  getNextAvailableTime() {
    if (this.requests.length === 0) return 0;
    const now = Date.now();
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, this.windowMs - (now - oldestRequest));
  }
}

// 创建全局实例
export const apiRateLimiter = new RateLimiter(3, 120000); // 每2分钟最多3次请求

// 导出类以便测试或创建其他实例
export { RateLimiter };