import { createFileRoute, Link } from "@tanstack/react-router";
import { getAllPokemon } from "@/pokemon_api";
import { runtimeAtom } from "@/runtime";
import { useAtomValue } from "@effect-atom/atom-react";

export const Route = createFileRoute("/")({
  component: App,
});

const allPokemonsAtom = runtimeAtom.atom(getAllPokemon);

function App() {
  const state = useAtomValue(allPokemonsAtom);

  if (state._tag === "Initial") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center font-mono">
          <div className="text-green-400 text-xl animate-pulse">
            <span className="inline-block">&gt; LOADING DATABASE</span>
            <span className="animate-pulse">...</span>
          </div>
        </div>
      </div>
    );
  }

  if (state._tag === "Failure") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center font-mono border-2 border-red-500 p-8 bg-red-950/30">
          <div className="text-red-400 text-xl mb-2">ERROR: SYSTEM FAILURE</div>
          <p className="text-red-300">{String(state.cause)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Scanline effect overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,255,0,0.03),rgba(0,255,0,0.03)_1px,transparent_1px,transparent_2px)] z-50"></div>
      
      <header className="border-b-2 border-green-900/50 bg-black/90 backdrop-blur-sm sticky top-0 z-40 shadow-[0_0_20px_rgba(0,255,0,0.3)]">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="text-xs text-green-600 mb-2">SYSTEM ONLINE // DATABASE ACTIVE</div>
            <h1 className="text-4xl font-bold text-green-400 tracking-wider glowing-text">
              &gt; POKÉFFECT_v1.0
            </h1>
            <p className="text-green-600 text-sm mt-2 tracking-wide">
              [ CLASSIFIED POKÉMON DATABASE ACCESS ]
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 border-l-4 border-green-500 pl-4">
          <h2 className="text-xl text-green-300 tracking-wide">
            &gt; AVAILABLE_ENTRIES: {state.value.length}
          </h2>
        </div>

        <div className="max-h-[600px] overflow-y-auto bg-black/50 border-2 border-green-900/50 shadow-[0_0_20px_rgba(0,255,0,0.2)] backdrop-blur-sm">
          <style>{`
            .glowing-text {
              text-shadow: 0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.5);
            }
            .terminal-line:hover {
              background: rgba(0, 255, 0, 0.1);
              text-shadow: 0 0 8px rgba(0, 255, 0, 0.6);
            }
          `}</style>
          
          {state.value.map((pokemon, index) => (
            <Link
              to="/$slug"
              params={{ slug: pokemon.name }}
              key={pokemon.name}
            >
              <div className="terminal-line flex items-center justify-between px-6 py-3 border-b border-green-900/30 transition-all duration-150 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <span className="text-green-600 text-sm font-bold w-16 group-hover:text-green-400">
                    [{String(index + 1).padStart(4, "0")}]
                  </span>
                  <span className="text-green-400 tracking-wide uppercase group-hover:text-green-300">
                    {pokemon.name}
                  </span>
                </div>
                <span className="text-green-700 text-xs group-hover:text-green-500">
                  &gt;&gt; ACCESS
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center text-green-700 text-xs tracking-wider">
          [ END OF DATABASE LISTING ] // {new Date().toISOString()}
        </div>
      </main>
    </div>
  );
}
