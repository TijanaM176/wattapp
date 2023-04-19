import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { UsersServiceService } from 'src/app/services/users-service.service';

@Component({
  selector: 'app-user-info-gauge',
  templateUrl: './user-info-gauge.component.html',
  styleUrls: ['./user-info-gauge.component.css']
})
export class UserInfoGaugeComponent implements OnInit, AfterViewInit {
  
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF414E', '#80BC00'],
  };
  id : string = '';
  consumption = 0;
  production = 0;
  data : number = 0;
  gaugeLabel = "Consumption";
  gaugeAppendText = "kW";
  width : number = 250;
  showLegend : boolean = true;

  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute,
    private widthService : ScreenWidthService
  ) {}

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.id = this.router.snapshot.params['id'];
    document.getElementById('userInfoGaugeChart')!.style.height = (this.widthService.height*0.5) + 'px';
    this.width = document.getElementById('userInfoGaugeChartCardBody')!.offsetWidth*0.7;
    this.getMonthsConsumptionAndProduction();
  }

  getMonthsConsumptionAndProduction()
  {
    this.service.ThisMonthsConsumptionAndProductionForProsumer(this.id)
    .subscribe({
      next:(res)=>{
        this.consumption = res.consumption.toFixed(1);
        this.production = res.production.toFixed(1);
        this.data = this.consumption
        // this.text = `Consumption: ${this.consumption} kW`;
        // this.data = [
        //   {
        //     "name": "consumption",
        //     "value": res.consumption
        //   },
        //   {
        //     "name": "production",
        //     "value": res.production
        //   }
        // ];
      }
    })
  }
}
