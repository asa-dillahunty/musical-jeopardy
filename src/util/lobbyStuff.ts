import { isLocalEnv } from "./konami";

export function generatePartyCode() {
  if (isLocalEnv()) return "ABC";

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
