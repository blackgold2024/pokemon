"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
interface Pokemon {
  name: string;
  url: string;
  image: string;
  id: number;
}
const PokemonList = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
        const data = await response.json();
        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            console.log(details)
            return {
              name: pokemon.name,
              url: pokemon.url,
              id: details.id,
              image: details.sprites.other["official-artwork"].front_default || details.sprites.front_default,
            };
          })
        );

        setPokemons(detailedPokemon);
        setFilteredPokemons(detailedPokemon);
      } catch (error) {
        console.error("Failed to fetch Pokémon:", error);
      }
      setLoading(false);
    };

    fetchPokemons();
  }, [limit]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredPokemons(pokemons.filter((pokemon) => pokemon.name.includes(value)));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h3 className="text-4xl font-semibold text-center text-gray-800 mb-8">Pokemon List</h3>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <select
          className="border border-gray-300 rounded-lg p-2 text-gray-700 bg-white shadow-sm"
          onChange={(e) => setLimit(parseInt(e.target.value))}
        >
          <option value="10">Show 10</option>
          <option value="20">Show 20</option>
          <option value="50">Show 50</option>
          <option value="100">Show 100</option>
          <option value="500">Show 500</option>
        </select>
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search Pokémon..."
            className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-gray-600 text-lg">Loading Pokemon...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPokemons.map((pokemon) => (
            <div
              key={pokemon.id}
              className="rounded-xl bg-white shadow-lg flex flex-col items-center text-center transform transition duration-300 hover:scale-105"
            >
              <div className="bg-white py-2 rounded-full">
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  width={160}
                  height={160}
                  className="w-40 h-40 object-contain"
                />
              </div>
              <div className="bg-blue-50 w-full text-left p-4 rounded-lg mt-4">
                <p className="text-md font-semibold capitalize my-3">{pokemon.name}</p>
                <Link
                  href={`/pokemon/${pokemon.id}`}
                  rel="noopener noreferrer"
                  className="text-blue-600 text-[12px] font-medium my-4 inline-block hover:text-blue-800 transition duration-200"
                >
                  Details →
                </Link>
              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonList;
