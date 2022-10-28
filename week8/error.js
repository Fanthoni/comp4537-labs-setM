class PokemonClientBadRequest extends Error {
    constructor(message) {
      super(message);
      this.name = "PokemonBadRequest";
    }
}
class PokemonServerError extends Error {
    constructor(message) {
      super(message);
      this.name = "PokemonBadRequest";
    }
}


class PokemonBadRequestMissingID extends PokemonClientBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestMissingID";
  }
}
class PokemonNotFoundError extends PokemonClientBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonNotFoundError";
  }
}
class PokemonBadQuery extends PokemonClientBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadQuery";
  }
}
class PokemonDbError extends PokemonServerError {
  constructor(message) {
    super(message);
    this.name = "PokemonDbError";
  }
}




module.exports = {PokemonClientBadRequest, PokemonBadRequestMissingID, PokemonDbError, PokemonNotFoundError, PokemonBadQuery}