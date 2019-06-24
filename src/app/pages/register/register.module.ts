import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {RegisterComponent} from './register.component';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      RouterModule.forChild([
          { path: '', component: RegisterComponent }
          ])
  ]
})
export class RegisterModule { }
