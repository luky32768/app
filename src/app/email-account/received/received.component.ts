import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { EmailAccountComponent } from '../email-account.component';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css']
})
export class ReceivedComponent implements OnInit {
  receivedMails: any;
  userId: any;
  username: string;
  noEmailOpened = true;
  openedEmail = [];
  

  constructor(private emailService: EmailService, 
    private route: ActivatedRoute, private router: Router,
    private parentComponent: EmailAccountComponent ) { }

  ngOnInit(): void {
      this.openedEmail = [];
      this.userId = + this.route.snapshot.paramMap.get('id');
      this.username = this.route.snapshot.paramMap.get('username');
      this.emailService.getReceivedMails(this.userId)
        .subscribe(received => { 
          this.receivedMails = received;
          console.log(this.receivedMails);
          let length = this.receivedMails.length;
          let numberOfUnreadMails = 0;
          for (let i = 0; i < length; i++) {
            this.openedEmail.push(false);
            if (!this.receivedMails[i].read) {
              numberOfUnreadMails++;
            }
          }
          this.parentComponent.numberOfUnreadMails = numberOfUnreadMails;
        });
  }
  
  openEmail(i: number) {
    if (!this.receivedMails[i].read) {
      this.emailService.markMailAsRead(i, this.userId).subscribe();
      this.receivedMails[i].read = true;
      this.parentComponent.numberOfUnreadMails--;
    }
    this.openedEmail[i] = true;
    this.noEmailOpened = false;
    this.showOnlyEmail(i);
  }
  deleteEmail(i: number) {
    console.log('deleted on the client: ' + i);
    // delete it on the server..
    this.emailService.deleteEmail('received', i, this.userId)
      .subscribe(
        response => this.ngOnInit.call(this), // refresh emails
        error => console.log(error)
      );
    this.parentComponent.numberOfDeletedMails++;
    this.openedEmail[i] = false;
    this.noEmailOpened = true;
    this.showAllEmails();
  }
  respond(index: number) {
    let username = this.receivedMails[index].username;
    console.log(username);
    this.router.navigate(['/signup', 'emailaccount',
     this.username, this.userId, 'newemail', this.userId], 
    { queryParams: { respondTo: username } });
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
