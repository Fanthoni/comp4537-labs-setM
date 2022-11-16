import axios from 'axios'

const BASE_API ='http://localhost:6060/'

export const login = async (username,  pw) => {
    const res = await axios.post(`${BASE_API}login/`, {username, password: pw})
    return res.data
 }