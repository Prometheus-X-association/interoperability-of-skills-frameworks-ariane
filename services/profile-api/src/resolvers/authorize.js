export const authorize =
  (authObject) =>
  (...args) => {
    // TODO: handle more when having specific requirements
    if (!authObject) {
      // throw new Error("invalid-token");
    }
  };
