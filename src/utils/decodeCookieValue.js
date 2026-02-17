function safeBase64Decode(value) {
    if (typeof value !== "string") return value;
  
    try {
      const decoded = atob(value);
  
      // basic check: printable characters
      if (/^[\x09\x0A\x0D\x20-\x7E]*$/.test(decoded)) {
        return decoded;
      }
  
      return value;
    } catch {
      return value;
    }
  }
  
  export function decodeCookieValue(rawCookieValue) {
    if (!rawCookieValue) return null;
  
    let decodedURIComponent;
    try {
      decodedURIComponent = decodeURIComponent(rawCookieValue);
    } catch (err) {
      console.error("[Cookie] URL decode failed", err);
      return null;
    }
  
    let parsed;
    try {
      parsed = JSON.parse(decodedURIComponent);
    } catch (err) {
      console.error("[Cookie] JSON parse failed", err);
      return null;
    }
  
    // Decode base64 fields safely
    const result = {};
    for (const [key, value] of Object.entries(parsed)) {
      result[key] = safeBase64Decode(value);
    }
  
    return result;
  }
  