const base64UrlDecode = (input: string) => {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  return atob(padded);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const exp = payload?.exp;
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return exp <= now;
  } catch {
    return true;
  }
};