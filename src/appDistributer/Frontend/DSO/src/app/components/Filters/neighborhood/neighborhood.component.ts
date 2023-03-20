import { Component, OnInit } from '@angular/core';
import { Neighborhood } from 'src/app/models/neighborhood';
import { UsersServiceService } from 'src/app/services/users-service.service';

@Component({
  selector: 'app-neighborhood',
  templateUrl: './neighborhood.component.html',
  styleUrls: ['./neighborhood.component.css'],
})
export class NeighborhoodComponent implements OnInit {
  Neighborhoods: Neighborhood[] = [];

  constructor(private userService: UsersServiceService) {}

  ngOnInit() {
    this.userService.getAllNeighborhoods().subscribe((response) => {
      this.Neighborhoods = response;
    });
  }
}
