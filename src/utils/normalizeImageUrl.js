export function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (
    url.startsWith("blob:") ||
    url.startsWith("http") ||
    url.startsWith("data:image/")
  ) {
    return url;
  }
  const base = import.meta.env.VITE_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${base}${url.startsWith("/") ? url : "/" + url}`;
}
