import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const registerUser = (userData) => API.post("/auth/register", userData);
export const loginUser = (userData) => API.post("/auth/login", userData);
export const createEntry = (entryData, config) => API.post("/entries", entryData, config);
export const getEntries = (token) => API.get("/entries", { headers: { Authorization: token } });
export const searchEntries = (query, token) =>
  API.get(`/entries/search?query=${query}`, { headers: { Authorization: token } });

