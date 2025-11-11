import { HttpClient, HttpClientResponse, KeyValueStore } from "@effect/platform";
import { Effect, Option, Schema } from "effect";
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

const savePokemonList = (pokemonList: ReadonlyArray<PokemonItem>) => Effect.gen(function* () {
    const keyValueStore = yield* KeyValueStore.KeyValueStore;
    const serialized = JSON.stringify(pokemonList);
    yield* keyValueStore.set("pokemonList", serialized);
});

const loadPokemonList = Effect.gen(function* (){
    const keyValueStore = yield* KeyValueStore.KeyValueStore;
    const serialized = Option.getOrUndefined(yield* keyValueStore.get("pokemonList"));
    if (serialized) {
        const parsed = JSON.parse(serialized);
        const result = yield* decodeUnknown(Schema.Array(PokemonItemSchema))(parsed);
        if(result.length === 0){
            return null;
        }
        return result;
    } else {
        return null;
    }
})

export const getAllPokemon = Effect.gen(function* (){
    const cached = yield* loadPokemonList;
    if (cached) {
        return cached;
    }

    const httpClient = yield* HttpClient.HttpClient;
    const response = yield* httpClient.get(baseUrl + "pokemon?limit=100000&offset=0");
    const result = yield* HttpClientResponse.schemaBodyJson(PokemonResponseSchema)(response);
    yield* savePokemonList(result.results);
    return result.results;
});