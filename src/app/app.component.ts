import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Pokemon } from './interfaces/pokemon.interface';
import { Response } from './interfaces/response.interface';
import { PokemonService } from './services/pokemon.service';
import { Destroyable } from './shared/destroyable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends Destroyable implements OnInit {
  public response: Response;
  public answerStatus: number = 0; // 0 - none / 1 - correct / 2 - incorrect
  public answerClicked: boolean = false;
  public nextPokemonClicked: boolean = false;

  constructor(private pokemonService: PokemonService) {
    super();
  }

  ngOnInit(): void {
    this.loadQuiz();
  }

  private loadQuiz() {
    this.pokemonService.fetchPokemons()
    .pipe(takeUntil(this.destroyed$))
    .subscribe((res: any) => {
      this.response = res;
      this.resetState();
    });
  }

  public clickAnswer(pokemon: Pokemon): void {
    this.answerClicked = true;
    pokemon.status = true;
    setTimeout(() => {
      pokemon.correctAnswer === true ? this.answerStatus = 1 : this.answerStatus = 2
    }, 1000);
  }

  public nextPokemon(): void {
    this.nextPokemonClicked = true;
    setTimeout(() => {
      this.loadQuiz();
    }, 500);
  }

  private resetState(): void {
    this.answerStatus = 0;
    this.answerClicked = false;
    this.nextPokemonClicked = false;
  }
}