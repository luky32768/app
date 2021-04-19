import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, concat, fromEvent, interval, Observable, of, range, throwError, timer } from 'rxjs';
import { catchError, concatAll, concatMap, delay, dematerialize, exhaust, map, materialize, mergeAll, mergeMap, retry, scan, startWith, switchAll, switchMap, take, tap } from 'rxjs/operators';
import { AuthenticateService } from '../authenticate.service';
import { EmailService } from '../services/email.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-email-account',
  templateUrl: './email-account.component.html',
  styleUrls: ['./email-account.component.css']
})
export class EmailAccountComponent implements OnInit, OnDestroy {
  username: string;
  userId: number;
  firstName: string;
  lastName: string;
  receivedMails: any;
  deletedMails: any;
  numberOfUnreadMails = 0;
  numberOfDeletedMails = 0;
  numberOfSpamMails = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient,
    private router: Router, private service: AuthService, 
    private emaiService: EmailService) { }

  ngOnInit(): void {
    console.log(this.service.isLoggedIn);
    if (this.service.isLoggedIn) {
      this.username = this.route.snapshot.paramMap.get('username');
      this.userId = + this.route.snapshot.paramMap.get('id');
      this.firstName = this.route.snapshot.queryParamMap.get('firstName');
      this.lastName = this.route.snapshot.queryParamMap.get('lastName');
      
      console.log(this.firstName + ' ' + this.lastName);
      this.emaiService.getReceivedMails(this.userId)
        .subscribe(received => {
          this.receivedMails = received;
          for (let mail of this.receivedMails) {
            if (!mail.read) this.numberOfUnreadMails++;
          }
        });
        this.emaiService.getDeletedMails(this.userId)
          .subscribe(
            mails => {
              this.deletedMails = mails;
              this.numberOfDeletedMails = this.deletedMails.length;
            } 

          )
    }
    logout() {
    this.service.logout();
    this.router.navigate(['/signup']);
    }
    login() {
      this.router.navigate(['/signup']);
    }
  }
  
