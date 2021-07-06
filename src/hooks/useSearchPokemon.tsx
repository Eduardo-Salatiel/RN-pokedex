import { useEffect, useRef, useState } from "react";
import { pokemonApi } from "../api/pokemonApi";
import {
  PokemonPaginatedResponse,
  SimplePokemon,
  Result,
} from "../interfaces/pokemonInterfaces";

export const useSearchPokemon = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [simplePokemonList, setSimplePokemonList] = useState<SimplePokemon[]>(
    [],
  );

  const mapSimplePokemonList = (pokemonList: Result[]) => {
    const newPokemonList: SimplePokemon[] = pokemonList.map(({ name, url }) => {
      const urlParts = url.split("/");
      const id = urlParts[urlParts.length - 2];
      const picture = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

      return { id, name, picture };
    });

    setSimplePokemonList(newPokemonList);
    setIsFetching(false);
  };

  const loadPokemos = async () => {
    const resp = await pokemonApi.get<PokemonPaginatedResponse>(
      "https://pokeapi.co/api/v2/pokemon?limit=1200",
    );
    mapSimplePokemonList(resp.data.results);
  };

  useEffect(() => {
    loadPokemos();
  }, []);

  return {
    isFetching,
    simplePokemonList,
  };
};
