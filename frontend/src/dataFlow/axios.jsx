// Input for BaseUrl of backend server

import axios from "axios";

// we need to pass the baseURL as an object
const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

export default API;