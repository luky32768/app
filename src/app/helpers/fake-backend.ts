import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { fromEvent, interval, Observable, of, from, throwError, timer } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize, map, filter, scan, throttleTime, take } from 'rxjs/operators';
import { setTimeout } from 'timers';
import { JwtHelperService } from '@auth0/angular-jwt';

let users = JSON.parse(localStorage.getItem('users')) || [];
let emailStorage = JSON.parse(localStorage.getItem('emailStorage')) || [];

export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzA3MjE5MDIyfQ.';
    localStorage.setItem('admin', JSON.stringify({
      username: 'admin',
      phone: 123,
      password: 1
    })); // create an admin account

    return of(null).pipe(
      mergeMap(handleRoute)
    )
    .pipe(materialize())
    .pipe(delay(1500))
    .pipe(dematerialize());
    
    function handleRoute() {
      switch(true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/admin/authenticate') && method === 'POST':
          return adminAuthenticate();
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
        // case url.match(/\/users\/\d+$/) && method === 'PUT':
        //   return updateUser();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        case url.match(/\/users\/\d+$/) && method === 'PUT':
          console.log('intercepted');
          return changePassword();
        case url.match(/\/emails\/received\/\d+\/\d+$/) && method === 'PUT':
          return updateEmail();
        case url.endsWith('/api/orders') && method === 'GET':
          return getOrders();
        case url.match(/\/email\/\d+$/) && method === 'POST':
          return saveEmail();
        case url.match(/\/email\/received\/\d+\/\d+$/)
         && method === 'DELETE':
          return deleteEmail('received');
        case url.match(/\/email\/sent\/\d+\/\d+$/)
         && method === 'DELETE':
          return deleteEmail('sent');
        case url.match(/\/email\/bin\/\d+\/\d+$/)
         && method === 'DELETE':
          return deleteEmail('bin');
        case url.match(/\/emails\/received\/\d+$/) && method === 'GET':
          return getReceivedMails();
        case url.match(/\/emails\/sent\/\d+$/) && method === 'GET':
          return getSentMails();
        case url.match(/\/emails\/bin\/\d+$/) && method === 'GET':
          return getDeletedMails();
        case url.match(/\/bankaccount\/amount\/\d+$/) && method === 'GET':
          return getBankAccountAmount();
        case url.match(/\/bankaccount\/pasttransactions\/\d+$/)
         && method === 'GET':
          return getBankAccountPastTransactions();
        case url.match(/\/bankaccount\/futuretransactions\/\d+$/)
         && method === 'GET':
          return getBankAccountFutureTransactions();
        case url.match(/\/bankaccount\/pasttransactions\/\d+\/\d+$/)
          && method === 'DELETE':
          return deletePastTransaction();
          case url.match(/\/bankaccount\/futuretransaction\/\d+$/)
          && method === 'DELETE':
          return deleteFutureTransaction();
        case url.match(/\/bankaccount\/futuretransaction\/\d+$/)
          && method === 'POST':
          return setFutureTransaction();
        case url.match(/\/bankaccount\/send\/\d+$/) && method === 'POST':
          return sendMoney();
        default:
          return next.handle(request);
      }
    };
    function adminAuthenticate() {
      const { username, password, phone } = JSON.parse(body);
      let admin = JSON.parse(localStorage.getItem('admin'));
      if (username === admin.username && password === admin.password
        && phone === admin.phone) {
          return ok();
        }
      else return throwError('invalid credentials');
    }
    function authenticate() {
      console.log('fake backend responded');
      const { username, password } = JSON.parse(body);
      console.log(JSON.parse(body));
      let user = users.find(x => x.username === username && 
        x.password === password);
      if (user) console.log(user);
      if (!user) return throwError('invalid credentials');
      return ok({
        id: user.id,
        username: username,
        firstName: user.firstName,
        lastName: user.lastName,
        token
      });
    }
    function register() {
      let length = users.length;
      let user = JSON.parse(body);
      console.log(user);
      if (users.find(x => x.username === user.username)) {
        console.log('found');
        return throwError('username already taken');
      }
      else if (users.find(x => x.bankAccount.accountNumber
        === parseInt(user.accountNumber))) {
          return throwError('account number already taken');
        }
      // user.id = length;
      user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
      user.bankAccount = { accountNumber: user.accountNumber, 
      epin: user.epin, amount: 10000, pastTransactions: [],
      futureTransactions: [] };
      users.push(user);
      emailStorage.push({ id: user.id, username: user.username, 
      received: [{ from: { firstName: 'Boss', lastName: 'Admin' }, 
      username: 'admin',
      time: getCurrentTime(), message: 'Welcome, ' +
       user.firstName + 
       ' ! Have fun using my email application.', read: false }],
      sent: [], bin: [], spam: [] });
      localStorage.setItem('users', JSON.stringify( users));
      localStorage.setItem('emailStorage', JSON.stringify( emailStorage));
      return ok(user);
    }
    
    

    function deleteUser() {
      let id = idFromUrl();
      // let user = users.find(x => x.id === id);
      users = users.filter(x => x.id !== id);
      localStorage.setItem('users', JSON.stringify(users));
      return ok();
    }
    function changePassword() {
      // if (!isLoggedIn()) return unauthorizated();
      console.log(headers.get('Authorization'));
      let passwords = JSON.parse(body);
      console.log('fake backend received new password');
      console.log(passwords);
      let id = idFromUrl();
      let user = users.find(x => x.id === id);
      if (passwords.oldPassword !== user.password) {
        return throwError('invalid old password');
      }
      Object.assign(user, { password: passwords.newPassword });
      localStorage.setItem('users', JSON.stringify(users));
      return ok('password changed');

    }
    function updateUser() {
      if (!isLoggedIn()) return unauthorizated();

      let id = idFromUrl();
      let user = users.find(x => x.id === id);
      let index = users.indexOf(user);
      let { username, password } = body;
      if (!password) Object.assign(user, { username: username } );
      else Object.assign(user, body);
      users = users.splice(index, 1, user);
      // another way:
      // Object.assign(user, updatedUser);
      localStorage.setItem('users', JSON.stringify(users));
      return ok();
    }
    function getUsers() {
      // if (!isLoggedIn()) return unauthorizated();
      console.log(users);
      return ok(users);
    }
    function getUserById() {
      if (!isLoggedIn()) return unauthorizated();

      let id = idFromUrl();
      let user = users.find(x => x.id === id);
      return ok(user);
    }
    function getOrders() {
      const orders = JSON.parse(localStorage.getItem('orders'));
      return ok(orders);
    }
    function saveEmail() {
      // if (!isLoggedIn()) return unauthorizated();
      console.log('server has got the mail');
      let sender = users.find(x => x.id === idFromUrl());
      console.log('sender: ' + sender);
      let senderName = { firstName: sender.firstName, 
      lastName: sender.lastName };
      console.log(senderName);
      let username = body.adress;
      console.log(username);
      let user = users.find(x => x.username === username);
      if (!user) return throwError('email adress does not exist');

      let receiverStorage = emailStorage.find(x => x.username === username);
      receiverStorage.received.splice(0, 0, 
        { from: senderName, username: sender.username,
           time: body.time, message: body.message, read: false });
      let senderStorage = emailStorage.find(x => x.id === idFromUrl());
      senderStorage.sent.splice(0, 0, 
        { to: body.adress, time: body.time, message: body.message });
      console.log(senderStorage);
      console.log(emailStorage);
      localStorage.setItem('emailStorage', JSON.stringify(emailStorage));
    }
    function getReceivedMails() {
      // if (!isLoggedIn()) return unauthorizated();
      let userStorage = emailStorage.find(x => x.id === idFromUrl());
      let received = userStorage.received;
      return ok(received);
    }
    function getSentMails() {
      // if (!isLoggedIn()) return unauthorizated();
      let userStorage = emailStorage.find(x => x.id === idFromUrl());
      let sent = userStorage.sent;
      return ok(sent); 
    }
    function getDeletedMails() {
      let userStorage = emailStorage.find(x => x.id === idFromUrl());
      let deleted = userStorage.bin;
      return ok(deleted);
    }
    function deleteEmail(folder: string) {
      let id = idFromUrl();
      let urlParts = url.split('/')
      let deletedMail = + urlParts[urlParts.length - 2];
      console.log('index: ' + deletedMail);
      let timeOfDelete = new Date().getTime();
      let userStorage = emailStorage.find(x => x.id === id);
      let received = userStorage.received;
      let sent = userStorage.sent;
      let bin = userStorage.bin;
      if (folder === 'received') {
        let spliced = received.splice(deletedMail, 1)[0];
        Object.assign(spliced, { timeOfDelete });
        console.log(received);
        bin.splice(0, 0, spliced);
      }
      else if (folder === 'sent') {
        console.log('before: ' + sent);
        let spliced = sent.splice(deletedMail, 1)[0];
        Object.assign(spliced, { timeOfDelete });
        console.log('after: ' + sent);
        bin.splice(0, 0, spliced);
      }
      else if (folder === 'bin') {
        console.log(bin.splice(deletedMail, 1));
        console.log(bin);
        console.log(base64Encode('ahojky'))
        console.log(base64Encode('ahojky, jak'))
      }
      localStorage.setItem('emailStorage', JSON.stringify(emailStorage));
      return ok('deleted');
    }
    function updateEmail() {
      let urlParts = url.split('/');
      let indexOfMail = urlParts[urlParts.length - 2];
      let userStorage = emailStorage.find(x => x.id === idFromUrl());
      let received = userStorage.received;
      Object.assign(received[indexOfMail], { read: true });

      localStorage.setItem('emailStorage', JSON.stringify(emailStorage));
      return ok('read');
    }
    function getBankAccountAmount() {
      let user = users.find(x => x.id === idFromUrl());
      let amount = user.bankAccount.amount as number;
      console.log('amount: ' + amount);
      return ok(amount);
    }
    function getBankAccountPastTransactions() {
      let user = users.find(x => x.id === idFromUrl());
      let pastTransactions = user.bankAccount.pastTransactions as any[];
      return ok(pastTransactions);
    }
    function getBankAccountFutureTransactions() {
      let user = users.find(x => x.id === idFromUrl());
      let futureTransactions = user.bankAccount.futureTransactions as any[];
      return ok(futureTransactions);
    }
    function deletePastTransaction() {
      let urlParts = url.split('/');
      let indexOfTransaction = + urlParts[urlParts.length - 2];
      let user = users.find(x => x.id === idFromUrl());
      console.log('index: ' + indexOfTransaction);
      user.bankAccount.pastTransactions.splice(indexOfTransaction, 1);
      localStorage.setItem('users', JSON.stringify(users));
      return ok();
    }
    function sendMoney() {
      let { accountNumber, amount, epin } = JSON.parse(body);
      console.log(JSON.parse(body));
      let sender = users.find(x => x.id === idFromUrl());
      console.log('epin: ' + epin + ' ' + sender.bankAccount.epin);
      if (parseInt(epin) !== sender.bankAccount.epin) {
        return throwError('incorrect epin');
      }
      let adressee = users.find(
        x => x.bankAccount.accountNumber === accountNumber
      );
      if (!adressee) return throwError('account number does not exist');
      if (sender.bankAccount.amount < amount) {
        return throwError('you don´t have that much money');
      }
      adressee.bankAccount.amount += parseInt(amount);
      sender.bankAccount.amount -= parseInt(amount);
      console.log('amount: ' + amount);
      console.log(adressee.bankAccount.amount);
      console.log(sender.bankAccount.amount);
      adressee.bankAccount.pastTransactions.unshift({
        from: sender.firstName + " " + sender.lastName,
        accountNumber: sender.bankAccount.accountNumber,
        amount,
        time: getCurrentTime()
      });
      sender.bankAccount.pastTransactions.unshift({
        to: adressee.bankAccount.accountNumber,
        amount,
        time: getCurrentTime()
      });
      localStorage.setItem('users', JSON.stringify(users));
      return ok();
    }
    
    function setFutureTransaction() {
      let { accountNumber, amount, epin, timeOfPayment } =
       JSON.parse(body);
      console.log('futureTransaction: ' + body);
      let sender = users.find(x => x.id === idFromUrl());
      if (sender.bankAccount.epin !== parseInt(epin)) 
        return throwError('incorrect epin');
      let adressee = users.find(
        x => x.bankAccount.accountNumber === accountNumber
      );
      let futureTransactions = sender.bankAccount.futureTransactions;
      let transactionIndex = 0;
      console.log('length: ' + futureTransactions.length);
      if (futureTransactions.length > 0) {
        transactionIndex = 0;
        for (let transaction of futureTransactions) {
          if (transaction.time > timeOfPayment) {
            transactionIndex = futureTransactions.indexOf(transaction);
            break;
          }
          if (futureTransactions.indexOf(transaction) ===
          futureTransactions.length - 1) 
          transactionIndex = futureTransactions.length;
        }
      }
      sender.bankAccount.futureTransactions.splice(
        transactionIndex, 0, {
        to: accountNumber, amount,
        time: timeOfPayment
      });
      localStorage.setItem('users', JSON.stringify(users));
      return ok(amount);
    }
    function deleteFutureTransaction() {
      let user = users.find(x => x.id === idFromUrl());
      let timeNow = new Date().toLocaleTimeString();
      let futureTransactions = user.bankAccount.futureTransactions;
      let transaction = futureTransactions.find(x => x.time === timeNow);
      let index = futureTransactions.indexOf(transaction);
      user.bankAccount.futureTransactions.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(users));
      return ok();
    }
    function getCurrentTime() {
      let date = new Date().toLocaleDateString();
      let time = new Date().toLocaleTimeString();
      return date + " " + time;
    }
    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
    }
    function error(message) {
      return throwError({ error: message });
    }
    function unauthorizated() {
      return throwError({ status: 201, error: { message: 'unauthorizated '} });
    }
    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer' + token;
    }
    function idFromUrl() {
      const fragments = url.split('/');
      return parseInt(fragments[fragments.length - 1]);
    }
    function createTokenExpiration() {
      let now = new Date().getTime();
      let expiration = now + 150000;
      return expiration.toString();
    }
    function append(x: number) {
      switch (x % 3) {
        case 1:
          return "==";
          break;
        case 2:
          return "=";
          break;
        default:
          return "";
      }
    }
    // some functions to implement encoding jwt; but I have not used them yet to create a jwt for logged user
    function base64Encode(s: string) {
      let x = s.length % 3;
      let append2 = append(x);
      let extended = s.concat(append2);
      return asciiToString(stringToAscii(extended))
    }
    function stringToAscii(s: string) {
      let array = s.split('');
      let ascii = array.map((x, index) => s.charCodeAt(index));
      let bits = flat(ascii.map(x => numberToBits(x)));
      return bits;
    }
    function asciiToString(array: number[]) {
      let result = "";
      let numberOfParts = array.length / 6;
      let parts = [];
      for (let i = 0; i < numberOfParts; i++) {
        let asciiCode = 0;
        for (let index = i * 6; index < (i + 1) * 6; index++) {
          asciiCode += array[index] * Math.pow(2, 5 - (index % 6));
        }
        result = result.concat(String.fromCharCode(65 + asciiCode));
      }
      return result;
    }
    function numberToBits(x: number) {
      let result = [];
      while (x > 0) {
        result.unshift(x % 2);
        x = (x - (x % 2)) / 2;
      }
      if (result.length < 8) {
        while (result.length < 8) {
          result.unshift(0);
        }
      }
      return result;
    }
    function flat(secondOrder: any[][]) {
      let result = [];
      for (let subarray of secondOrder) {
        for (let i of subarray) {
          result.unshift(i);
        }
      }
      return result;
    }
    
export const FakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
}
