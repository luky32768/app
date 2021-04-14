import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  invalidLogin: boolean;

  constructor(private service: AuthService, 
    private router: Router) { }

  ngOnInit(): void {
  }
  submit(credentials) {
    console.log(credentials);
    this.service.adminLogin(credentials)
    .subscribe(response => {
      if (response === 'successfull') {
        this.router.navigate(['/admin']);
      }
      else this.invalidLogin = true;
    })
  }

}
