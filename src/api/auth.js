import api from "./axios";

// Register API
export const registerUser = async (formData) => {
  const res = await api.post("/auth/register", formData);
  return res.data;
};

// Login API
export const loginUser = async (formData) => {
  const res = await api.post("/auth/login", formData);
  return res.data;
};
