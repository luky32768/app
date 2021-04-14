
import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  invalidLogin: boolean; 

  constructor(
    private router: Router, 
    private service: AuthService) { }

  // signIn(credentials) {
  //   this.authService.login(credentials)
  //     .subscribe(result => { 
  //       if (result)
  //         this.router.navigate(['/']);
  //       else  
  //         this.invalidLogin = true; 
  //     });
  // }
  signIn(credentials) {
    this.service.login(credentials)
      .subscribe(response => {
        if (typeof(response) === 'object') {
          let words = response.message.split(' ');
          let lastWord = words[words.length - 1];
          console.log(lastWord);
          if (lastWord === 'successful' || lastWord === 'verified') {
            console.log(lastWord);
            this.router.navigate(['/signup/emailaccount',
            credentials.username, response.id], 
            { queryParams: { firstName: response.firstName, 
              lastName: response.lastName } });
          }
        }
        else {
          console.log(response);
          console.log(credentials.username);
          this.invalidLogin = true;
        }
      } 
    )
  }
}
