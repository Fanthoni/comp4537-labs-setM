import {useEffect, useRef, useState} from "react"
import PokeCard from "./components/PokeCard";
import pokemons from "./pokedex.json"

function App() {

  const [name, setName] = useState("")
  const [type, setType] = useState("All")
  const [pokemonsShown, setPokemonsShown] = useState(pokemons)

  // useEffect(() => {
  //   let types = []
  //   for (const poke of pokemons) {
  //     types = [...types, ...poke.type]
  //   }
  //   types = types.filter((v, i, a) => a.indexOf(v) === i);
  //   console.log('types.unique()', types)
  // }, [])

  useEffect(() => {
    let pokemonsToShow = pokemons
    if (name !== "") {
      pokemonsToShow = pokemonsToShow.filter(poke => poke.name.english.toLowerCase().includes(name))
    }

    if (type !== "All") {
      pokemonsToShow = pokemonsToShow.filter(poke => poke.type.includes(type))
    }
    setPokemonsShown(pokemonsToShow)
  }, [name, type])

  return (
    <>
      <h1>Ferrel Anthoni Week 11 Lab</h1>
      <label>
        Pokemon Name:
        <input type="text" name="name" onChange={(e) => {setName(e.target.value.trim().toLowerCase())}}/>
      </label>
      <br />
      <br />
      <label>Type</label>
      <select value={type} onChange={(e) => {setType(e.target.value)}}>
        <option value="All">All</option>
        {['Grass', 'Poison', 'Fire', 'Flying', 'Water', 'Bug', 'Normal', 'Electric', 'Ground', 'Fairy', 'Fighting', 'Psychic', 'Rock', 'Steel', 'Ice', 'Ghost', 'Dragon', 'Dark']
          .map((type) => {
            return <option value={type}>{type}</option>
        })}
      </select>


      <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "50px"}}>
        {pokemonsShown.map((pokeData) => {
          return <PokeCard key={pokeData.id}  name={pokeData.name.english} pokeId={pokeData.id}/>
        })}
      </div>
    </>
  );
}

export default App;
