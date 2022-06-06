import axios from "axios"

interface ApiParams {
    setor: string
    page?: number
}

export const ApiService = axios.create({
    baseURL: "http://api.teste.com/api",
    headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json"
    },
    withCredentials: true
})