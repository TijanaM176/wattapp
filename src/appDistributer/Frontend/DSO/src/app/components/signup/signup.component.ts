import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  type:string="password";
  isText:boolean=false;
  eyeIcon: string = "fa-eye-slash";
  imageUrl:string="/assets/images/default-image.png";

  signupForm!:FormGroup;
  constructor(private fb:FormBuilder,private auth : AuthService,private router:Router){}
  ngOnInit(): void {
    this.signupForm=this.fb.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      password:['',Validators.required],
      email:['',Validators.required],
      address:['',Validators.required],
      image:['',Validators.required],
    })
  }
  /*
  handleFileInput(event:any){
    
    if(event.target.files[0]){
      let reader=new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event:any)=>{
        this.imageUrl=event.target.result;
      }
    }
  }
  */
  hideShowPass(){
    this.isText=!this.isText;
    this.isText? this.eyeIcon="fa-eye":this.eyeIcon="fa-eye-slash";
    this.isText? this.type="text":this.type="password";

  }
  get fields(){
    return this.signupForm.controls;
  }
  
  onSignUp(){
    if(this.signupForm.valid){
      this.auth.signUp(this.signupForm.value)
      .subscribe({
        next:(res=>{
          alert(res);
          this.signupForm.reset();
          this.router.navigate(['']);
        })
        ,error:(err=>{
          alert(err?.error)
        })
      })
      console.log(this.signupForm.value);
    }
    else{
      this.validateAllFormFields(this.signupForm)
    }
  }
  private validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
      const control=formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true});
      }
      else if(control instanceof FormGroup){
        this.validateAllFormFields(control)
      }
    })
  }
  
}
