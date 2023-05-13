import {
  Component,
  OnInit,
  HostListener,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  deviceWidth!: number;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  content: any;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private auth: AuthServiceService,
    private toast: ToastrService,
    private widthService: DeviceWidthService
  ) {}

  ngOnInit(): void {
    this.widthService.deviceWidth = window.innerWidth;
    this.deviceWidth = this.widthService.deviceWidth;
    const content = document.getElementById('content');
    if (window.innerWidth <= 250) {
      let height = window.innerHeight - 104.69;
      this.widthService.height = height;
      content!.style.height = height + 'px';
    } else {
      let height = window.innerHeight - 65.09;
      this.widthService.height = height;
      content!.style.height = height + 'px';
    }

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.widthService.deviceWidth = window.innerWidth;
      this.deviceWidth = this.widthService.deviceWidth;
      if (window.innerWidth <= 250) {
        let height = window.innerHeight - 104.69;
        this.widthService.height = height;
        content!.style.height = height + 'px';
      } else {
        let height = window.innerHeight - 65.09;
        this.widthService.height = height;
        content!.style.height = height + 'px';
      }
    });
  }

  ngAfterViewInit(): void {
    const content = document.getElementById('content');
    content!.style.height = this.widthService.height + 'px';
  }

  ngOnDestroy(): void {
    this.resizeSubscription$.unsubscribe();
  }
}
