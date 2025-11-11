import { createFileRoute } from '@tanstack/react-router'
import logo from '../logo.svg'
import { useEffect, useState } from 'react';
import { getAllPokemon, type PokemonItem } from '@/pokemon_api';
import { runtime } from '@/runtime';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {

  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState<PokemonItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runtime.runPromiseExit(getAllPokemon).then(exit => {
      if (exit._tag === 'Success') {
        setPokemonList(exit.value.results);
        setLoading(false);
      } else {
        setError('Failed to fetch Pokémon data.');
        setLoading(false);
      }
    })
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-5xl font-bold text-slate-900 text-center">
            Pokéffect
          </h1>
          <p className="text-slate-600 text-lg mt-2 text-center">Gotta catch 'em all!</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Pokémon List
        </h2>
        <ul className="max-h-[600px] overflow-y-auto bg-white rounded-lg shadow-md border border-gray-200 divide-y divide-gray-100">
          {pokemonList.map((pokemon, index) => (
            <li
              key={pokemon.name}
              className="px-6 py-4 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-slate-700 capitalize">
                  {pokemon.name}
                </span>
                <span className="text-sm text-slate-400">
                  #{String(index + 1).padStart(3, '0')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
