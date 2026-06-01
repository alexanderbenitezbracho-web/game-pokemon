import { Pokemon } from "./pokemon.interface";

export interface Response {
    count: number;
    next : string;
    previous: string;
    results: Pokemon[];
}