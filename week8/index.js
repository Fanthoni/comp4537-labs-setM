const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const {Schema} = mongoose
const getThreeCharDigit = require("./utility");
const {PokemonClientBadRequest, PokemonDbError, PokemonNotFoundError, PokemonBadQuery} = require("./error")
// const {asyncWrapper} = require("./asyncWrapper")

const app = express()
const port = 5050

app.use(express.json())

var pokemonSchema;
var pokemonModel;

app.listen(process.env.PORT || port, async (err) => {
  if (err) {
    console.log(err)
  }
    try {
      await mongoose.connect('mongodb+srv://testUser:COMP4537_password@cluster0.vtxvo7p.mongodb.net/?retryWrites=true&w=majority')
      
      var pokemonTypes;
      await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json")
        .then((res) => {
          pokemonTypes = res.data.map(type => {
            return type.english;
          });
        })
        .catch((err) => {
          console.log('err', err)
        })
      pokemonSchema = new Schema({
        "id": {type: String, unique: true},
        "name": {
          "english": {type: String, maxlength: 20},
          "japanese": {type: String},
          "chinese": {type: String},
          "french": {type: String},
        },
        "type": {
          type: [String], enum: pokemonTypes
        },
        "base": {
          "HP": {type: Number, required: true},
          "Attack": {type: Number, required: true},
          "Defense": {type: Number, required: true},
          "Speed": {type: Number, required: true},
          "Speed Attack": {type: Number, required: true},
          "Speed Defense": {type: Number, required: true},
        },
      }, {versionKey: false});
      pokemonModel = mongoose.model("pokemons", pokemonSchema)

      let pokemons;
      await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json")
        .then((res) => {
          pokemons = res.data
          pokemons.forEach(poke => {
            poke.base["Speed Attack"] = poke.base["Sp. Attack"]
            poke.base["Speed Defense"] = poke.base["Sp. Defense"]
            delete poke.base["Sp. Attack"];
            delete poke.base["Sp. Defense"];
          });
        })
        .catch((err) => {
          console.log('err', err)
        });
      
      await pokemonModel.deleteMany({});
      await pokemonModel.insertMany(pokemons);
    } catch (error) {
      console.log('db connection error', error);
    }
    console.log(`Example app listening on port ${port}`)
  }
)

const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

app.get("/api/v1/pokemons/", asyncWrapper(async (req, res, next) => {
  let {count, after} = req.query;
    count = parseInt(count)
    after = parseInt(after)
    if (!count || !after || isNaN(after) || isNaN(count) || count <= 0 || after < 0) {
      return next(new PokemonBadQuery("Count or After query params might be missing or has an invalid value!"))
    }

    pokemonModel.find({}).skip(after).limit(count)
    .then((respond) => {
      if (respond.length === 0) {
        return next(new PokemonNotFoundError("Invalid query! There are 0 pokemons found!"))
      }
      res.status(200).json({data: respond, status: "Success"})
    })
}))

app.post("/api/v1/pokemon", asyncWrapper(async (req, res, next) => {
  const pokemonValues = req.body;
  if (!pokemonValues || Object.keys(pokemonValues).length === 0) {
    return next(new PokemonBadQuery("Request body is missing!"))
  }

  const {id} = req.body;
  if (!id) {
    return next(new PokemonBadQuery("Id is missing from the request body"))
  }

  const pokemon = await pokemonModel.find({id: id})
  if (pokemon.length > 0) {
    return next(new PokemonNotFoundError(`Pokemon with id ${id} already exists`))
  }

  await pokemonModel.create(pokemonValues)
    .then((doc) => {
      return res.status(200).json({status: "Success!", data: doc})
    })
    .catch((err) => {
      return next(new PokemonDbError("Error encountered when creating a pokemon"))
    })
}))

// Get a pokemon data by id
app.get("/api/v1/pokemon/:id", asyncWrapper(async (req, res, next) => {
  const {id} = req.params
  if (!id) {
    return next(new PokemonBadQuery("Id is missing from the request body"))
  }

  await pokemonModel.find({id: id})
    .then((pokemon) => {
      if (pokemon.length !== 1) {
        return next(new PokemonNotFoundError(`Pokemon with id ${id} already exists`))
      }
      return res.status(200).json({status: "Success", data: pokemon})
    })
    .catch((err) => {
      return next(new PokemonDbError("Error encountered when creating a pokemon"))
    })
}))

// Get pokemon image
app.get("/api/v1/pokemonImage/:id", asyncWrapper(async (req, res, next) => {
  const {id} = req.params
  if (!id) {
    return next(new PokemonBadQuery("pokemonId is missing in the request params!"))
  }
    const pokemon = await pokemonModel.find({id: id})

    if (pokemon.length === 0)  {
      return next(new PokemonNotFoundError(`Id ${id} is not a validPokemon`))
    }

    const baseImageLinkURL = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/"
    return res.status(200).json({status: "Success", imageLink: `${baseImageLinkURL}` +`${getThreeCharDigit(id)}` + `.png`})
  
}))

// Delete a pokemon
app.delete("/api/v1/pokemon/:id", asyncWrapper(async (req, res, next) => {
  const {id} = req.params
  if (!id) {
    return next(new PokemonBadQuery("pokemonId is missing in the request params!"))
  }

  const pokemon = await pokemonModel.find({id: id})
  if (pokemon.length == 0) {
    return next(new PokemonNotFoundError(`Pokemon with id ${id} does not exist`))
  }

  await pokemonModel.deleteOne({id: id})
    .then(respond => {
      console.log('doc', respond)
      return res.status(200).json({status: "Success", msg: `Pokemon with id ${id} has been successfully deleted`})
    })
    .catch(err => {
      console.error(`Error found when deleting a pokemon with id ${id}: ${err}`)
      return res.status(500).json({status: "Error", errMsg: "Issue found when deleting pokemon with id " + id})
    })
}))

// Upsert a partial pokemon document
app.patch("/api/v1/pokemon/:id", asyncWrapper(async (req, res, next) => {
  const {id} = req.params
  const newPokemonValues = req.body

  const pokemon = await pokemonModel.find({id: id})
  if (pokemon.length == 0) {
    return next(new PokemonNotFoundError(`No pokemon found for ${id}`))
  }

  await pokemonModel.updateOne({id: id}, newPokemonValues)
    .then(doc => {
      return res.status(200).json({status: "Success", data: {newPokemonValues}})
    })
    .catch(err => {
      return next(new PokemonDbError(`Error encountered while updatingPokemon with id ${id}`))
    })
}))

// Update the entire pokemon document
app.put("/api/v1/pokemon/:id", asyncWrapper(async (req, res, next) => {
  const {id} = req.params
  const newPokemonValues = req.body

  const pokemon = await pokemonModel.find({id: id})
  if (pokemon.length == 0) {
    await pokemonModel.create(newPokemonValues)
    .then((doc) => {
      return res.status(200).json({status: "Success!", data: doc})
    })
    .catch((err) => {
      console.log('err', err)
      return next(new PokemonDbError("Error encountered when creating a pokemon"))
    })
  } else {
    await pokemonModel.findOneAndUpdate({id: id}, newPokemonValues, {upsert: true})
      .then(doc => {
        return res.status(200).json({status: "Success", data: newPokemonValues})
      })
      .catch(err => {
        return next(new PokemonBadQuery("One or more properties may be invalid"))
      })
  }
}))

// Custom error handler
app.use((err, req, res, next) => {
  const error = {
    name: err.name,
    message: err.message
  }
  const isClientError = err instanceof PokemonClientBadRequest
  const errorStatus = isClientError ? "ClientError" : "ServerError"
  res.status(isClientError ? 400 : 500).send({status: errorStatus, error: error.message})
})

app.use((req, res, next) => {
  res.status(404).send({
  status: 404,
  error: "Not Found"
  })
 })



