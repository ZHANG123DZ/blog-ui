async function anyUrlToFile(url, filename) {
  if (!url) throw new Error("No URL provided");

  const res = await fetch(url);
  const blob = await res.blob();

  const mimeType = blob.type || "application/octet-stream";

  return new File([blob], filename, { type: mimeType });
}

export default anyUrlToFile;
