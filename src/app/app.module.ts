import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordComponent } from './password/password.component';
import { HomeComponent } from './home/home.component';

import { EmailAccountComponent } from './email-account/email-account.component';
import { MyGuard } from './my.guard';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AuthService } from './services/auth.service';
import { FakeBackendProvider } from './helpers/fake-backend';
import { AuthInterceptor } from './helpers/auth-interceptor';
import { RegisterComponent } from './register/register.component';
import { JwtModule } from '@auth0/angular-jwt';
import { OrderService } from './services/order.service';
import { EmailService } from './services/email.service';
import { NewemailComponent } from './email-account/newemail/newemail.component';
import { ReceivedComponent } from './email-account/received/received.component';
import { SentComponent } from './email-account/sent/sent.component';
import { BinComponent } from './email-account/bin/bin.component';
import { SpamComponent } from './email-account/spam/spam.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { BankAccoutComponent } from './email-account/bank-accout/bank-accout.component';
import { SendMoneyComponent } from './email-account/send-money/send-money.component';
import { SendMoneyPermanentComponent } from './email-account/send-money-permanent/send-money-permanent.component';
import { NotFoundComponent } from './not-found/not-found.component';








@NgModule({
  declarations: [
    AppComponent,
    PasswordComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    EmailAccountComponent,
    RegisterComponent,
    NewemailComponent,
    ReceivedComponent,
    SentComponent,
    BinComponent,
    SpamComponent,
    AdminLoginComponent,
    BankAccoutComponent,
    SendMoneyComponent,
    SendMoneyPermanentComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'signup/:emailaccount/:username/:id',
       component: EmailAccountComponent,
        children: [
          { path: '', component: ReceivedComponent },
          { path: 'newemail/:id', component: NewemailComponent },
          { path: 'sent/:id', component: SentComponent },
          { path: 'bin/:id', component: BinComponent },
          { path: 'spam/:id', component: SpamComponent },
          { path: 'bankaccount/:id', component: BankAccoutComponent },
          { path: 'sendmoney/:id', component: SendMoneyComponent },
          { path: 'sendmoneypermanent/:id',
           component: SendMoneyPermanentComponent }

        ]
      },
       
      { path: 'admin/login', component: AdminLoginComponent },
      { path: 'admin', component: AdminComponent,
        canActivate: [MyGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'no-access', component: NoAccessComponent },
      { path: 'signup', component: LoginComponent },
      { path: 'changepassword/:id', component: PasswordComponent },
      { path: 'signupform', component: SignupFormComponent },
      { path: '**', component: NotFoundComponent }
      
    ]),
  ],
  providers: [
    AuthService,
    PasswordComponent,
    BankAccoutComponent,
    OrderService,
    EmailService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    FakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
