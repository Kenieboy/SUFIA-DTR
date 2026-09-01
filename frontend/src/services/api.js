import axios from "axios";

const api = axios.create({
  baseURL: "https://api.kenospace.online/api",
  withCredentials: true,
});

export const photoUploadURL = "https://api.kenospace.online";

export default api;

//baseURL: "http://localhost:5000/api",
//baseURL: "https://api.kenospace.online/api",
