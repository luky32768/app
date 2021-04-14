import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';


import { OldPasswordValidators } from './oldpassword.validators';
@Component({
  selector: 'password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  userId: number;
  constructor(private route: ActivatedRoute, 
    private service: AuthService) { }

  ngOnInit() {
    this.userId = + this.route.snapshot.paramMap.get('id');
    // console.log(this.userId);
    console.log(this.service.isLoggedIn);
  }
  isLeaved = false;
  areMatching = false;
  connecting = false;
  response: string;
  formPassword = new FormGroup({
    oldPassword: new FormControl("",
      Validators.required
      // , 
      // OldPasswordValidators.isInvalid
    ),
    newPassword: new FormControl("",
      Validators.required
    ),
    
    confirmPassword: new FormControl("",
      Validators.required
        
      
    )
  });
  onBlur() {
    this.isLeaved = true;
  }
  logout() {
    this.service.logout();
  }
  changePassword(passwords) {
    this.connecting = true;
    console.log(passwords);
    this.service.changePassword(passwords, this.userId)
      .subscribe(response => {
        this.connecting = false;
        this.response = response;
        console.log(response);
      }) 
  }

  get oldPassword() {
    return this.formPassword.get("oldPassword");
  }
  get newPassword() {
    return this.formPassword.get("newPassword");
  } 
  get confirmPassword() {
    return this.formPassword.get("confirmPassword");
  }
  onBlurClear() {
    if (this.newPassword.value === this.confirmPassword.value && 
      this.confirmPassword.value !== "") {
        this.areMatching = true;
    }
    console.log("blur");
  }

}
