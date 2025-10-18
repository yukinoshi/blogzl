// 解析 JWT 的 exp 并判断是否过期（前端快速判断，最终以后端为准）
export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    const payload = JSON.parse(atob(parts[1]))
    const exp = payload?.exp
    if (!exp) return false // 无 exp 则不做前端过期判断
    const now = Math.floor(Date.now() / 1000)
    return exp <= now
  } catch {
    return true
  }
}