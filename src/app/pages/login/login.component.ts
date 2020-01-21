import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: any = {
    phone: '',
    password: ''
  };
  btnStatus = true;
  passwordType = 'password';
  constructor(private http: HttpClient, private router: Router, private toastController: ToastController) { }

  ngOnInit() {
  }
  ionViewCanLeave() {
    return false;
  }
  submitLogin() {
    // this.router.navigate(['/home']);
    this.http.post('/api_user/v1/login', this.user).subscribe((res: any) => {
      const toast = this.toastController.create({
        message: res.message,
        duration: 2000
      });
      if(res.code === '500') {
        toast.then(v => {
          v.present()
        });
      } else if(res.code === '200') {
        localStorage.setItem('appUser', JSON.stringify(this.user));
        localStorage.setItem('access_token', res.results.data_info.access_token);
        localStorage.setItem('refresh_token', res.results.data_info.refresh_token);
        this.router.navigate(['/']);
      }
    })
  }

  checkBtnStatus() {
    setTimeout(()=>{
      this.btnStatus = !(this.user.phone.length && this.user.password.length);
    }, 200);
  }


  switchPasswordInputType(pwdInput: any) {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    setTimeout(() => pwdInput.setFocus(), 100);
  }
}
