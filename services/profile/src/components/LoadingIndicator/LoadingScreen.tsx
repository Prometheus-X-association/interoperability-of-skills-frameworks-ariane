import LoadingIndicator from ".";

const LoadingScreen = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        opacity: 0.5,
        background: "black",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingIndicator />
    </div>
  );
};

export default LoadingScreen;
