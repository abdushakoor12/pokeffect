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

const PokemonDetailSchema = Schema.Struct({
    id: Schema.Number,
    name: Schema.String,
    height: Schema.Number,
    weight: Schema.Number,
    base_experience: Schema.Union(Schema.Number, Schema.Null),
    sprites: Schema.Struct({
        front_default: Schema.Union(Schema.String, Schema.Null),
        front_shiny: Schema.Union(Schema.String, Schema.Null),
        back_default: Schema.Union(Schema.String, Schema.Null),
        back_shiny: Schema.Union(Schema.String, Schema.Null),
        other: Schema.optional(Schema.Unknown),
    }),
    types: Schema.Array(Schema.Struct({
        slot: Schema.Number,
        type: Schema.Struct({
            name: Schema.String,
            url: Schema.String,
        }),
    })),
    abilities: Schema.Array(Schema.Struct({
        is_hidden: Schema.Boolean,
        slot: Schema.Number,
        ability: Schema.Struct({
            name: Schema.String,
            url: Schema.String,
        }),
    })),
    stats: Schema.Array(Schema.Struct({
        base_stat: Schema.Number,
        effort: Schema.Number,
        stat: Schema.Struct({
            name: Schema.String,
            url: Schema.String,
        }),
    })),
    moves: Schema.Array(Schema.Unknown),
    species: Schema.Struct({
        name: Schema.String,
        url: Schema.String,
    }),
});

export type PokemonDetail = typeof PokemonDetailSchema.Type;

const savePokemonDetail = (name: string, rawData: unknown) => Effect.gen(function* () {
    const keyValueStore = yield* KeyValueStore.KeyValueStore;
    const serialized = JSON.stringify(rawData);
    yield* keyValueStore.set(`pokemon:${name}`, serialized);
});

const loadPokemonDetail = (name: string) => Effect.gen(function* () {
    const keyValueStore = yield* KeyValueStore.KeyValueStore;
    const serialized = Option.getOrUndefined(yield* keyValueStore.get(`pokemon:${name}`));
    if (serialized) {
        const parsed = JSON.parse(serialized);
        const result = yield* decodeUnknown(PokemonDetailSchema)(parsed);
        return result;
    } else {
        return null;
    }
});

export const getPokemonDetail = (name: string) => Effect.gen(function* () {
    const cached = yield* loadPokemonDetail(name);
    if (cached) {
        return cached;
    }

    const httpClient = yield* HttpClient.HttpClient;
    const response = yield* httpClient.get(baseUrl + `pokemon/${name}`);
    const rawData = yield* response.json;
    yield* savePokemonDetail(name, rawData);
    const result = yield* decodeUnknown(PokemonDetailSchema)(rawData);
    return result;
});