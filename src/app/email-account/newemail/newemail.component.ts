import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-newemail',
  templateUrl: './newemail.component.html',
  styleUrls: ['./newemail.component.css']
})
export class NewemailComponent implements OnInit {
  userId: number;
  respondTo = '';
  responding: boolean;
  textToSend = '';
  sentSuccessfully: boolean;
  unknownEmailAdrress: boolean;
  f = new FormGroup({
    adress: new FormControl(''),
    message: new FormControl('')
  });
  
  constructor(private emaiService: EmailService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userId = + this.route.snapshot.paramMap.get('id');
    console.log(this.route.snapshot.paramMap.get('username'));
    console.log(this.userId);
    this.respondTo = this.route.snapshot.queryParamMap.get('respondTo');
    if (this.respondTo) {
      this.responding = true;
      this.textToSend = "Hello " + this.respondTo + " !";
      this.f.get('adress').setValue(this.respondTo);
      this.f.get('message').setValue(this.textToSend);
    }
    
  }
  send(email) {
    console.log(email);
    let adress = email.adress as string;
    let message = email.message as string;
    this.emaiService.sendEmail(adress, message, this.userId)
      .subscribe(response => this.sentSuccessfully = true,
        error => this.unknownEmailAdrress = true
       )
  }

}
