import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: any = {
    phone: '',
    pwd: ''
  };
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  submitRegister() {
    console.log(this.user)
  }
}
