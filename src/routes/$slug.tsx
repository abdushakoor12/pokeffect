import { createFileRoute, Link } from '@tanstack/react-router'
import { getPokemonDetail } from '@/pokemon_api'
import { runtimeAtom } from '@/runtime'
import { useAtomValue } from '@effect-atom/atom-react'
import { useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()
  
  const pokemonAtom = useMemo(
    () => runtimeAtom.atom(getPokemonDetail(slug)),
    [slug]
  )
  
  const state = useAtomValue(pokemonAtom)

  if (state._tag === 'Initial') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-green-400 text-xl mb-4 animate-pulse">
            <span>&gt; ACCESSING DATABASE</span>
            <span className="animate-pulse">...</span>
          </div>
          <div className="text-green-600 text-sm uppercase tracking-wider">
            [ LOADING: {slug} ]
          </div>
        </div>
      </div>
    )
  }

  if (state._tag === 'Failure') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-center max-w-md border-2 border-red-500 p-8 bg-red-950/30">
          <div className="text-red-400 text-2xl mb-4">[ SYSTEM ERROR ]</div>
          <div className="text-red-300 mb-6 text-sm">{String(state.cause)}</div>
          <Link to="/" className="inline-block px-6 py-3 border-2 border-green-500 text-green-400 hover:bg-green-500/20 transition-colors tracking-wider">
            &gt; RETURN TO DATABASE
          </Link>
        </div>
      </div>
    )
  }

  const pokemon = state.value
  const typeColors: Record<string, string> = {
    normal: 'border-gray-500 text-gray-400',
    fire: 'border-red-500 text-red-400',
    water: 'border-blue-500 text-blue-400',
    electric: 'border-yellow-500 text-yellow-400',
    grass: 'border-green-500 text-green-400',
    ice: 'border-cyan-500 text-cyan-400',
    fighting: 'border-orange-600 text-orange-400',
    poison: 'border-purple-500 text-purple-400',
    ground: 'border-yellow-700 text-yellow-600',
    flying: 'border-indigo-400 text-indigo-300',
    psychic: 'border-pink-500 text-pink-400',
    bug: 'border-lime-500 text-lime-400',
    rock: 'border-amber-700 text-amber-600',
    ghost: 'border-purple-700 text-purple-500',
    dragon: 'border-indigo-600 text-indigo-400',
    dark: 'border-gray-700 text-gray-500',
    steel: 'border-gray-400 text-gray-300',
    fairy: 'border-pink-400 text-pink-300',
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Scanline effect overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,255,0,0.03),rgba(0,255,0,0.03)_1px,transparent_1px,transparent_2px)] z-50"></div>
      
      <header className="border-b-2 border-green-900/50 bg-black/90 backdrop-blur-sm sticky top-0 z-40 shadow-[0_0_20px_rgba(0,255,0,0.3)]">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            <span className="tracking-wide">&lt; RETURN TO DATABASE</span>
          </Link>
        </div>
      </header>

      <style>{`
        .glowing-text {
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.5);
        }
        .terminal-box {
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.2), inset 0 0 20px rgba(0, 255, 0, 0.05);
        }
      `}</style>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="border-2 border-green-500/50 bg-black/80 backdrop-blur-sm terminal-box mb-6">
            <div className="border-b-2 border-green-900/50 px-6 py-4 bg-green-950/20">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-3xl font-bold text-green-400 uppercase tracking-wider glowing-text">
                  &gt; {pokemon.name}
                </h1>
                <span className="text-xl text-green-600 font-mono">
                  [ID: {String(pokemon.id).padStart(4, '0')}]
                </span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {pokemon.types.map((type) => (
                  <span
                    key={type.slot}
                    className={`px-3 py-1 border uppercase text-xs font-bold tracking-wider ${typeColors[type.type.name] || 'border-gray-500 text-gray-400'}`}
                  >
                    [{type.type.name}]
                  </span>
                ))}
              </div>
            </div>

            {/* Sprites */}
            <div className="flex justify-center items-center gap-12 py-8 bg-black/40">
              {pokemon.sprites.front_default && (
                <div className="text-center border border-green-900/30 p-4 bg-black/50">
                  <img 
                    src={pokemon.sprites.front_default} 
                    alt={`${pokemon.name} front`} 
                    className="w-32 h-32 mx-auto image-pixelated" 
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <p className="text-xs text-green-600 mt-2 tracking-wider">&gt; STANDARD</p>
                </div>
              )}
              {pokemon.sprites.front_shiny && (
                <div className="text-center border border-yellow-600/50 p-4 bg-black/50">
                  <img 
                    src={pokemon.sprites.front_shiny} 
                    alt={`${pokemon.name} shiny`} 
                    className="w-32 h-32 mx-auto" 
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <p className="text-xs text-yellow-500 mt-2 tracking-wider">&gt; SHINY_VARIANT</p>
                </div>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Physical Info */}
            <div className="border-2 border-green-500/50 bg-black/80 backdrop-blur-sm terminal-box p-6">
              <h2 className="text-xl font-bold text-green-400 mb-4 tracking-wider">&gt; PHYSICAL_DATA</h2>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between items-center py-2 border-b border-green-900/30">
                  <span className="text-green-600">HEIGHT:</span>
                  <span className="text-green-400 font-bold">{(pokemon.height / 10).toFixed(1)} m</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-900/30">
                  <span className="text-green-600">WEIGHT:</span>
                  <span className="text-green-400 font-bold">{(pokemon.weight / 10).toFixed(1)} kg</span>
                </div>
                {pokemon.base_experience && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-green-600">BASE_EXP:</span>
                    <span className="text-green-400 font-bold">{pokemon.base_experience} XP</span>
                  </div>
                )}
              </div>
            </div>

            {/* Abilities */}
            <div className="border-2 border-green-500/50 bg-black/80 backdrop-blur-sm terminal-box p-6">
              <h2 className="text-xl font-bold text-green-400 mb-4 tracking-wider">&gt; ABILITIES</h2>
              <div className="space-y-3">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.slot}
                    className={`px-4 py-3 border ${ability.is_hidden ? 'border-yellow-500/50 bg-yellow-950/20' : 'border-green-700/50 bg-green-950/20'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-300 uppercase text-sm tracking-wide">
                        {ability.ability.name.replace('-', '_')}
                      </span>
                      {ability.is_hidden && (
                        <span className="text-xs px-2 py-1 border border-yellow-500 text-yellow-400">[HIDDEN]</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-2 border-green-500/50 bg-black/80 backdrop-blur-sm terminal-box p-6">
            <h2 className="text-xl font-bold text-green-400 mb-6 tracking-wider">&gt; BASE_STATISTICS</h2>
            <div className="space-y-4">
              {pokemon.stats.map((stat) => {
                const maxStat = 255
                const percentage = (stat.base_stat / maxStat) * 100
                const statColors: Record<string, string> = {
                  hp: 'bg-red-500',
                  attack: 'bg-orange-500',
                  defense: 'bg-yellow-500',
                  'special-attack': 'bg-cyan-500',
                  'special-defense': 'bg-blue-500',
                  speed: 'bg-pink-500',
                }
                
                return (
                  <div key={stat.stat.name}>
                    <div className="flex items-center justify-between mb-2 font-mono">
                      <span className="text-green-600 uppercase text-sm min-w-[160px] tracking-wide">
                        {stat.stat.name.replace('-', '_')}:
                      </span>
                      <span className="text-green-400 font-bold text-lg">[{stat.base_stat}]</span>
                    </div>
                    <div className="w-full bg-green-950/30 border border-green-900/30 h-4 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${statColors[stat.stat.name] || 'bg-green-500'}`}
                        style={{ 
                          width: `${percentage}%`,
                          boxShadow: `0 0 10px ${statColors[stat.stat.name] ? 'currentColor' : 'rgba(0, 255, 0, 0.5)'}`
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 pt-6 border-t-2 border-green-900/50">
              <div className="flex justify-between items-center font-mono">
                <span className="text-green-400 font-bold text-lg tracking-wider">TOTAL_POWER:</span>
                <span className="text-green-300 font-bold text-2xl glowing-text">
                  [{pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}]
                </span>
              </div>
            </div>
          </div>

          {/* Footer timestamp */}
          <div className="mt-6 text-center text-green-700 text-xs tracking-wider font-mono">
            [ DATA_RETRIEVED ] // {new Date().toISOString()}
          </div>
        </div>
      </main>
    </div>
  )
}
