import axios from "axios";

const API_URL = "http://localhost:5000/api/result";

export const submitResult = async (categoryId, score) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_URL}/submit`,
    { categoryId, score },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getHistory = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
