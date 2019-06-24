import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      RouterModule.forChild([
          { path: 'login', component: LoginComponent },
          { path: '', redirectTo: '/login', pathMatch: 'full'
          }])
  ]
})
export class LoginModule { }
