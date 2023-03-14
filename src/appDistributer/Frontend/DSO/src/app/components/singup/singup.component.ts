import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent  implements OnInit{
  singupForm!:FormGroup;
  constructor(private fb:FormBuilder,private router : Router){}
  ngOnInit(): void {
    this.singupForm=this.fb.group({
      name:['',Validators.required],
      username:['',Validators.required],
      email:['',Validators.required],
      address:['',Validators.required],
      neighborhood:['',Validators.required]
    })
  }
  get fields(){
    return this.singupForm.controls;
  }
  onSignUp(){
    if(this.singupForm.valid){
      console.log(this.singupForm.value);
    }
    else{
      this.validateAllFormFields(this.singupForm)
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
