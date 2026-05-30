import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

export const getPaintings = async (params = {}) => {
  const res = await api.get('/api/paintings', { params })
  return res.data
}

export const getPainting = async (id: number) => {
  const res = await api.get(`/api/paintings/${id}`)
  return res.data
}

export const getRandomPainting = async () => {
  const res = await api.get('/api/paintings/random')
  return res.data
}

export const getArtists = async () => {
  const res = await api.get('/api/artists')
  return res.data
}
