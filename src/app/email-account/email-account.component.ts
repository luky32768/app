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
    
    
    
    // this.compute();
    const modulus = 61 * 77;
    const message = 30;
    const exponent = 37;
    // console.log('modulus: ' + modulus);
    // console.log('message: ' + message);
    let encrypted = this.encrypt(message, modulus, exponent);
    // console.log(encrypted);
    // console.log(this.decrypt(encrypted, modulus, exponent));
    const intervalObservable = interval(1000).pipe(
      mergeMap(val => {
        if (val > 4) return throwError('greater than 4');
        return of(val);
      }),
      retry(3)
    );
    
    const mouseMoves = fromEvent(document, 'mousemove');
    // const subscription = mouseMoves.subscribe(
    //   (event: MouseEvent) => { 
    //       console.log(`coordinates: 
    //       ${event.clientX} x ${event.clientY }`);
    //       setTimeout(() => {
    //         subscription.unsubscribe();
    //       }, 14000);
    //     }
    //   );
    const numbers = of(1, 2, 3);
    const squared = map((val: number) => val * val);
    // const subscription3 = squared(numbers).subscribe(
    //   val => console.log(val)
    // );
    
    // const subscription = intervalObservable.subscribe(
    //   x => console.log(x),
    //   error => console.log('retried 4 times but always failed:)'),
    //   () => console.log('completed.')
    // );
    
    
  }
  ngOnDestroy(): void {
    // this.service.isLoggedIn = true;
    console.log('isLoggedIn: ' + this.service.isLoggedIn);
  }
  login() {
    this.router.navigate(['/signup']);
  }

  compute() {
    const letters = ['a', 'b', 'c'].map((letter, index) => 
    of(letter).pipe(delay((index + 1) * 1000)));
    const intervals = letters.map(
      letter => letter.pipe(
        mergeMap(
          letter => interval(1000).pipe(
            map(
              number => letter + number
            ),
            take(9)
          )
        )
      )
    );
    const combined = combineLatest(intervals);
    const interval2 = interval(1000).pipe(
      mergeMap(x => x === 3 ?
        throwError('three is bad') :
        of(x, 'a', 'b')),
        catchError((error: any) => of([]))
    );
    interval2.subscribe(x => console.log(x),
    error => console.log(error),
    () => console.log('completed'));

    // combined.subscribe(x => console.log(x));
    // throwError('an error occured').pipe(
    //   materialize(),
    //   delay(3000),
    //   dematerialize()
    // )
    //   .subscribe(x => console.log('next'),
    //   error => console.log('an error: ' + error),
    //   () => console.log('completed'));
        
  }
  
  
  logout() {
    this.service.logout();
    this.router.navigate(['/signup']);
  }
  toAdmin() {
    this.router.navigate(['/admin']);
  }
  changePassword() {
    this.router.navigate(['/changepassword', this.userId],
    { queryParams: { id: this.userId } });
    console.log(this.service.isLoggedIn);
  }
  
  // getReceivedMails() {
  //   this.emaiService.getReceivedMails(this.userId)
  //     .subscribe(received => this.receivedMails = received);
  // }
 
  euklAlg(a: number, b: number) {
    let combination = ['a', 'b'];
    let indexes = [1, 0];
    while (a !== b) {
      let [x, y] = (a < b)? [a, b] : [b, a];
      combination = (a < b)? combination : combination.reverse();
      indexes = (a < b)? indexes : indexes.reverse();
      a = x; 
      b = y - x;
      indexes = [indexes[0], indexes[1] - indexes[0]];
      combination[1] += '-(' + combination[0] + ')';
    }
    // return [a, combination, indexes];
    return indexes;
  }
  factorize(n: number) {
    let result = [];
    let i = 2;
    while (i <= n) {
      if (n % i === 0) {
        n = n / i;
        result.splice(result.length, 0, i);
      }
      else i++;
    }
    return result;
  }
  totientFunction(n: number) {
    let usedPrimes = [];
    let result = 1;
    for (let prime of this.factorize(n)) {
      if (usedPrimes.indexOf(prime) > -1) {
        result = result * prime;
      }
      else {
        result = result * (prime - 1);
        usedPrimes.push(prime);
      }
      // console.log(result);
    }
    return result;
  }
  power(base: number, exponent: number) {
    let result = 1;
    for (let i = 1; i <= exponent; i++) {
      result = result * base;
    }
    return result;
  }
  
  encrypt(originalMessage: number, modulus: number, exponent: number)  {
    return (this.power(originalMessage, exponent)) % modulus;
  }
  decrypt(message: number, modulus: number, exponent: number) {
    let privateKey = this.generatePrivateKey(modulus, exponent);
    return (this.power(message, privateKey)) % modulus;
  }
  generatePrivateKey(modulus: number, exponent: number) {
    let x = this.totientFunction(modulus);
    // let y = this.totientFunction(x);
    // return this.power(exponent, y - 1) % x;
    
    let result = this.euklAlg(exponent, x)[0];
    return (result > 0)? result : x + result;
  }
  combineTimers() {
    const firstTimer = timer(0, 1000);
    const secondTimer = timer(200, 1000);
    const thirdTimer = timer(400, 1000);
    const combinedTimers = combineLatest([firstTimer, secondTimer, thirdTimer]);
    // const subcsription = combinedTimers.subscribe(value => { console.log(value);
    //   if (value === [13, 12, 12]) subcsription.unsubscribe();
    //   setTimeout(() => {
    //     subcsription.unsubscribe();
    //   }, 20000);  
    // });
    // const observables = [1, 4, 8].map(
    //   n => of(n).pipe(
    //     delay(n * 1000),
    //     startWith(0)
    //   )
    // )
    // const combined = combineLatest(observables);
    // const subscription = combined.subscribe(value => {
    //   console.log(value);
    //   setTimeout(() => {
    //     subscription.unsubscribe();
    //   }, 20000);
    // })  
    
    const weights = of(50, 60, 70);
    const heights = of(150, 160, 180);
    const mixed = of('h', 'l', 's').pipe(map((x => x.toUpperCase())));
    const materialized = mixed.pipe(materialize());
    // const subscription = materialized.subscribe(x => console.log(x),
    // err => console.log('an error occured.', err), 
    // () => console.log('completed..'));
    

    // const switched = of(1, 2, 3).pipe(
    //   switchMap(
    //     (x: number) => of(x).pipe(delay(1), startWith(0))
    //   )
    // );
    // const subscription = switched.subscribe(x => console.log(x));
    
    const keydowns = fromEvent(document, 'keydown');
    const higherOrder = keydowns.pipe(switchMap((ev) => interval(1000)));
    // const firstOrder = higherOrder.pipe(mergeAll());

    // const subscription = higherOrder.subscribe(x => {
    //   console.log(x);
    //   setTimeout(() => {
    //     subscription.unsubscribe();
    //   }, 15000);
    // })
    
  }

}
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private service: AuthService) { }
//   intercept(request: HttpRequest<any>, next: HttpHandler) {
//     if (this.service.isLoggedIn {
//       let newRequest = request.clone({ url: request.url + '/authenticate' });
//       return next.handle(newRequest);
//     }
//     else {
//       let newRequest = request.clone({ url: request.url + '/unauthorizated' });
//       return next.handle(newRequest);
//     }
//   }
// }
export class LoggingInterceptor implements HttpInterceptor {
  // constructor(private service: MessageService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const start = Date.now();
    next.handle(req).subscribe(response => {
      const stop = Date.now();
      console.log(stop - start);
    });
    return of(null);
  }
}

