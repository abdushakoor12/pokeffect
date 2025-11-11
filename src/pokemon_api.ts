import { HttpClient } from "@effect/platform";
import { Effect } from "effect";

const baseUrl = "https://pokeapi.co/api/v2/";

export interface PokemonItem {
    name: string;
    url: string;
}

export interface PokemonResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonItem[];
}

export const getAllPokemon = Effect.gen(function* (){
    const httpClient = yield* HttpClient.HttpClient;
    const response = yield* httpClient.get(baseUrl + "pokemon?limit=100000&offset=0");
    const json = yield* response.json;
    return json as PokemonResponse;
});