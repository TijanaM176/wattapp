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
    private location1: Location
  ) {}

  ngAfterViewInit(): void {
    this.showModal = false;
  }

  ngOnInit(): void {}

  LogOut() {
    this.cookie.deleteAll();
    this.router.navigate(['login']);
  }
}
