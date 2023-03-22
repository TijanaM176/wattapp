import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-signup-worker',
  templateUrl: './signup-worker.component.html',
  styleUrls: ['./signup-worker.component.css']
})
export class SignupWorkerComponent  implements OnInit{
  signupWorkerForm!:FormGroup;
  constructor(private fb:FormBuilder,private router : Router,private auth:AuthService){}
  ngOnInit(): void {
    this.signupWorkerForm=this.fb.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      password:['',Validators.required],
      email:['',Validators.required],
      // address:['',Validators.required],
      salary:['',Validators.required],
      image:['',Validators.required]
    })
  }
  get fields(){
    return this.signupWorkerForm.controls;
  }
  onSignUp(){
    if(this.signupWorkerForm.valid){
      console.log(this.signupWorkerForm.value);
    }
    else{
      this.validateAllFormFields(this.signupWorkerForm)
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
  onSubmit(){
    if(this.signupWorkerForm.valid){
      this.auth. signupWorker(this.signupWorkerForm.value)
      .subscribe({
        next:(res=>{
          alert(res);
          this.signupWorkerForm.reset();
          this.router.navigate(['']);
        })
        ,error:(err=>{
          alert(err?.error)
        })
      })
      console.log(this.signupWorkerForm.value);
    }
    else{
      this.validateAllFormFields(this.signupWorkerForm)
    }
  }
    
  
}
