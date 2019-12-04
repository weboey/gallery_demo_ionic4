import {Component} from '@angular/core';

import {NavController, Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Media} from "@ionic-native/media/ngx";
import {File} from "@ionic-native/file/ngx";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  backButtonPressed: boolean = false;// 返回键是否已触发
  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              public toastController: ToastController,
              private media: Media,
              private router:Router,
              public navCtrl: NavController,
              private file: File) {
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
      this.platform.backButton.subscribe(this.handleAndorraBackButtonEvent.bind(this));
      console.error(this.router.url)
    });
  }

  handleAndorraBackButtonEvent() {
    // alert(this.router.url);
    if (this.verifyPageCanShowExit()) {
      this.showExit();
      return;
    }
    // this.navCtrl.goBack();
  }
  // 校验页面是否双击退出
  verifyPageCanShowExit(): boolean {
    return this.router.url=='/home'
  }
  // 双击退出提示框
  async showExit() {
    if (this.backButtonPressed) {
      // 当触发标志为true时，双击返回按键则退出APP
      navigator['app'].exitApp(); //ionic4 退出APP的方法
    } else {
      const toast: any = await this.toastController.create({
        message: '再按一次退出应用',
        duration: 2000
      });
      toast.present();
      this.backButtonPressed = true;
      // 2秒内没有再次点击返回则将触发标志标记为false
      setTimeout(() => {
        this.backButtonPressed = false;
      }, 2000)
    }
  }
}
