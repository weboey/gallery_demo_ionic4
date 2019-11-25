import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Media} from "@ionic-native/media/ngx";
import {File} from "@ionic-native/file/ngx";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private media: Media,
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
    });
  }
}
