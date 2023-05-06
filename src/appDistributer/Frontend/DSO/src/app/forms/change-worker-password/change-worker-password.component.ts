import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { editEmployeeDto } from 'src/app/models/editEmployee';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-change-worker-password',
  templateUrl: './change-worker-password.component.html',
  styleUrls: ['./change-worker-password.component.css']
})
export class ChangeWorkerPasswordComponent {

  constructor(private cookie : CookieService,
    private router : Router,
    private employeeService : EmployeesServiceService,
    
  ) {}

  currentPass : string =''
  newPass : string = ''
  confirmNewPass : string = ''

  failure : boolean = false;
  success : boolean = false;
  dontMatch : boolean = false;
  incorrectCurrent : boolean = false;
  empty : boolean = false;

  changePassword()
  {
    if(this.newPass =="" || this.confirmNewPass =="" || this.currentPass=="") // || this.currentPass==""
    {
      this.allToFalse();
      this.empty = true;
    }
    else if(this.newPass != this.confirmNewPass)
    {
      this.allToFalse();
      this.dontMatch = true;
    }
    else
    {
      let dto : editEmployeeDto = new editEmployeeDto();
      dto.password = this.newPass;
      // dto.newPassword = this.newPass;
      // dto.oldPassword = this.currentPass;
      this.employeeService.updateEmployee(this.cookie.get('id'), dto)
      .subscribe({
        next:(res)=>{
          this.allToFalse();
          this.success = true;
          setTimeout(()=>{
            document.getElementById('closeChangePassOnSuccess')!.click();
            this.cookie.deleteAll('/');
            this.router.navigate(['login']);
          },700)
        },
        error:(err)=>{
          console.log(err.error);
        }
      })
    }
  }
  private allToFalse()
  {
    this.failure = false;
    this.success = false;
    this.dontMatch = false;
    this.incorrectCurrent = false;
    this.empty = false;
  }
}
