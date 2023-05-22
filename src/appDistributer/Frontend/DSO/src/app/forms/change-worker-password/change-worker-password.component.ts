import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { editEmployeeDto } from 'src/app/models/editEmployee';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-change-worker-password',
  templateUrl: './change-worker-password.component.html',
  styleUrls: ['./change-worker-password.component.css'],
})
export class ChangeWorkerPasswordComponent {
  constructor(
    private cookie: CookieService,
    private router: Router,
    private employeeService: EmployeesServiceService
  ) {}

  currentPass: string = '';
  newPass: string = '';
  confirmNewPass: string = '';

  failure: boolean = false;
  success: boolean = false;
  dontMatch: boolean = false;
  incorrectCurrent: boolean = false;
  empty: boolean = false;

  changePassword() {
    if (
      this.newPass == '' ||
      this.confirmNewPass == '' ||
      this.currentPass == ''
    ) {
      this.allToFalse();
      this.empty = true;
    } 
    else if (this.newPass != this.confirmNewPass) {
      this.allToFalse();
      this.dontMatch = true;
    } 
    else {
      this.employeeService
        .changePassword(localStorage.getItem('id')!, this.currentPass,this.newPass)
        .subscribe({
          next: (res) => {
            this.allToFalse();
            this.success = true;
            setTimeout(() => {
              document.getElementById('closeChangePassOnSuccess')!.click();
              this.cookie.delete('token', '/');
              this.cookie.delete('refresh', '/');
              localStorage.removeItem('region');
              localStorage.removeItem('lat');
              localStorage.removeItem('long');
              localStorage.removeItem('username');
              localStorage.removeItem('role');
              localStorage.removeItem('id');
              this.router.navigate(['login']);
            }, 700);
          },
          error: (err) => {
            console.log(err.error);
            this.failure = true;
          },
        });
    }
  }
  private allToFalse() {
    this.failure = false;
    this.success = false;
    this.dontMatch = false;
    this.incorrectCurrent = false;
    this.empty = false;
  }
}
