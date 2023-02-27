import { Component, OnInit } from '@angular/core';
import { GamesService } from './services/games.service';
import { BooksService } from './services/books.service';
import { Game } from './models/game.model';
import { Book } from './models/book.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'front';
  games: Game[] = [];
  books: Book[] = [];
  game : Game = {
    id: "",
    name: "",
    developer: "",
    genre: "",
    description: "",
    price: 0
  }
  gameU : Game = {
    id: "",
    name: "",
    developer: "",
    genre: "",
    description: "",
    price: 0
  }
  book : Book = {
    id: "",
    title: "",
    author: "",
    genre: "",
    description: "",
    price: 0
  }

  constructor(private gamesService: GamesService, private booksService: BooksService){

  }
  ngOnInit(): void {
    this.getGames();
    this.getBooks();
  }

  getGames(){
    this.gamesService.getAllGames().subscribe(response => {
      this.games = response;
    });
  }

  getBooks(){
    this.booksService.getAllBooks().subscribe(response => {
      this.books = response;
    })
  }

  addGame(){
    this.gamesService.addGame(this.game).subscribe( response =>{
      this.getGames();
      this.game = {
        id: "",
        name: "",
        developer: "",
        genre: "",
        description: "",
        price: 0
      }
    })
  }

  updateGame(){
    this.gamesService.updateGame(this.gameU).subscribe(response => {
      this.getGames();
      this.gameU = {
        id: "",
        name: "",
        developer: "",
        genre: "",
        description: "",
        price: 0
      }
    })
  }

  deleteGame(id: string)
  {
    this.gamesService.deleteGame(id).subscribe(response =>{
      this.getGames();
      this.game = {
        id: "",
        name: "",
        developer: "",
        genre: "",
        description: "",
        price: 0
      }
    });
  }
}
