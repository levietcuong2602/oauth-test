let timeout;
const debounce =
  (func, wait = 1000) =>
  (...args) => {
    const executeFunction = () => {
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(executeFunction, wait);
  };
export default debounce;
