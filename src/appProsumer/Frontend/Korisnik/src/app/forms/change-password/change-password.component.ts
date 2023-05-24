import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EditDto } from 'src/app/models/editDto';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ProsumerService } from 'src/app/services/prosumer.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit{

  currentPass : string =''
  newPass : string = ''
  confirmNewPass : string = ''

  failure : boolean = false;
  success : boolean = false;
  dontMatch : boolean = false;
  incorrectCurrent : boolean = false;
  empty : boolean = false; 

  constructor(
    private userService : ProsumerService, 
    private cookie : CookieService, 
    private router : Router,
    private auth : AuthServiceService
    ) {}

  ngOnInit(): void {
    this.allToFalse();
  }

  changePass()
  {
    if(this.newPass =="" || this.confirmNewPass =="" || this.currentPass=="")
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
      let dto : EditDto = new EditDto();
      dto.newPassword = this.newPass;
      dto.oldPassword = this.currentPass;

      let id = localStorage.getItem('idProsumer')!;
      this.userService.editInfo(id, dto)
      .subscribe({
        next:(res)=>{
          this.allToFalse();
          this.success = true;

          this.auth.logout()
          .subscribe({
            next:(res)=>{
              setTimeout(()=>{
                document.getElementById('closeChangePassOnSuccess')!.click();
                this.cookie.delete('tokenProsumer','/');
                this.cookie.delete('refreshProsumer','/');
                localStorage.removeItem('usernameProsumer');
                localStorage.removeItem('roleProsumer');
                localStorage.removeItem('idProsumer');
                this.router.navigate(['login']);
              },500)
            },
            error:(err)=>{
              setTimeout(()=>{
                document.getElementById('closeChangePassOnSuccess')!.click();
                this.cookie.delete('tokenProsumer','/');
                this.cookie.delete('refreshProsumer','/');
                localStorage.removeItem('usernameProsumer');
                localStorage.removeItem('roleProsumer');
                localStorage.removeItem('idProsumer');
                this.router.navigate(['login']);
              },500)
            }
          });
        },
        error:(err)=>{
          this.allToFalse();
          console.log(err.error);
          this.failure = true;
        }
      });
    }
  }

  reset()
  {
    this.currentPass = '';
    this.newPass = '';
    this.confirmNewPass = '';
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
