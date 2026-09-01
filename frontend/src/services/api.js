import axios from "axios";

const api = axios.create({
  baseURL: "https://api.kenospace.online/api",
  withCredentials: true,
});

export default api;

//baseURL: "http://localhost:5000/api",
//baseURL: "https://api.kenospace.online/api"
