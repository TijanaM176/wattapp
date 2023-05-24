import {
  AfterViewInit,
  Component,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Location } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { RegisterProsumerDto } from 'src/app/models/registerProsumerDto';
import { SetCoordsDto } from 'src/app/models/setCoordsDto';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { Neighborhood } from 'src/app/models/neighborhood';
import { City } from 'src/app/models/city';
import { DataService } from 'src/app/services/data.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  closeResult: string = '';
  users: any;
  showModal: boolean = false;
  currentCountry: string = '';
  validInput: boolean = false;
  loader: boolean = true;

  @ViewChild('exampleModal', { static: false }) modal!: ElementRef;
  @ViewChild('launchButton') launchButton!: ElementRef;

  neighName: string = '';
  cities: City[] = [];
  neighborhood: string = '';
  neighborhoods: Neighborhood[] = [];
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  latitude: string = '';
  longitude: string = '';
  NeighborhoodId: string = '';
  address: string = '';
  cityId: number = -1;
  cityName: string = '';

  signupForm!: FormGroup;
  signupFormValues!: FormGroup;
  showSpinner!:boolean;

  constructor(
    private cookie: CookieService,
    private serviceUser: UsersServiceService,
    public toast: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private serviceData: DataService,
    private service: UsersServiceService,
    private location1: Location,
    private spiner:NgxSpinnerService
  ) {}

  ngAfterViewInit(): void {
    this.showModal = false;
    this.spiner.hide();
  }

  ngOnInit(): void {
   this.spiner.show();
  }

  LogOut() {
    this.auth.logout(localStorage.getItem('username')!, localStorage.getItem('role')!)
    .subscribe({
      next: (res) => {
        this.cookie.delete('token', '/');
        this.cookie.delete('refresh', '/');
        localStorage.removeItem('region');
        localStorage.removeItem('lat');
        localStorage.removeItem('long');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        this.router.navigate(['login']);
      },
      error: (error) => {
        this.cookie.delete('token', '/');
        this.cookie.delete('refresh', '/');
        localStorage.removeItem('region');
        localStorage.removeItem('lat');
        localStorage.removeItem('long');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        this.router.navigate(['login']);
      },
    });
  }
}
