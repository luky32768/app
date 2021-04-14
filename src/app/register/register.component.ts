import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  usernameTaken: boolean;
  accountNumberTaken: boolean;
  okResponse: string;

  constructor(private service: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }
  register(credentials) {
    this.accountNumberTaken = false;
    this.usernameTaken = false;
    this.okResponse = null;
    this.service.register(credentials)
      .subscribe(
        response => {
          let words = response.split(' ');
          let lastWord = words[words.length - 1];
          if (lastWord === 'registered') {
            this.okResponse = 'registered successfully';
            setTimeout(() => {
              this.router.navigate(['/signup']);
              console.log(response);  
            }, 2000);
          }
          else if (response === 'account number already taken') {
            this.accountNumberTaken = true;
          }
          else this.usernameTaken = true;
        }  
      )
  }
}
