import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.css'],
})
export class PocetnaComponent implements OnInit {
  data: any;
  price: any;
  percentagesChange: any;
  sign: any;
  loader: boolean = true;
  constructor(private service: UsersServiceService) {}

  ngOnInit() {
    this.service.ElectricityPrice().subscribe((response) => {
      this.data = response;
      this.price = this.data.Price;
      this.percentagesChange = this.data.Percentage;
      this.sign = Math.sign(this.percentagesChange);
    });
    setTimeout(() => {
      this.loader = false;
    }, 6000);
  }
}
