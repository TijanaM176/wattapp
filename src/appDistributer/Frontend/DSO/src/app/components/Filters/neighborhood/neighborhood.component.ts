import { Component, OnInit } from '@angular/core';
import { Neighborhood } from 'src/app/models/neighborhood';
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
  ChangeNeighborhood(e: any) {
    this.dropDownNeigh = e.target.value;
    console.log(this.dropDownNeigh);
    if (this.dropDownNeigh == '') {
      this.userService.refreshList();
    } else {
      this.userService
        .GetProsumersByNeighborhoodId(this.dropDownNeigh)
        .subscribe((response) => {
          console.log(response);
          this.userService.prosumers = response;
        });
    }
  }

  ngOnInit() {
    this.userService.getAllNeighborhoods().subscribe((response) => {
      this.Neighborhoods = response;
    });
  }
}
