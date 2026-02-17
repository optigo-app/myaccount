import { getCookieByName } from "./cookies";
import { decodeCookieValue } from "./decodeCookieValue";

export function bootstrapCNFromURL() {
  if (sessionStorage.getItem("__CN_BOOTSTRAPPED__") === "true") return;

  const { search, hash } = window.location;
  const params = new URLSearchParams(search || hash.replace("#", "?"));
  const cnFromUrl = params.get("CN");

  if (!cnFromUrl) {
    console.warn("[CN] CN not found in URL");
    sessionStorage.setItem("__CN_BOOTSTRAPPED__", "true");
    return;
  }

  let cookieName;
  try {
    cookieName = atob(cnFromUrl);
  } catch {
    console.error("[CN] Invalid CN base64");
    sessionStorage.setItem("__CN_BOOTSTRAPPED__", "true");
    return;
  }

  const rawCookieValue = getCookieByName(cookieName);
  if (!rawCookieValue) {
    console.warn("[CN] Cookie not found:", cookieName);
    sessionStorage.setItem("__CN_BOOTSTRAPPED__", "true");
    return;
  }

  // ✅ store RAW cookie exactly as-is
  sessionStorage.setItem(cookieName, rawCookieValue);

  // ✅ decode ONLY here
  const decoded = decodeCookieValue(rawCookieValue);
  if (decoded) {
    // you can use this object where needed
    // sessionStorage.setItem("__DECODED_CN_DATA__", JSON.stringify(decoded));
  }

  sessionStorage.setItem("__CN_BOOTSTRAPPED__", "true");
}
