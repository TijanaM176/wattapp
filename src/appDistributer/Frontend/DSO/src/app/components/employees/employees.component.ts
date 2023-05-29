import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { editEmployeeDto } from 'src/app/models/editEmployee';
import { DataService } from 'src/app/services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SendPhoto } from 'src/app/models/sendPhoto';
import { ProfilePictureServiceService } from 'src/app/services/profile-picture-service.service';
import { SendRefreshToken } from 'src/app/models/sendRefreshToken';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import { NewEmployeeAddedService } from 'src/app/services/new-employee-added.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent {
  searchName: string = '';
  employees: any;
  employee: any;
  total!: number;
  perPage: number = 10;
  pagenum!: number;
  page: number = 1;
  show: boolean = false;
  orderHeader: String = '';
  isDescOrder: boolean = true;
  public regionName: any;
  public roleName: any;
  firstName: any;
  lastName: any;
  salary: any;
  email: any;
  dateCreate: any;
  password: any = '';
  Role: any;
  Region: any;
  role: any;
  region: any;
  roleId!: number;
  regionId!: string;
  username!: string;
  currentRoute!: string;
  id!: string;
  searchLastName!: string;
  imageSource!: any;
  imageSource1!: any;
  showDetails: boolean = false;
  imgChangeEvet: any = '';
  croppedImage: any = '';
  currentImage: string = 'assets/images/defaultWorker.png';
  selectedImageFile: any = null;
  fileType: any = '';
  errorDeletePhoto: boolean = false;
  updatedPhotoSuccess: boolean = false;
  updatedPhotoError: boolean = false;
  noFile: boolean = false;

  constructor(
    public service: EmployeesServiceService,
    private router: Router,
    private cookie: CookieService,
    public serviceData: DataService,
    private _sanitizer: DomSanitizer,
    public toast: ToastrService,
    private profilePhotoService: ProfilePictureServiceService,
    private auth: AuthService,
    private newEmplSer : NewEmployeeAddedService
  ) {}

  ngOnInit(): void {
    this.Ucitaj();
    if(this.newEmplSer.isAdded)
    {
      this.Details(this.newEmplSer.newEmplId);
      this.newEmplSer.reset();
    }
    this.Paging();
    this.regionName = localStorage.getItem('region');
    this.profilePhotoService.profilePhoto$.subscribe((picture: string) => {
      // Update the component's picture data
      this.imageSource1 = picture;
      this.Ucitaj();
    });
  }

  Ucitaj() {
    this.service.getAllData();
    this.employees = this.service.employees;
  }
  Image(image: any) {
    this.imageSource = 'assets/images/defaultWorker.png';
    if (image != '' && image != null) {
      let byteArray = new Uint8Array(
        atob(image)
          .split('')
          .map((char) => char.charCodeAt(0))
      );
      let file = new Blob([byteArray], { type: 'image/png' });
      this.imageSource = URL.createObjectURL(file);
    }
    return this.imageSource;
  }
  Paging() {
    this.service.Page(this.page, this.perPage).subscribe((res) => {
      this.employees = res;
    });
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.Paging();
  }

  Details(id: string) {
    this.showDetails = true;
    this.service.idEmp = id;
    
    this.service.detailsEmployee(id).subscribe((res) => {
      this.employee = res;
      this.id = res.id;
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      this.username = res.userName;
      this.salary = res.salary;
      this.dateCreate = res.prosumerCreationDate;
      this.email = res.email;
      this.role = res.roleId;
      this.region = res.regionId;
      this.Image1(res.image);

      this.serviceData.getRoleName(this.employee.roleId).subscribe((res) => {
        this.roleName = res;
      });
    });
    const buttonRef = document.getElementById('closeBtn3');
    buttonRef?.click();
  }
  Image1(image: any) {
    this.imageSource1 = 'assets/images/defaultWorker.png';
    if (image != '' && image != null) {
      let byteArray = new Uint8Array(
        atob(image)
          .split('')
          .map((char) => char.charCodeAt(0))
      );
      let file = new Blob([byteArray], { type: 'image/png' });
      this.imageSource1 = URL.createObjectURL(file);
    }
  }
  closeside() {
    this.showDetails = false;
  }
  close() {}
  ChangeRegion(e: any) {}
  getAllRegions() {
    this.serviceData.getAllRegions().subscribe({
      next: (res) => {
        this.Region = res;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }
  ChangeRole(e: any) {}
  getAllRoles() {
    this.serviceData.getAllRoles().subscribe({
      next: (res) => {
        this.Role = res.filter((item) => item.roleName != 'Prosumer');
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  update(id: string) {
    this.getAllRoles();
    const buttonRef = document.getElementById('closeBtn');
    buttonRef?.click();
  }
  onUpdate(id: string) {
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

        //update-ovanje korisnika
        let dto: editEmployeeDto = new editEmployeeDto();
        dto.firstName = this.firstName;
        dto.lastName = this.lastName;
        dto.salary = this.salary;
        dto.regionId = this.region;
        dto.roleId = this.role;
        dto.email = this.email;
        // console.log(dto);
        this.service.updateEmployee(id, dto).subscribe((res) => {
          this.Ucitaj();
          this.Paging();
        });
        this.currentRoute = this.router.url;
        this.router
          .navigateByUrl('/DsoApp/home', { skipLocationChange: true })
          .then(() => {
            this.router.navigate([this.currentRoute]);
          });
        const buttonRef = document.getElementById('closeBtn1');
        buttonRef?.click();
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
              this.router.navigate(['login']);
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
              this.router.navigate(['login']);
            },
          });
      },
    });
  }

  onDelete(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Confirm you want to delete this employee',
      icon: 'question',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#466471',
      cancelButtonColor: '#8d021f',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result: any) => {
      if (result.value) {
        let refreshDto = new SendRefreshToken(
          this.cookie.get('refresh'),
          localStorage.getItem('username')!,
          localStorage.getItem('role')!
        );
        this.auth.refreshToken(refreshDto).subscribe({
          next: (data) => {
            this.cookie.delete('token', '/');
            this.cookie.delete('refresh', '/');
            this.cookie.set('token', data.token.toString().trim(), {
              path: '/',
            });
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

            //brisanje korisnika
            this.service.deleteEmployee(id).subscribe({
              next: (res) => {
                this.Ucitaj();
                this.Paging();
                this.closeside();
              },
              error: (err) => {
                console.log(err.error);
              },
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
                  this.router.navigate(['login']);
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
                  this.router.navigate(['login']);
                },
              });
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Action when Cancel button is clicked
      }
    });
  }
  sort(headerName: String) {
    this.isDescOrder = !this.isDescOrder;
    this.orderHeader = headerName;
  }
  openChangePhoto() {
    this.resetAll();
    document.getElementById('openChangePhotoWorker')!.click();
  }
  closeChange() {
    document.getElementById('openWorkerAgain')!.click();
    this.resetAll();
  }
  confirmNewPhoto() {
    this.updatedPhotoError = false;
    this.updatedPhotoSuccess = false;
    this.noFile = false;
    if (this.selectedImageFile != null) {
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

          //izmena slike
          this.croppedImage = this.croppedImage.replace(
            'data:image/png;base64,',
            ''
          );
          // console.log(this.croppedImage);

          let sp = new SendPhoto(this.id, this.croppedImage);

          this.service.updateProfilePhoto(this.id, sp).subscribe({
            next: (res) => {
              this.updatedPhotoSuccess = true;
              setTimeout(() => {
                this.Image1(this.croppedImage);
                this.Image(this.croppedImage);
                console.log(this.id);
                if (this.id == localStorage.getItem('id')!) {
                  this.profilePhotoService.updateProfilePhoto(
                    this.Image(this.croppedImage)
                  );
                }
                this.Ucitaj();
                document.getElementById('closeCropImagePhotoUpdated1')!.click();
                this.closeChange();
              }, 700);
            },
            error: (err) => {
              this.toast.error('Unable to update photo', 'Error!', {
                timeOut: 3000,
              });
              // this.updatedPhotoError = true;
              document.getElementById('closeCropImagePhotoUpdated1')!.click();
              this.closeChange();
              console.log(err.error);
            },
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
                this.router.navigate(['login']);
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
                this.router.navigate(['login']);
              },
            });
        },
      });
    } else {
      this.noFile = true;
    }
  }
  deleteImage() {
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

        //brisanje profilne slike
        this.errorDeletePhoto = false;
        this.service.deleteProfilePhoto(this.id).subscribe({
          next: (res) => {
            this.imageSource = 'assets/images/defaultWorker.png';
            this.imageSource1 = 'assets/images/defaultWorker.png';
            this.Ucitaj();
            this.profilePhotoService.updateProfilePhoto(this.imageSource);

            document.getElementById('closeOptionsForPhoto1')!.click();
          },
          error: (err) => {
            this.errorDeletePhoto = true;
            console.log(err.error);
          },
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
              this.router.navigate(['login']);
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
              this.router.navigate(['login']);
            },
          });
      },
    });
  }
  onFileSelected(event: any) {
    this.imgChangeEvet = event;
    if (event.target.files) {
      this.selectedImageFile = event.target.files[0];
      this.fileType = event.target.files[0].type;
      // this.changeImage = this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.selectedImageFile)) as string;
    }
  }
  cropImg(e: ImageCroppedEvent) {
    this.croppedImage = e.base64;
  }
  openCrop() {
    document.getElementById('openCropImageBtn1')!.click();
  }
  private resetAll() {
    this.errorDeletePhoto = false;
    this.selectedImageFile = null;
    this.imgChangeEvet = '';
    this.updatedPhotoError = false;
    this.updatedPhotoSuccess = false;
    this.noFile = false;
  }
}
