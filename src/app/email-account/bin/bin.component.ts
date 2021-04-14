import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { EmailAccountComponent } from '../email-account.component';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.css']
})
export class BinComponent implements OnInit {
  userId: number;
  deletedMails: any;
  noEmailOpened = true;
  openedEmail = [];

  constructor(private route: ActivatedRoute,
    private service: EmailService, 
    private parentComponent: EmailAccountComponent) { }

  ngOnInit(): void {
    this.userId = + this.route.snapshot.paramMap.get('id');
    this.service.getDeletedMails(this.userId)
      .subscribe(
        mails => {
          this.deletedMails = mails;
          for (let i = 0; i < length; i++) {
            this.openedEmail.push(false);
          }
          for (let i = 0; i < this.deletedMails.length; i++) {
            if (this.isOld(i)) this.deleteEmail(i);
          } // automatically delete emails after certain time
        } 
      )
    
  }
  openEmail(i: number) {
    this.openedEmail[i] = true;
    this.noEmailOpened = false;
    this.showOnlyEmail(i);
  }
  deleteEmail(i: number) {
    this.service.deleteEmail('bin', i, this.userId)
    .subscribe(
      response => this.ngOnInit.call(this),
      error => console.log(error)
    );
    this.parentComponent.numberOfDeletedMails--;
    this.openedEmail[i] = false;
    this.noEmailOpened = true;
    this.showAllEmails();
  }
  backToMails(i: number) {
    this.openedEmail[i] = false;
    this.noEmailOpened = true;
    this.showAllEmails();
  }
  showOnlyEmail(i: number) {
    let liElements = document.getElementsByTagName('li');
    for (let j = 0; j < liElements.length; j++) {
      liElements[j].style.display = 'none';
    }
    liElements[i].style.display = 'block';
  }
  showAllEmails() {
    let liElements = document.getElementsByTagName('li');
    for (let j = 0; j < liElements.length; j++) {
      liElements[j].style.display = 'block';
    }
  }
  isOld(index: number) {
    return (new Date().getTime() - 
    this.deletedMails[index].timeOfDelete) / 1000 > 36000; // 10 hours
  }

}
