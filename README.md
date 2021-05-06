# Emails & Internet Banking

Updated project here: https://stackblitz.com/edit/emails-and-internetbanking
This is my implementation of a backendless application for emails and internet banking. 
To create a fake backend I have used an extended HttpInterceptor, and as a database browser localStorage, similarly to what I have seen 
on this page: https://jasonwatmore.com/post/2020/07/18/angular-10-fake-backend-example-for-backendless-development

As for emails: After you register, you will have created a new email account and you can log in. After logging in, 
you will see different folders: Received (emails ordered by time and highlighted in case you have not opened them yet), Sent, 
Bin (emails you have deleted), New email (for writing a new email)...

I also implemented internetbanking aplication, which is available for anyone who successfully logs in his email account.
You can make a one-time payment, or a regular payment (not permanent): you can set the frequency, time of the first payment 
and number of payments. To execute future transactions i have created rxjs observables (timers). You can cancel any of your future transactions, 
or all of them at once. You can see the list of your upcoming future transactions (in the bank account app) ordered by time.
You can run more regular payments at once and you will see them merged in the list of future transactions.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.5.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
