import { Component, OnInit } from '@angular/core';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-Pocetna',
  templateUrl: './Pocetna.component.html',
  styleUrls: ['./Pocetna.component.css']
})
export class PocetnaComponent implements OnInit {

  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  constructor(private widthService : DeviceWidthService) { }

  ngOnInit() {

    const homeCont = document.getElementById('homeCont');
    homeCont!.style.height = this.widthService.height + 'px';

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      homeCont!.style.height = this.widthService.height + 'px';
    })
  }

}
