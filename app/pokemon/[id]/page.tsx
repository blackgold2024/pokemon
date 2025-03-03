"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
interface PokemonDetails {
  name: string;
  id: number;
  image: string;
  types: string[];
  stats: string[];
  abilities: string[];
  moves: string[];
}

export default function PokemonPage() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();

      setPokemon({
        name: data.name,
        id: data.id,
        image: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
        types: data.types.map((t: any) => t.type.name),
        stats: data.stats.map((s: any) => `${s.stat.name}: ${s.base_stat}`),
        abilities: data.abilities.map((a: any) => a.ability.name),
        moves: data.moves.slice(0, 5).map((m: any) => m.move.name), // Show only 5 moves
      });

      setLoading(false);
    };

    fetchPokemonDetails();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading Pokemon...</div>;
  }
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-2 pt-3">
      <nav className="self-start w-full max-w-3xl mb-6">
        <div className="flex justify-between items-center mt-6 ml-4">
          <Link
            href="/"
            className="text-blue-600 text-[15px] font-medium my-4 inline-block hover:text-blue-800 transition duration-200"
          >
            ← Back
          </Link>
          <ul className="flex space-x-2 text-gray-600 text-md">
            <li>
              <Link href="/" className="hover:text-blue-600 transition duration-200">
                Home
              </Link>
              &gt;
            </li>
            <li>
              <Link href="/" className="hover:text-blue-600 transition duration-200">
                Pokemon
              </Link>
              &gt;
            </li>
            <li className="text-blue-600 font-semibold capitalize">{pokemon?.name}</li>
          </ul>

        </div>
      </nav>
      <div>

      </div>
      <div className="bg-blue-100 shadow-lg rounded-2xl max-w-sm w-full text-center">
        <Image
          src={pokemon?.image}
          alt={pokemon?.name}
          width={160}
          height={160}
          className="w-40 h-40 my-2 mx-auto"
        />
        <div className="mt-6 p-5 text-[15px] space-y-1 bg-yellow-300 rounded-lg shadow-md text-gray-800 text-left">
          <p className=""><span className="font-semibold">Name:</span> {pokemon?.name}</p>
          <p><span className="font-semibold">Type:</span> {pokemon?.types.join(", ")}</p>
          <p><span className="font-semibold">Stats:</span> {pokemon?.stats.join(", ")}</p>
          <p><span className="font-semibold">Abilities:</span> {pokemon?.abilities.join(", ")}</p>
          <p><span className="font-semibold">Some Moves:</span> {pokemon?.moves.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
