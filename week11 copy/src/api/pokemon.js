import axios from 'axios'

const BASE_API ='http://localhost:5050/api/v1/'

export const getPokemons = async (count=10,  after=10, token) => {
   const res = await axios.get(`${BASE_API}pokemons/`, {
    params: {count, after, authToken: token}
   })
   return res.data
}

