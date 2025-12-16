export function makeId(prefix = "t") {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `${prefix}_${crypto.randomUUID()}`
    : `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}
