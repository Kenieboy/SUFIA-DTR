import axios from "axios";

const api = axios.create({
  baseURL: "https://api.kenospace.online/api",
  withCredentials: true,
});

export default api;
