import { HttpClient } from "@effect/platform";
import { Effect, Schema } from "effect";
import { decodeUnknown } from "effect/Schema";

const baseUrl = "https://pokeapi.co/api/v2/";

const PokemonItemSchema = Schema.Struct({
    name: Schema.String,
    url: Schema.String,
});


export const PokemonResponseSchema = Schema.Struct({
    count: Schema.Number,
    next: Schema.Union(Schema.String, Schema.Null),
    previous: Schema.Union(Schema.String, Schema.Null),
    results: Schema.Array(PokemonItemSchema),
});

export type PokemonItem = typeof PokemonItemSchema.Type;
export type PokemonResponse = typeof PokemonResponseSchema.Type;

export const getAllPokemon = Effect.gen(function* (){
    const httpClient = yield* HttpClient.HttpClient;
    const response = yield* httpClient.get(baseUrl + "pokemon?limit=100000&offset=0");
    const json = yield* response.json;
    return yield* decodeUnknown(PokemonResponseSchema)(json);
});