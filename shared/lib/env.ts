export const getVersion = (): string => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_VERSION || "1.0.0";
  }

  const storedVersion = window.localStorage.getItem("VERSION");
  if (storedVersion) {
    return storedVersion;
  }

  const version = process.env.NEXT_PUBLIC_VERSION || "1.0.0";
  window.localStorage.setItem("VERSION", version);
  return version;
};

