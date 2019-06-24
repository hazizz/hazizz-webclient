import axios from 'axios';

export const axiosAuth = axios.create({
    baseURL: "https://hazizz.duckdns.org:9000/auth-server",
});

export const axiosHazizz = axios.create({
    baseURL: "https://hazizz.duckdns.org:9000/hazizz-server",
});

export const axiosThera = axios.create({
    baseURL: "https://hazizz.duckdns.org:9000/thera-server",
});

export const setAuthorizationTokenByDefault = token => {
    axiosHazizz.defaults.headers.common['Authorization'] = token;
    axiosThera.defaults.headers.common['Authorization'] = token;
};