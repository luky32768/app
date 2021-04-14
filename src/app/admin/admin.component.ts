
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  orders: any;
  users: any;

  constructor(private orderService: OrderService, 
    private service: AuthService, private router: Router) { }

  ngOnInit() {
    this.orderService.getOrders()
      .subscribe(orders => this.orders = orders);
  }
  showUsers() {
    this.service.getUsers()
      .subscribe(users => { this.users = users; console.log(users); });
  }
  hideUsers() {
    this.users = null;
  }
  deleteUser(id: number) {
    this.service.deleteUser(id)
      .subscribe(response => {
        console.log('deleted');
        this.users = this.users.filter(x => x.id !== id);
      }); 
  }
  logout() {
    this.service.adminLogout();
    this.router.navigate(['/']);
  }
}
