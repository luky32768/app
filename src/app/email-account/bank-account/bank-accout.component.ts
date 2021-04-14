import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-bank-accout',
  templateUrl: './bank-accout.component.html',
  styleUrls: ['./bank-accout.component.css']
})
export class BankAccoutComponent implements OnInit {
  userId: number;
  username: string;
  currentAmount: any;
  pastTransactions: any;
  futureTransactions: any;

  constructor(private service: EmailService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userId = + this.route.snapshot.paramMap.get('id');
    this.username = this.route.snapshot.paramMap.get('username');
    this.service.getBankAccountAmount(this.userId).subscribe(
      amount => {
        console.log(amount);
        this.currentAmount = amount;
      } 
    );
    this.service.getBankAccountPastTransactions(this.userId)
      .subscribe(transactions => this.pastTransactions = transactions);
    this.service.getBankAccountFutureTransactions(this.userId)
      .subscribe(transactions => this.futureTransactions = transactions);
  }
  deletePastTransaction(index: number) {
    this.service.deletePastTransaction(index, this.userId)
      .subscribe(); 
  }
  
  
  deletePastTransactions() {
    while (this.pastTransactions.length > 0) {
      this.deletePastTransaction(0);
    }
  }
  // deleteFutureTransactions() {
  //   for (let i = 0; i < this.futureTransactions.length; i++) {
  //     this.service.deleteFutureTransaction(0, this.userId)
  //       .subscribe(x => this.futureTransactions.splice(0, 1));
  //   }
  // }
}
