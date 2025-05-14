export const today = () => {
  const date = new Date().toISOString();
  return date.split("T")[0];
};
