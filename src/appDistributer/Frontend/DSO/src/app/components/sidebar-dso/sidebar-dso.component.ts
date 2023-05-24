import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { UserDevicesComponent } from '../UserDevices/UserDevices.component';

@Component({
  selector: 'app-sidebar-dso',
  templateUrl: './sidebar-dso.component.html',
  styleUrls: ['./sidebar-dso.component.css'],
})
export class SidebarDsoComponent implements OnInit {
  id: string = '';
  letValue: string = '';
  ime: string = '';
  adresa: string = '';
  constructor(
    private user: UsersServiceService,
    private router: ActivatedRoute,
    private cookie: CookieService,
    private rut: Router,
    private r: Router
  ) {}

  ngOnInit(): void {
    this.letValue = localStorage.getItem('role')!;
    this.id = this.router.snapshot.params['id'];
  }
  Devices() {
    this.rut.navigate(['app-UserDevices']);
  }
  DeleteUser() {
    //console.log(this.router.snapshot.params['id']);
    this.user.deleteUser(this.router.snapshot.params['id']).subscribe({
      next: (res) => {
        // console.log(res);
        this.r.navigate(['/DsoApp/users']);
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }
  populate(username: string, adresa: string) {
    this.ime = username;
    this.adresa = adresa;
  }
}
