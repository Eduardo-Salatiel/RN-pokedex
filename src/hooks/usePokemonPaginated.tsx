import { useEffect, useRef, useState } from 'react'
import { pokemonApi } from '../api/pokemonApi';
import { PokemonPaginatedResponse, SimplePokemon, Result } from '../interfaces/pokemonInterfaces';

export const usePokemonPaginated = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [simplePokemonList, setSimplePokemonList] = useState<SimplePokemon[]>([])
    const nextPageUrl = useRef('https://pokeapi.co/api/v2/pokemon?limit=40');

    const mapSimplePokemonList = ( pokemonList: Result[] ) => {
        const newPokemonList: SimplePokemon[] = pokemonList.map(({name, url}) => {
            const urlParts = url.split('/');
            const id = urlParts[urlParts.length -2];
            const picture = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

            return { id, name, picture }
        });

        setSimplePokemonList([...simplePokemonList, ...newPokemonList]);
        setIsLoading(false);
    }

    const loadPokemos = async() => {
        setIsLoading(true);
        const resp = await pokemonApi.get<PokemonPaginatedResponse>(nextPageUrl.current);
        nextPageUrl.current = resp.data.next;
        mapSimplePokemonList(resp.data.results);
    }

    useEffect(() => {
       loadPokemos()
    }, []);

    return {
        isLoading,
        loadPokemos,
        simplePokemonList
    }
}