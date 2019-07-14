import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Router} from "@angular/router";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
    animations: [
        trigger('myInsertRemoveTrigger', [
            transition(':enter', [
                style({ height: 0 }),
                animate('.22s', style({ height: '*' })),
            ]),
            transition(':leave', [
                animate('.22s', style({ height: 0}))
            ])
        ])
    ]
})
export class HomeComponent implements OnInit, AfterViewInit {
    viewMode = 'day';
  constructor(private media: Media, private file: File, private router: Router) { }
    navView = false;
    isAudioRecording = false;
  ngOnInit() {

  }
  ngAfterViewInit(): void {
    this.createCalendar();
  }
  createCalendar() {
    console.log('创建日历');
  }

  openRecordSound() {
    alert('开始录音');
      const file: MediaObject = this.media.create(this.file.externalRootDirectory + 'file2.mp3');
      file.startRecord();
      // file.stopRecord();
      setTimeout(() => {
          file.stopRecord();
          alert('录音 over');
      }, 20000);
  }
  openRecordSound2() {
      console.log('开始录音');
      this.isAudioRecording = true;
      // this.file.createFile(this.file.externalRootDirectory, 'my_file.mp3', true).then(() => {
      //     let file = this.media.create(this.file.externalRootDirectory + 'my_file.m4a');
      //     file.startRecord();
      //     setTimeout(() => {
      //         file.stopRecord();
      //         alert('录音 over');
      //     }, 30000);
      // });
      //   window.document.addEventListener('')
  }
    stopRecord() {
        console.log('结束录音');
        this.isAudioRecording = false;
    }
    removeRecord() {
        alert('删除录音');
    }
    showNavListPanel() {
        this.navView = !this.navView;
    }

    toggleMode(v) {
        this.viewMode = v;
    }

    enterCreateTaskPage() {
        this.router.navigate(['/task-create'])
    }
}
