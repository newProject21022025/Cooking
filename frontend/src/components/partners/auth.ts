export const getUserIdFromStorage = (): string | null => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) return storedUserId;
    
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id || payload.userId || payload.sub || null;
      } catch (e) {
        console.error("Помилка декодування токена:", e);
      }
    }
    
    return sessionStorage.getItem("userId") || null;
  };