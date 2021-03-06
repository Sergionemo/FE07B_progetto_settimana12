import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Favoriti } from '../models/favoriti';
import { Movie } from '../models/movie';

@Component({
  template: `
    <div class="d-flex flex-wrap">
      <mat-card
        class="example-card"
        class="m-2"
        *ngFor="let movie of movies; let i = index"
      >
        <mat-card-header>
          <div mat-card-avatar class="example-header-image"></div>
          <mat-card-title>{{ movie.title }}</mat-card-title>
        </mat-card-header>
        <img
          mat-card-image
          src="{{ url + movie.poster_path }}"
          alt="foto film"
        />
        <mat-card-actions class="d-flex">
          <button mat-icon-button>
            <mat-icon
              [color]="movie.id === favorites.movieId? 'primary':''"
              (click)="
                confrontaFilm(movie.id)
              "
              >favorite</mat-icon
            >
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .example-card {
        max-width: 300px;
      }
      .centra {
        height: 16px;
      }
      .active {
        color: red;
      }
    `,
  ],
})
export class FilmPage implements OnInit {
  constructor(private mainSrv: MainService) {}

  url: string = 'http://image.tmdb.org/t/p/w500';
  movies: Movie[] = [];
  user!: any;
  favorites: any;
  daRimuovere!: any;
  // isIn: number = 0;
  // arrMov: { movie: Movie; idFav?: number }[] = [];

  async ngOnInit() {
    this.user = await this.mainSrv.getUtente()?.toPromise();
    this.movies = await this.mainSrv.getAllMovie().toPromise();
    this.favorites = await this.mainSrv.findFav(this.user.id).toPromise();
  }

  async aggiungi(id: number) {
    await this.mainSrv
      .addFav({ movieId: id, userId: this.user.id })
      .toPromise();
  }

  async confrontaFilm(id: number) {
    this.favorites = await this.mainSrv.findFav(this.user.id).toPromise();
    const found = this.favorites.find((film: any) => film.movieId == id);
    console.log(found);

    if (found === undefined) {
      this.aggiungi(id)
    }
    else {
      this.rimuovi(found.id)
    }
  }

  async rimuovi(id: number) {
    await this.mainSrv.removeFav(id).toPromise();
  }
}
