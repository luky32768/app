import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, timer } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { EmailService } from 'src/app/services/email.service';
import { BankAccoutComponent } from '../bank-accout/bank-accout.component';

@Component({
  selector: 'app-send-money-permanent',
  templateUrl: './send-money-permanent.component.html',
  styleUrls: ['./send-money-permanent.component.css']
})
export class SendMoneyPermanentComponent implements OnInit {
  userId: number;
  username: string;
  error: string;
  okResponse: string;

  constructor(private service: EmailService,
    private component: BankAccoutComponent,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.userId = + this.route.snapshot.paramMap.get('id');
    this.username = this.route.snapshot.paramMap.get('username');
  }
  sendMoneyPermanently(details) {
    this.error = null;
    this.okResponse = null;
    console.log(details);
    let array = details.firstPayment.split(':');
    let hours = parseInt(array[0]);
    let minutes = parseInt(array[1]);
    let seconds = (array.length > 2) ? parseInt(array[2]) : 0;
    let firstPaymentInSeconds = hours * 3600 + minutes * 60 + seconds;
    let dateNowInSeconds = (new Date().getHours() * 3600) + 
    (new Date().getMinutes() * 60) + (new Date().getSeconds());
    let timeToStartPayments = 
    (firstPaymentInSeconds - dateNowInSeconds) * 1000;
    let frequency = this.otherOptionChosen() ?
       details.frequencyInSeconds : details.frequency; 
    let details2 = { accountNumber: details.accountNumber, 
    amount: details.amount, epin: details.epin };
    for (let i = 0; i < details.numberOfPayments; i++) {
      this.service.setFutureTransaction(Object.assign(details2,
        { timeOfPayment: new Date(
            Date.now() + timeToStartPayments +
            frequency * 1000 * i
          ).toLocaleTimeString()
        }),
         this.userId 
      ).subscribe(
        response => this.okResponse = 'Money sent successfully',
        error => this.error = error
      );
      
    }
      
      const subscription = timer(
        timeToStartPayments, frequency * 1000).pipe(
        take(details.numberOfPayments),
        mergeMap(x => {
          this.service.sendMoney(details2, this.userId).subscribe(
            response => this.component.currentAmount -= details.amount,
            error => subscription.unsubscribe()
          );
          return this.service.deleteFutureTransaction(this.userId);
        } )
      ).subscribe(x => {
        console.log(details.amount);
      })
    
  }
 
  otherOptionChosen() {
    return (document.getElementById('frequency') as HTMLSelectElement)
      .selectedIndex === 4;
  }
}
