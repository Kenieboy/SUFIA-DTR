import axios from "axios";

const api = axios.create({
  baseURL: "https://kenospace.online/api",
  withCredentials: true,
});

export default api;
