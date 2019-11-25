import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: any = {
    phone: '',
    pwd: ''
  };
  btnStatus = true;
  passwordType = 'password';
  constructor(private router: Router) { }

  ngOnInit() {
  }

  submitLogin() {
    console.log(this.user);

    this.router.navigate(['/home']);
  }

  checkBtnStatus() {
    setTimeout(()=>{
      this.btnStatus = !(this.user.phone.length && this.user.pwd.length)
      console.log(this.user);
      console.log(this.btnStatus);
    }, 200);
  }

  switchPasswordInputType(pwdInput: any) {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    setTimeout(() => pwdInput.setFocus(), 100);
  }
}
