import axios from "axios";

// we need to pass the baseURL as an object
const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

export default API;