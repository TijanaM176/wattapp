import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  baseUrl = "https://localhost:7242/api/games"
  constructor(private http: HttpClient) { 

  }

  getAllGames() : Observable<Game[]>{
    return this.http.get<Game[]>(this.baseUrl);
  }

  addGame(game: Game) : Observable<Game>{
    game.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<Game>(this.baseUrl, game);
  }

  updateGame(game: Game) : Observable<Game>
  {
    return this.http.put<Game>(this.baseUrl + "/" + game.id, game);
  }

  deleteGame(id: string) : Observable<Game>
  {
    return this.http.delete<Game>(this.baseUrl + "/" + id);
  }
}
