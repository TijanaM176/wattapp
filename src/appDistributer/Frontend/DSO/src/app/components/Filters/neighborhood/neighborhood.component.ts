import { Component, OnInit } from '@angular/core';
import { Neighborhood } from 'src/app/models/neighborhood';
import { Prosumer } from 'src/app/models/userstable';
import { UsersServiceService } from 'src/app/services/users-service.service';

@Component({
  selector: 'app-neighborhood',
  templateUrl: './neighborhood.component.html',
  styleUrls: ['./neighborhood.component.css'],
})
export class NeighborhoodComponent implements OnInit {
  constructor(private userService: UsersServiceService) {}
  neighborhood: string = '';
  Neighborhoods: Neighborhood[] = [];
  dropDownNeigh: string = '';
  prosumers: Prosumer[] = [];
  ChangeNeighborhood(e: any) {
    this.dropDownNeigh = e.target.value;
    this.userService
      .GetProsumersByNeighborhoodId(this.dropDownNeigh)
      .subscribe((response) => {
        console.log(response);
        this.prosumers = response;
        console.log(this.prosumers);
      });
  }

  ngOnInit() {
    this.userService.getAllNeighborhoods().subscribe((response) => {
      this.Neighborhoods = response;
    });
  }
}
