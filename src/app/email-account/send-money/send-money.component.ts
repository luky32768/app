import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.css']
})
export class SendMoneyComponent implements OnInit {
  userId: number;
  username: string;
  error: string;
  okResponse: string;

  constructor(private service: EmailService, 
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.userId = + this.route.snapshot.paramMap.get('id');
    this.username = this.route.snapshot.paramMap.get('username');
  }
  sendMoney(details) {
    console.log(details);
    this.service.sendMoney(details, this.userId).subscribe(
      response => this.okResponse = 'Money sent successfully',

      error => { 
        console.log(error);
        this.error = error;
      }
    )
  }
  // back() {
  //   this.router.navigate(['/'])
  // }
}
