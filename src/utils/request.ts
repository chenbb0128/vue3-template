import axios from 'axios'

export const request = axios.create({
  timeout: 10000,
  baseURL: import.meta.env.VITE_BASE_API,
})
