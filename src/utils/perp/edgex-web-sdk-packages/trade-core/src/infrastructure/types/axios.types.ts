/**
 * Axios 配置类型定义
 *
 * 共享的 Axios 配置类型，避免重复定义
 */

/**
 * Axios 配置扩展
 * 用于控制是否拦截错误
 */
export interface AxiosConfigWithInterceptor {
  /** 是否拦截错误（false 表示手动处理错误） */
  interceptError?: boolean;
}
