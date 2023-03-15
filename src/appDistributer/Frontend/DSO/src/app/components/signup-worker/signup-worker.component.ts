import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-worker',
  templateUrl: './signup-worker.component.html',
  styleUrls: ['./signup-worker.component.css']
})
export class SignupWorkerComponent  implements OnInit{
  signupWorkerForm!:FormGroup;
  constructor(private fb:FormBuilder,private router : Router){}
  ngOnInit(): void {
    this.signupWorkerForm=this.fb.group({
      Firstname:['',Validators.required],
      Lastname:['',Validators.required],
      Password:['',Validators.required],
      Address:['',Validators.required],
      Salary:['',Validators.required],
      Image:['',Validators.required]
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
    //this.submitted = true;
    //if(this.singupForm.invalid){
      //return;
    //}else if(this.singupForm.valid){
      //this.router.navigate(['home']);
    //}
    
  }
}
