import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HomeComponent} from "./home.component";
import {ComponentModule} from "../../component/component.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentModule,
    PipesModule,
    RouterModule.forChild([
      {path: '', component: HomeComponent},
      // { path: '', redirectTo: '/home', pathMatch: 'full'}
    ])
  ]
})
export class HomeModule {
}
