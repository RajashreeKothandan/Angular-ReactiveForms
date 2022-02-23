import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators, AbstractControl, ValidatorFn} from '@angular/forms';

import { Customer } from './customer';
function rateCheck(min:number,max:number):ValidatorFn{
  return(c:AbstractControl):{[Key:string]:boolean}|null=>{
    if(c.value ==null||(c.value<min ||c.value>max))
    return {invalidRate:true};
    return null;
  }

}
function matchEmail(c:AbstractControl):{[key:string]:boolean}|null{
  const email=c.get('email');
  const confirmEmail=c.get('confirmEmail');
  if(email?.pristine || confirmEmail?.pristine){
    return null;
  }
  if(email?.value===confirmEmail?.value){
    return null;
  }
  return {matchEmail:true}

}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm!:FormGroup;
  customer = new Customer();

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.customerForm=this.fb.group({
      firstName:["",[Validators.required,Validators.minLength(3)]],
      lastName:["",[Validators.required,Validators.maxLength(50)]],
      emailGroup:this.fb.group({
        email:["",[Validators.required,Validators.email]],
        confirmEmail:["",[Validators.required,Validators.email]],
      },{validator:matchEmail}),
      
      phone:"",
      notification:"email",
      rating:[null,rateCheck(0,5)],
      sendCatalog:true
    });
  }
 setNotification(notifyVia:string):void{
   const phoneNumber=this.customerForm.get('phone');
   if(notifyVia=='text'){
     phoneNumber?.setValidators(Validators.required);
   }
   else
   {
     phoneNumber?.clearValidators();
   }
   phoneNumber?.updateValueAndValidity();
 }
  save(){}
}
