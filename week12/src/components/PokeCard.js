import React from "react";

function PokeCard ({pokeId, name}) {
    return (
        <div style={{display: "flex", flexDirection: "column", width: "min-content"}}> 
            <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${pokeId.toString().padStart(3, "0")}.png`} alt="Pokemon" style={{width: "200px", display: "inine-block"}}/>
            <h3  style={{display: "block", textAlign: "center"}}>{pokeId}. {name}</h3>
        </div>
    );
}

export default PokeCard;