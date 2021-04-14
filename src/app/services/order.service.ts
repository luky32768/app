import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class OrderService {

  constructor(private http: HttpClient) {
  }

  getOrders() { 
    return this.http.get('/api/orders');
      
  }
}
