import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { City } from 'src/app/models/city';
import { editUserDto } from 'src/app/models/editUserDto';
import { Neighborhood } from 'src/app/models/neighborhood';
import { SendRefreshToken } from 'src/app/models/sendRefreshToken';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { UsersServiceService } from 'src/app/services/users-service.service';
import jwt_decode from 'jwt-decode';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-prosumer-form',
  templateUrl: './edit-prosumer-form.component.html',
  styleUrls: ['./edit-prosumer-form.component.css']
})
export class EditProsumerFormComponent implements OnInit {

  id : string = '';

  cities: City[] = [];
  cityId: number = -1;
  cityName: string = '';

  neighborhoods: Neighborhood[] = [];
  neighId : string = '';
  neighName: string = '';

  address : string = '';

  oldAddress : string = '';
  newAddress : string = '';

  editUser = new FormGroup({
    FirstName: new FormControl(''),
    LastName: new FormControl(''),
    Email: new FormControl(''),
    Address: new FormControl(''),
    NeigborhoodName: new FormControl(''),
    Latitude: new FormControl(''),
    Longitude: new FormControl(''),
    CityName: new FormControl(''),
  });

  userOldInfo: any;
  userNewInfo : any;

  constructor(
    private serviceData: DataService,
    private user: UsersServiceService,
    private cookie: CookieService,
    private auth: AuthService,
    private toast: ToastrService,
    private r: Router,
    private router: ActivatedRoute,
  ){}

  ngOnInit(): void {
    
  }

  UpdateData() {
    this.newAddress = this.editUser.value.Address!.trim()+','+this.editUser.value.CityName!.trim()+',Serbia';
    if(this.oldAddress === this.newAddress)
    {
      this.noChangeInAddress();
    }
    else
    {
      this.newAddress = this.newAddress.replaceAll('dj', 'đ')
      this.changedAddress(this.newAddress);
    }
    // console.log(this.editUser.value);
    // console.log(this.newAddress);
  }
  getAllNeighborhoodById(e: any) {
    this.cityId = e.target.value;
    this.serviceData.getCityNameById(this.cityId).subscribe((response) => {
      this.cityName = response;
    });
    this.serviceData
      .getAllNeighborhoodByCityId(this.cityId)
      .subscribe((response) => {
        this.neighborhoods = response;
        this.neighName = '';
      });
  }
  getNeighId(e: any) {
    this.neighName = e.target.value;
    // console.log(this.neighName);
  }
  setIdData(id : string, data : any)
  {
    this.id = id;
    this.userOldInfo = data;
    this.loadData();
  }
  loadData()
  {
    this.cityId = this.userOldInfo.cityId;
    this.cityName = this.userOldInfo.cityName;
    this.neighId = this.userOldInfo.neigborhoodId;
    this.neighName = this.userOldInfo.neigborghoodName;
    this.address = this.userOldInfo.address;
    this.oldAddress = this.address+','+this.cityName+',Serbia';
    this.newAddress = this.address+','+this.cityName+',Serbia';

    this.editUser = new FormGroup({
      FirstName: new FormControl(this.userOldInfo.firstName),
      LastName: new FormControl(this.userOldInfo.lastName),
      Email: new FormControl(this.userOldInfo.email),
      Address: new FormControl(this.userOldInfo.address),
      NeigborhoodName: new FormControl(this.userOldInfo.neigborghoodName),
      Latitude: new FormControl(''),
      Longitude: new FormControl(''),
      CityName: new FormControl(this.userOldInfo.cityName),
    });
    // console.log(this.editUser.value)

    this.serviceData.getAllCities().subscribe((response) => {
      this.cities = response;
      
    });
    this.serviceData
      .getAllNeighborhoodByCityId(this.cityId)
      .subscribe((response) => {
        this.neighborhoods = response;
      });
  }

  noChangeInAddress()
  {
    let refreshDto = new SendRefreshToken(
      this.cookie.get('refresh'),
      localStorage.getItem('username')!,
      localStorage.getItem('role')!
    );
    this.auth.refreshToken(refreshDto).subscribe({
      next: (data) => {
        this.cookie.delete('token', '/');
        this.cookie.delete('refresh', '/');
        this.cookie.set('token', data.token.toString().trim(), { path: '/' });
        this.cookie.set('refresh', data.refreshToken.toString().trim(), {
          path: '/',
        });

        //update podataka u localStorage
        let decodedToken: any = jwt_decode(data.token);
        localStorage.setItem('username', decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ].toString().trim());

        localStorage.setItem('role', decodedToken[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ].toString().trim());
          
        localStorage.setItem('id', decodedToken['sub'].toString().trim());

        //izmena podataka korisnika
        let dto: editUserDto = new editUserDto();
        dto.id = this.router.snapshot.params['id'];
        dto.firstName = this.editUser.value.FirstName!;
        dto.lastName = this.editUser.value.LastName!;
        dto.neigborhoodName = this.editUser.value.NeigborhoodName!;
        if (this.userOldInfo.email != this.editUser.value.Email) {
          dto.email = this.editUser.value.Email!;
        }

        this.user.updateUserData(dto.id, dto).subscribe((res) => {
          this.toast.success('Data successfully updated.', 'Success!', {timeOut:2500});

          document.getElementById('resetDataInFormForEdit')!.click();
        });
      },
      error: (err) => {
        this.auth
          .logout(localStorage.getItem('username')!, localStorage.getItem('role')!)
          .subscribe({
            next: (res) => {
              this.toast.error(err.error, 'Error!', { timeOut: 3000 });
              this.cookie.delete('token', '/');
              this.cookie.delete('refresh', '/');
              localStorage.removeItem('region');
              localStorage.removeItem('lat');
              localStorage.removeItem('long');
              localStorage.removeItem('username');
              localStorage.removeItem('role');
              localStorage.removeItem('id');
              this.r.navigate(['login']);
            },
            error: (error) => {
              console.log(error);
              this.toast.error('Unknown error occurred', 'Error!', {
                timeOut: 2500,
              });
              this.cookie.delete('token', '/');
              this.cookie.delete('refresh', '/');
              localStorage.removeItem('region');
              localStorage.removeItem('lat');
              localStorage.removeItem('long');
              localStorage.removeItem('username');
              localStorage.removeItem('role');
              localStorage.removeItem('id');
              this.r.navigate(['login']);
            },
          });
      },
    });
  }

  changedAddress(newAddress : string)
  {
    var key =
      'Ag6ud46b-3wa0h7jHMiUPgiylN_ZXKQtL6OWJpl6eVTUR5CnuwbUF7BYjwSA4nZ_';
    var url =
      'https://dev.virtualearth.net/REST/v1/Locations?query=' +
      encodeURIComponent(newAddress) +
      '&key=' + key;
      fetch(url)
      .then((response) => response.json())
      .then((data) => {
        var location =
          data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
        this.updateData(location);
      })
      .catch((error) => {
        this.toast.error('Error!', 'This address does not exist.', {
          timeOut: 2500,
        });
        console.error(`Error fetching location data: ${error}`);
      });
  }
  updateData(location : any)
  {
    let refreshDto = new SendRefreshToken(
      this.cookie.get('refresh'),
      localStorage.getItem('username')!,
      localStorage.getItem('role')!
    );
    this.auth.refreshToken(refreshDto).subscribe({
      next: (data) => {
        this.cookie.delete('token', '/');
        this.cookie.delete('refresh', '/');
        this.cookie.set('token', data.token.toString().trim(), { path: '/' });
        this.cookie.set('refresh', data.refreshToken.toString().trim(), {
          path: '/',
        });

        //update podataka u localStorage
        let decodedToken: any = jwt_decode(data.token);
        localStorage.setItem('username', decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ].toString().trim());

        localStorage.setItem('role', decodedToken[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ].toString().trim());
          
        localStorage.setItem('id', decodedToken['sub'].toString().trim());

        //izmena podataka korisnika
        let dto: editUserDto = new editUserDto();
        dto.id = this.router.snapshot.params['id'];
        dto.firstName = this.editUser.value.FirstName!;
        dto.lastName = this.editUser.value.LastName!;
        if (this.userOldInfo.email != this.editUser.value.Email) {
          dto.email = this.editUser.value.Email!;
        }
        dto.address = this.editUser.value.Address!;
        dto.cityName = this.editUser.value.CityName!;
        dto.neigborhoodName = this.editUser.value.NeigborhoodName!;
        dto.latitude = location[0].toString();
        dto.longitude = location[1].toString();
        this.user.updateUserData(dto.id, dto).subscribe((res) => {
          this.toast.success('Data successfully updated.', 'Success!', {timeOut:2500});

          document.getElementById('resetDataInFormForEdit')!.click();
        });
      },
      error: (err) => {
        this.auth
          .logout(localStorage.getItem('username')!, localStorage.getItem('role')!)
          .subscribe({
            next: (res) => {
              this.toast.error(err.error, 'Error!', { timeOut: 3000 });
              this.cookie.delete('token', '/');
              this.cookie.delete('refresh', '/');
              localStorage.removeItem('region');
              localStorage.removeItem('lat');
              localStorage.removeItem('long');
              localStorage.removeItem('username');
              localStorage.removeItem('role');
              localStorage.removeItem('id');
              this.r.navigate(['login']);
            },
            error: (error) => {
              console.log(error);
              this.toast.error('Unknown error occurred', 'Error!', {
                timeOut: 2500,
              });
              this.cookie.delete('token', '/');
              this.cookie.delete('refresh', '/');
              localStorage.removeItem('region');
              localStorage.removeItem('lat');
              localStorage.removeItem('long');
              localStorage.removeItem('username');
              localStorage.removeItem('role');
              localStorage.removeItem('id');
              this.r.navigate(['login']);
            },
          });
      },
    });
  }
}
