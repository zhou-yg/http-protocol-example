window.utils = {
  sleep (s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
  },
};
