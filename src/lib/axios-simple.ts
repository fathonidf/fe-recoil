import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

// Alternative configuration to minimize preflight requests
const apiClientSimple = axios.create({
  baseURL: API_BASE_URL,
  // Use simple content type to avoid preflight
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

// Helper function to convert object to URL encoded string
const toUrlEncoded = (obj: Record<string, unknown>) => {
  return Object.keys(obj)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(String(obj[key])))
    .join('&')
}

export { apiClientSimple, toUrlEncoded }