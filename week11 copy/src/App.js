import {useEffect, useRef, useState} from "react"

import './App.css';
import {login} from "./api/login"
import {getPokemons} from "./api/pokemon"

function App() {

  const [pokemons, setPokemons]   = useState([])
  const [pokemonPage, setPokemonPage] = useState(1)
  const token = useRef("")

  useEffect(() => {
    const getPokemon = async () => {
      const username = "test"
      const password = "test"
      const tokenRes = await login(username, password)
      token.current = tokenRes.token
      
      const pokemonsRes = await getPokemons(809, 0, token.current);
      setPokemons(pokemonsRes.data)
      setPokemonPage(1)
    }
    getPokemon()
  }, [])

  const getPokemonsToDisplay = (page) => {
    const toDisplay = pokemons.slice(page * 10 - 10, page * 10)
    console.log('toDisplay', page * 10 - 10, page * 10)
    return toDisplay.map((pokeData) => {
      return <p key={pokeData.id}>{pokeData.name.english} with id {pokeData.id}</p>
    })
  }

  const getButtons = () => {
    let index = []
    for (let i = 0; i < pokemons.length / 10; i++) {
      index.push(i)
    }
    // console.log('index', index)
    const buttons = index.map((i) => {
      return <button key={i + 1} onClick={() => {
        setPokemonPage(i + 1)
      }}>{i + 1}</button>
    })
    return buttons;
  }

  return (
    <>
      <h1>Pokemons List Pagination</h1>
      <h2>By Ferrel Anthoni</h2>
      <h3>Pokemon page: {pokemonPage}</h3>
      {getPokemonsToDisplay(pokemonPage)}
      {pokemonPage !== 1 && <button onClick={() => {setPokemonPage(pokemonPage - 1)}}>prev</button>}
      {getButtons()}
      {pokemonPage !== Math.ceil(pokemons.length / 10) && <button onClick={() => {setPokemonPage(pokemonPage + 1)}}>next</button>}
    </>
  );
}

export default App;
