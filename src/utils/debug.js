export const debug = {
  enabled: true, // 可以通过这个开关控制是否显示调试信息
  
  log(...args) {
    if (this.enabled) {
      console.log('[Debug]', new Date().toLocaleTimeString(), ...args)
    }
  },
  
  error(...args) {
    if (this.enabled) {
      console.error('[Debug Error]', new Date().toLocaleTimeString(), ...args)
    }
  },
  
  api(method, url, params = null, response = null, error = null) {
    if (!this.enabled) return
    
    const logData = {
      timestamp: new Date().toLocaleTimeString(),
      method,
      url,
      params
    }
    
    if (response) {
      logData.response = response
    }
    
    if (error) {
      logData.error = {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      }
    }
    
    console.log('[API Debug]', logData)
  }
} 