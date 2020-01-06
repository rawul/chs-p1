import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllService } from '../all.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login = true;
  user = {
    email: '',
    password: ''
  };
  constructor(
    private router: Router,
    private serv: AllService
  ) { }

  ngOnInit() {
  }

  loginAcc() {
    this.serv.login(this.user).subscribe(x => {
      console.log(x);
    });
  }

}
