import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon.interface';
import { Response } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl: string = 'https://pokeapi.co/api/v2/pokemon/?offset=';
  private correctAnswerExist: boolean = false;
  private counter: number = 0;

  constructor(private http: HttpClient) {}

  public fetchPokemons(): Observable<any> {
    this.resetState();
    this.drawOffset().toString()
    return this.http.get<any>(this.apiUrl + this.drawOffset().toString() + '&limit=4')
      .pipe(map(resource => this.processResponse(resource)));
  }

  private processResponse(response: Response) {
    return {
      count: response.count,
      next: response.next,
      previous: response.previous,
      results: response.results.map((pokemon: any) => (<Pokemon> {
        name: pokemon.name,
        correctAnswer: this.chooseCorrectAnswer(),
        status: false
      }))
    }
  }

  private chooseCorrectAnswer(): boolean {
    this.counter++;
    if(this.correctAnswerExist === true) {
      return false;
    }
    if(this.correctAnswerExist === false && this.counter >= 4) {
      return true;
    }
    if(Math.random() > 0.5) {
      this.correctAnswerExist = true;
      return true;
    }
    return false;
  }

  private drawOffset(): number {
    return Math.round(Math.random() * 500);
  }

  private resetState(): void {
    this.correctAnswerExist = false;
    this.counter = 0;
  }
}