import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Media } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskListGroupComponent } from './component/task-list-group/task-list-group.component';
import {FormsModule} from "@angular/forms";
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';
import 'hammerjs';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import {NZ_DATE_CONFIG} from "./services/date-helper.service";
import { TaskCreateComponent } from './pages/task-create/task-create.component';
import { CalendarModalComponent } from './pages/calendar-modal/calendar-modal.component';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
registerLocaleData(zh);
@NgModule({
  declarations: [
      AppComponent,
      TaskListComponent,
      TaskDetailComponent,
      TaskCreateComponent,
      CalendarModalComponent
  ],
  entryComponents: [CalendarModalComponent],
  imports: [
      BrowserModule,
      FormsModule,
      IonicModule.forRoot({
          backButtonText: ''
      }),
      AppRoutingModule,
      BrowserAnimationsModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Media,
    File,
    FileTransfer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      { provide: NZ_DATE_CONFIG, useValue: {
              firstDayOfWeek: 0
          }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
