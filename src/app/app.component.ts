import {Component} from '@angular/core';
import {NavController, Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Media} from "@ionic-native/media/ngx";
import {File} from "@ionic-native/file/ngx";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  backButtonPressed = false; // 返回键是否已触发
  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      public toastController: ToastController,
      private media: Media,
      private router:Router,
      private navC: NavController,
      private file: File
  ) {
    this.initializeApp();
  }

  initializeApp() {
      this.platform.ready().then(() => {
          this.statusBar.styleDefault();
          this.statusBar.styleBlackOpaque();
          this.statusBar.backgroundColorByHexString("#2a2d32");
          this.splashScreen.hide();
          if (!localStorage.getItem('isPermission')) {
              let audioFile = this.media.create(this.file.dataDirectory + `audio.mp3`);
              audioFile.startRecord();
              setTimeout(() => {
                  audioFile.stopRecord();
                  localStorage.setItem('isPermission', '1');
              }, 50);
          }
          if(!localStorage.getItem('appUser')) {
            this.navC.navigateForward('/login');
          }
          this.platform.backButton.subscribe(()=>{
              if(this.router.url === '/') {
                  if (this.backButtonPressed) {
                      // 当触发标志为true时，双击返回按键则退出APP
                      navigator['app'].exitApp(); //ionic4 退出APP的方法
                  } else {
                      this.miniApp();
                      this.backButtonPressed = true;
                      setTimeout(() => {
                          this.backButtonPressed = false;
                      }, 2000);
                      return false;
                  }
              }
          });
      });
  }

  async miniApp() {
    const toast: any = await this.toastController.create({
        message: '再按一次退出应用',
        duration: 1000
    });
    toast.present();
  }
}
