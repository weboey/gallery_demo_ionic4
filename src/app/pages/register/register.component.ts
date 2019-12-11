import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: any = {
    phone: '',
    password: ''
  };
  constructor(private http: HttpClient, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
  }

  async submitRegister() {
    this.http.post('/api_user/v1/register', this.user).subscribe((res: any) => {
      const toast = this.toastController.create({
        message: res.message,
        duration: 2000
      });
      if(res.code === '500') {
        toast.then(v => {
          v.present()
        });
      } else if(res.code === '200') {
        toast.then(v => {
          v.present()
        });
        localStorage.setItem('appUser', JSON.stringify(this.user));
        this.router.navigate(['/home']);
      }
    })
  }
}
