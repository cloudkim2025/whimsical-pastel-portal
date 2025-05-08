
// src/utils/AIapiClient.ts
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8001',
    timeout: 60000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
});

export default API;
