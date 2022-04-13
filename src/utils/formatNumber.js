// Add dot separate number, for example: 1000 => 1.000
export const formatNumber = (num) => {
  if (!num) return 0;
  const THREE_DIGITS_REGEX = /(\d)(?=(\d{3})+(?!\d))/g;
  return num.toString().replace(THREE_DIGITS_REGEX, '$1.');
};
