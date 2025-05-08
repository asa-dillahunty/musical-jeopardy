export function generatePartyCode() {
  const dev = window.location.hostname === "localhost";
  if (dev) return "ABC";

  return randomString(3);
}

function randomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
