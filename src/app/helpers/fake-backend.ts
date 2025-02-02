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
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        case url.match(/\/users\/\d+$/) && method === 'PUT':
          console.log('intercepted');
          return changePassword();
        case url.match(/\/emails\/received\/\d+\/\d+$/) && method === 'PUT':
          return updateEmail();
        case url.endsWith('/api/orders') && method === 'GET':
          return getOrders();
        case url.match(/\/emails\/\d+$/) && method === 'POST':
          return saveEmail();
        case url.match(/\/emails\/received\/\d+\/\d+$/)
         && method === 'DELETE':
          return deleteEmail('received');
        case url.match(/\/emails\/receivedtospam\/\d+\/\d+$/)
          && method === 'DELETE':
          return deleteEmail('receivedtospam');
        case url.match(/\/emails\/sent\/\d+\/\d+$/)
         && method === 'DELETE':
          return deleteEmail('sent');
        case url.match(/\/emails\/spam\/\d+\/\d+$/)
          && method === 'DELETE':
           return deleteEmail('spam');
        case url.match(/\/emails\/bin\/\d+\/\d+$/)
         && method === 'DELETE':
          return deleteEmail('bin');
        case url.match(/\/emails\/received\/\d+$/) && method === 'GET':
          return getReceivedMails();
        case url.match(/\/emails\/sent\/\d+$/) && method === 'GET':
          return getSentMails();
        case url.match(/\/emails\/spam\/\d+$/) && method === 'GET':
          return getSpamEmails();
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
          case url.match(/\/bankaccount\/futuretransactions\/\d+$/)
          && method === 'DELETE':
          return deleteFutureTransaction();
        case url.match(/\/futuretransactions\/\d+\D\d+\D\d+\/\d+$/)
          && method === 'DELETE':
          return cancelFutureTransaction();
        case url.match(/\/futuretransactions\/\d+$/)
         && method === 'DELETE':
         return cancelFutureTransactions();
        case url.match(/\/bankaccount\/futuretransactions\/\d+$/)
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
        token: createToken(user)
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
      time: getCurrentTime(), subject: 'Welcome Email',
       message: 'Welcome, ' +
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
      let senderName = { firstName: sender.firstName, 
      lastName: sender.lastName };
      console.log(senderName);
      let parsedBody = body;
      let username = parsedBody.address;
      console.log(username);
      let user = users.find(x => x.username === username);
      if (!user) return throwError('email address does not exist');

      let receiverStorage = emailStorage.find(x => x.username === username);
      receiverStorage.received.splice(0, 0, 
        { from: senderName, username: sender.username, 
          to: user.firstName + ' ' + user.lastName,
          time: parsedBody.time, subject: parsedBody.subject,
          message: parsedBody.message, read: false });
      let senderStorage = emailStorage.find(x => x.id === idFromUrl());
      senderStorage.sent.splice(0, 0, 
        { to: parsedBody.address, from: senderName,
           time: parsedBody.time, 
          subject: parsedBody.subject, message: parsedBody.message });
      localStorage.setItem('emailStorage', JSON.stringify(emailStorage));
      return ok();
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
    function getSpamEmails() {
      let userStorage = emailStorage.find(x => x.id === idFromUrl());
      let spamEmails = userStorage.spam;
      return ok(spamEmails);
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
      let spam = userStorage.spam;
      let bin = userStorage.bin;
      if (folder === 'received') {
        let spliced = received.splice(deletedMail, 1)[0];
        Object.assign(spliced, { timeOfDelete });
        bin.splice(0, 0, spliced);
      }
      else if (folder === 'receivedtospam') {
        let spliced = received.splice(deletedMail, 1)[0];
        Object.assign(spliced, { timeOfDelete });
        spam.splice(0, 0, spliced);
      }
      else if (folder === 'sent') {
        let spliced = sent.splice(deletedMail, 1)[0];
        Object.assign(spliced, { timeOfDelete });
        bin.splice(0, 0, spliced);
      }
      else if (folder === 'spam') {
        let spliced = spam.splice(deletedMail, 1)[0];
        Object.assign(spliced, { timeOfDelete });
        bin.splice(0, 0, spliced);
      }
      else if (folder === 'bin') {
        console.log(bin.splice(deletedMail, 1));
        console.log(bin);
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
    
    function checkTime() {
      let sender = users.find(x => x.id === idFromUrl());
      let { time } = JSON.parse(body);
      if (!time) return true;
      let futureTransactions = sender.bankAccount.futureTransactions;
      if (futureTransactions.find(x => x.time === time)) return true;

      return false;
    }
    function sendMoney() {
      let { accountNumber, amount, epin } = JSON.parse(body);
      console.log(JSON.parse(body));
      let sender = users.find(x => x.id === idFromUrl());
      console.log('epin: ' + epin + ' ' + sender.bankAccount.epin);
      if (parseInt(epin) !== sender.bankAccount.epin) {
        return throwError('incorrect epin');
      }
      console.log('checked time: ' + checkTime());
      if (checkTime()) {
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
        deleteFutureTransaction();
        localStorage.setItem('users', JSON.stringify(users));
        return ok();
      }
      return ok('no money sent, transaction has been cancelled');
      
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
      let transaction = futureTransactions.find(x => x.time = timeNow);
      let index = futureTransactions.indexOf(transaction);
      user.bankAccount.futureTransactions.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(users));
      return ok();
    }
    function cancelFutureTransaction() {
      let urlParts = url.split('/');
      let timeOfTransaction = urlParts[urlParts.length - 2];
      console.log('time: ' + timeOfTransaction);
      let sender = users.find(x => x.id === idFromUrl());
      let futureTransactions = sender.bankAccount.futureTransactions;
      let transaction = futureTransactions.find(
        x => x.time === timeOfTransaction
      );
      let index = futureTransactions.indexOf(transaction);
      futureTransactions.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(users));
      return ok();
    }
    function cancelFutureTransactions() {
      let sender = users.find(x => x.id === idFromUrl());
      let transactions = sender.bankAccount.futureTransactions;
      // sender.bankAccount.futureTransactions = []; ..neaktualizuje se
      //  u clienta
      // while (transactions.length > 0) {
      //   transactions.splice(0, 1);
      // } ...works
      transactions.splice(0, transactions.length - 1);
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
      return headers.get('Authorization') === 'Bearer' + this.token;
    }
    function idFromUrl() {
      const fragments = url.split('/');
      return parseInt(fragments[fragments.length - 1]);
    }
    function createToken(user) {
      let header = JSON.stringify({
        alg: "RS256",
        typ: "JWT"
      });
      let payload = JSON.stringify({
        sub: user.id.toString(),
        name: user.firstName + ' ' + user.lastName,
        iat: createTokenExpiration()
      });
      let token = base64UrlEncode(header) + '.' + 
      base64UrlEncode(payload); // without signature yet
      const privateKey = 11;
      let signature = encryptHash(customHash(token), privateKey)
      .toString();
      token = token.concat('.', signature);
      localStorage.setItem('token', token);
      return token;
    }
    function createTokenExpiration() {
      let secondsNow =Math.floor(new Date().getTime() / 1000);
      let expiration = secondsNow + 300; // give the user 5 minutes:)
      return expiration;
    }
    
    function base64UrlEncode(s: string) {
      return asciiToString(stringToAscii(s));
    }
    function stringToAscii(s: string) {
      let array = s.split('');
      let ascii = array.map((x, index) => s.charCodeAt(index));
      let bits = flat(ascii.map(x => numberToBits(x)));
      return bits;
    }
    function asciiToString(array: number[]) {
      let result = "";
      let numberOfParts = parseInt((array.length / 6).toString());
      let lengthOfRemain = array.length % 6;
      let parts = [];
      for (let i = 0; i < numberOfParts; i++) {
        let asciiCode = 0;
        for (let index = i * 6; index < (i + 1) * 6; index++) {
          asciiCode += array[index] * Math.pow(2, 5 - (index % 6));
        }
        result = result.concat(stringFromCharCode(asciiCode));
      }
      if (lengthOfRemain > 0) {
        let asciiCode = 0;
        for (let i = 0; i < lengthOfRemain; i++) {
          asciiCode += array[6 * numberOfParts + i] * Math.pow(2, 5 - i);
        }
        result = result.concat(stringFromCharCode(asciiCode));
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
    function stringFromCharCode(code: number) {
      if (0 <= code && code < 26) {
        return String.fromCharCode(65 + code);
      } 
      else if (25 < code && code < 52) {
        return String.fromCharCode(97 - 26 + code);
      }
      else if (51 < code && code < 62) {
        return String.fromCharCode(code - 4)
      } 
      else if (code === 62) return '-';
      else if (code === 63) return '_';
    }
    function flat(secondOrder: any[][]) {
      let result = [];
      for (let subarray of secondOrder) {
        for (let i of subarray) {
          result.push(i);
        }
      }
      return result;
    }
    function encryptHash(hash: number, privateKey: number) {
      return Math.pow(hash, privateKey) % publicKey.n;
    }
    
    
  }
} 
export function customHash(s: string) {
  let result = 0; 
  for (let index = 0; index < s.length; index++) {
    result += s.charCodeAt(index);
  }
  return result % publicKey.n; // < publicKey.n to make RSA work
};
export function decrypt(encrypted: number) {
  return Math.pow(encrypted, publicKey.e) % publicKey.n;
}
export const publicKey = { n: 35, e: 11 };
export const FakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
}
