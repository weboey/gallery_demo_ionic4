import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HomeComponent} from "./home.component";
@NgModule({
  declarations: [HomeComponent],
  imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      RouterModule.forChild([
          { path: '', component: HomeComponent }
          // { path: '', redirectTo: '/home', pathMatch: 'full'}
          ])
  ]
})
export class HomeModule { }
