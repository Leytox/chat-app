export function formatMessageTime(date) {
  console.log(date);
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
