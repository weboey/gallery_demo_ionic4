import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ResetPasswordComponent} from "./reset-password.component";

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      RouterModule.forChild([
        { path: '', component: ResetPasswordComponent }
      ])
  ]
})
export class ResetPasswordModule { }
