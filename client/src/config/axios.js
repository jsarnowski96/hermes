import axios from 'axios';

var instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1000,
    timeoutErrorMessage: 'Request timeout exceeded',
    headers: {
        'Content-Type': 'application/json'
    },
    
})

export default instance;