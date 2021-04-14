import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { EmailAccountComponent } from '../email-account.component';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.css']
})
export class SentComponent implements OnInit {
  userId: number;
  sentEmails: any;
  openedEmail = [];
  noEmailOpened = true;

  constructor(private emailService: EmailService, 
    private route: ActivatedRoute, 
    private parentComponent: EmailAccountComponent) { }

  ngOnInit(): void {
    this.openedEmail = [];
    this.userId = + this.route.snapshot.paramMap.get('id');
    this.emailService.getSentMails(this.userId).subscribe(
      emails => {
        this.sentEmails = emails;
        for (let i = 0; i < this.sentEmails.length; i++) {
          this.openedEmail.push(false);
        }
        console.log(this.sentEmails);
        console.log(this.openedEmail);
      } 
    );
  }
  openEmail(i: number) {
    this.noEmailOpened = false;
    this.openedEmail[i] = true;
    this.showOnlyEmail(i);  
  }
  deleteEmail(i: number) {
    // this.sentEmails.splice(i, 1);
    // and delete it on the server..
    this.emailService.deleteEmail('sent', i, this.userId)
    .subscribe(
      response => this.ngOnInit.call(this), 
      error => console.log(error)
    );
    this.parentComponent.numberOfDeletedMails++;
    this.openedEmail[i] = false;
    this.noEmailOpened = true;
    this.showAllEmails();
  }
  backToReceived(i: number) {
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

}
