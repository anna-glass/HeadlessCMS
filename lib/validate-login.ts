export function isValidEmail(email: string, allowedDomains?: string[]): boolean {
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return false
  
    if (allowedDomains && allowedDomains.length > 0) {
      const domain = email.split('@')[1]
      return allowedDomains.includes(domain)
    }
    return true
  }
  
export function isValidPassword(password: string): boolean {
    // At least 8 chars, one uppercase, one number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
}
  