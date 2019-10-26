import axios from 'axios';

export const authInstance = axios.create({
    baseURL: 'https://hazizz.duckdns.org:9000/auth-server',
    timeout: 2000,
    headers: {"Content-Type": "application/json"},
});

export const hazizzInstance = axios.create({
    baseURL: 'https://hazizz.duckdns.org:9000/hazizz-server',
    timeout: 2000,
    headers: {"Content-Type": "application/json"},
});

export const theraInstance = axios.create({
    baseURL: 'https://hazizz.duckdns.org:9000/thera-server',
    timeout: 2000,
    headers: {"Content-Type": "application/json"},
});