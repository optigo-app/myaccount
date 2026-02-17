export function getCookieByName(name) {
  if (!name) return null;

  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    if (key === name) {
      return rest.join("="); // keep value EXACTLY as-is
    }
  }

  return null;
}
