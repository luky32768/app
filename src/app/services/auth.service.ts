import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, mergeMap, tap } from 'rxjs/operators';


@Injectable()
export class AuthService {
  private response: any;
  public isLoggedIn: boolean;
  public adminLoggedIn: boolean;

  constructor(private http: HttpClient) {
  }

  handleError(error: any) {
    console.log(error);
    if (error === 'invalid credentials' ||
     error === 'username already taken' ||
     error === 'account number already taken' ||
     error === 'invalid old password') {
      return of(error);
    }
  }
  verifySignature(signature: string, publicKey?: string) {
    // not implemented jwt-verifying function yet..
    if (signature === '1SI7rG_YGP8pvd4WHGJ7Ydj1BjVjDaNUpryXDxj-nSY') {
      return true;
    }
    return false;
  }
  handleLoginResponse(response: any) {
    this.response = response;
    console.log(response);
    this.isLoggedIn = true;
    console.log(this.isLoggedIn);
    // return of('verified');
    let jwt = response.token;
    localStorage.setItem('authToken', jwt);
    let signature = jwt.split('.')[2];
    console.log(signature);
    return (signature === '1SI7rG_YGP8pvd4WHGJ7Ydj1BjVjDaNUpryXDxj-nSY')? 
    { id: response.id, firstName: response.firstName,
       lastName: response.lastName, message: 'signature verified' } :
    { id: response.id, firstName: response.firstName,
       lastName: response.lastName, message: 'login was successful' };
    // response.id + 'signature verified': 
    // response.id + 'login was successful';
  }
  handleRegisterResponse(response: any) {
    console.log(response);
    return 'registered successfully';
  }
  adminLogin(credentials) {
    return this.http.post('/admin/authenticate',
     JSON.stringify(credentials))
     .pipe(
       map(response => { 
         this.adminLoggedIn = true;
         return'successfull'; 
        }),
       catchError(this.handleError)
     );
  }
  adminLogout() {
    this.adminLoggedIn = false;
  }
  login(credentials) {
    return this.http.post('/users/authenticate', 
      JSON.stringify(credentials))
        .pipe(
          tap(() => {
            console.log('tapped'); 
            this.isLoggedIn = true; 
          }),
          map(this.handleLoginResponse),
          catchError(this.handleError)
        );
  }
  register(credentials) {
    return this.http.post('/users/register',
    JSON.stringify(credentials))
      .pipe(
        map(repsonse => 'registered'),
        catchError(this.handleError)
      );
  }
  changePassword(passwords, userId) {
    console.log('userId: ', userId);
    console.log('passwords: ', passwords);
    return this.http.put(`/users/${userId}`, 
      JSON.stringify(passwords))
      .pipe(
        map(response => 'Password changed successfully'),
        catchError(this.handleError)
      );
  }
  getAuthorizationToken() {
    let jwtHelper = new JwtHelperService();
    let token = localStorage.getItem('authToken');
    
    return (jwtHelper.isTokenExpired(token)) ?
      '' : token;
    
  }
  logout() { 
    this.isLoggedIn = false;
    localStorage.removeItem('authToken');
  }
  get isLogged() {
    return this.isLoggedIn;
  }
  getUsers() {
    return this.http.get('/users');
  }
  deleteUser(id: number) {
    return this.http.delete(`/users/${id}`)
  }

}



