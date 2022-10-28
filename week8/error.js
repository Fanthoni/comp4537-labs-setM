class PokemonClientBadRequest extends Error {
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
class PokemonDbError extends PokemonClientBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonDbError";
  }
}
class PokemonNotFoundError extends PokemonClientBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonNotFoundError";
  }
}


module.exports = {PokemonClientBadRequest, PokemonBadRequestMissingID, PokemonDbError, PokemonNotFoundError}