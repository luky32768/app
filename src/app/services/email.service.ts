import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  sendEmail(adress, message, userId) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    time = date + '  ' + time;
    console.log(time);
    return this.http.post('/email/' + userId, { adress, message, time });
  }
  getReceivedMails(userId) {
    return this.http.get('/emails/received/' + userId);
  }
  getSentMails(userId) {
    return this.http.get('/emails/sent/' + userId);
  }
  getDeletedMails(userId) {
    return this.http.get('/emails/bin/' + userId);
  }
  deleteEmail(folder: string, index: number, userId: number) {
    return this.http.delete(`/email/${folder}/${index}/${userId}`);
  }
  markMailAsRead(index: number, userId: number) {
    return this.http.put(`/emails/received/${index}/${userId}`,
     { read: true });
  }
  getBankAccountAmount(userId: number) {
    return this.http.get('/bankaccount/amount/' + userId);
  }
  getBankAccountPastTransactions(userId: number) {
    return this.http.get('/bankaccount/pasttransactions/' + userId);
  }
  getBankAccountFutureTransactions(userId: number) {
    return this.http.get('/bankaccount/futuretransactions/' + userId);
  }
  deletePastTransaction(index: number, userId: number) {
    return this.http.delete(
      `/bankaccount/pasttransactions/${index}/${userId}`
      );
  }

  sendMoney(details, userId) {
    return this.http.post('/bankaccount/send/' + userId, 
    JSON.stringify(details));
  }
  sendMoneyPermanent(details, userId) {
    return this.http.post('/bankaccount/sendpermanent/' + userId,
    JSON.stringify(details));
  }
  setFutureTransaction(details, userId) {
    return this.http.post('/bankaccount/futuretransaction/' + userId,
    JSON.stringify(details));
  }
  deleteFutureTransaction(userId: number) {
    return this.http.delete(
      `/bankaccount/futuretransaction/${userId}`);
  }

  // getNumberOfUnreadMails(userId: number) {
  //   return this.http
  // }

}
