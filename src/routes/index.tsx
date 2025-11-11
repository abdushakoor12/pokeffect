import { createFileRoute } from '@tanstack/react-router'
import { getAllPokemon } from '@/pokemon_api';
import { runtimeAtom } from '@/runtime';
import { useAtomValue } from '@effect-atom/atom-react';

export const Route = createFileRoute('/')({
  component: App,
})

const allPokemonsAtom = runtimeAtom.atom(getAllPokemon)

function App() {

  const state = useAtomValue(allPokemonsAtom)

  if (state._tag === "Initial") {
    return (
      <div className="text-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (state._tag === "Failure") {
    return (
      <div className="text-center">
        <p>{String(state.cause)}</p>
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
          {state.value.map((pokemon, index) => (
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
