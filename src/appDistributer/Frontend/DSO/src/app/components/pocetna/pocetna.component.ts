import { Component, OnInit } from '@angular/core';
import { DashboarddataService } from 'src/app/services/dashboarddata.service';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.css'],
})
export class PocetnaComponent implements OnInit {
  totalCons: number = 0;
  ratioCons: string = '';
  ratioProd: string = '';
  totalProd: number = 0;
  nextCons: number = 0;
  nextProd: string = '';
  data: any;
  price: any = 0;
  percentagesChange: any;
  sign: any;
  loader: boolean = true;
  constructor(private servicedash: DashboarddataService) {}

  ngOnInit() {
    this.servicedash.ElectricityPrice().subscribe((response) => {
      this.data = response;
      this.price = this.data.Price;
      this.percentagesChange = this.data.Percentage;
      this.sign = Math.sign(this.percentagesChange);
    });
    this.servicedash.TotalCons().subscribe((response) => {
      this.totalCons = response.consumptionforToday;
      this.ratioCons = response.ratio;
    });
    this.servicedash.TotalProd().subscribe((response) => {
      this.totalProd = response.productionforToday;
      this.ratioProd = response.ratio;
    });
    this.servicedash.nextWeekTotal().subscribe((response) => {
      this.nextCons = response.predictedConsumptionforTomorrow;
      this.nextProd = response.ratio;
    });
  }
}
