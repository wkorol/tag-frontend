const getApiBaseUrl = () => {
  const envValue = "https://taxiairportgdansk.com";
  if (envValue.trim() !== "") {
    return envValue;
  }
  console.warn("VITE_API_BASE_URL is not set; API calls will fail.");
  return "";
};
export {
  getApiBaseUrl as g
};
