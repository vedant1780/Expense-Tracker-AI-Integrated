import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-ai-integrated-1.onrender.com/api"
});
console.log(import.meta.env.VITE_API_URL);

export default API;