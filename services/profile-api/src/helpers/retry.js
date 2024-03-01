export const retry = async (fn, { retryTimes, delay }) => {
  try {
    await fn();
  } catch (e) {
    retryTimes > 0
      ? wait(delay).then(() => retry(fn, { retryTimes: retryTimes - 1, delay }))
      : await Promise.reject("failed");
  }
};

const wait = async (time) =>
  new Promise((resolve) => setTimeout(resolve, time || 0));
