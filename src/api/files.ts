import serve from '../utils/axios'

export const uploadFileApi = async (data: object) => {
  return await serve.post('/upload', data)
}