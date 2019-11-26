import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Media, MediaObject} from '@ionic-native/media/ngx';
import {File} from '@ionic-native/file/ngx';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Router} from "@angular/router";
import {UtilsService} from "../../services/utils.service";
import {CalendarViewDayComponent} from "../../component/calendar-view-day/calendar-view-day.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({height: 0}),
        animate('.22s', style({height: 40})),
      ]),
      transition(':leave', [
        animate('.22s', style({height: 0}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, AfterViewInit {
  viewMode = 'list';
  audioText = '手指上划取消录音';
  curDate = new Date();
  constructor(private media: Media, private file: File, private router: Router,
              private utils: UtilsService) {
  }
  @ViewChild(CalendarViewDayComponent) CalendarViewDayComponent;
  navView = false;
  audioFile: MediaObject = null;
  isAudioRecording = false;
  isStopRecord = false;
  fileName = '';

  ngOnInit() {

  }
  monthDateChangeHandler(date) {
    this.curDate = date;
  }
  ngAfterViewInit(): void {
    this.createCalendar();
  }

  createCalendar() {
    console.log('创建日历');
  }

  openRecordSound() {
    console.log('开始录音');
    this.audioText = '手指上划取消录音';
    this.isAudioRecording = true;
    this.isStopRecord = false;
    this.fileName = this.utils.generateRandomString(8);
    this.audioFile = this.media.create(this.file.externalRootDirectory + `${this.fileName}.mp3`);
    this.audioFile.startRecord();
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
    this.audioText = '录音已取消';
    this.audioFile.release();
    this.isStopRecord = true;
    setTimeout(() => {
      console.log('结束录音');
      this.isAudioRecording = false;
    }, 500);
  }
  ionViewWillEnter() {

  }
  ionViewDidEnter() {
    console.log('进入首页');
    // this.CalendarViewDayComponent && this.CalendarViewDayComponent.initData();
    this.isAudioRecording = false;
    this.audioFile = null;
    this.isAudioRecording = false;
    this.isStopRecord = false;
    this.fileName = '';
  }
  ionViewWillLeave() {

  }
  ionViewDidLeave() {

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

  oneP2(ev) {
    const evProp = ev.touches[0];
    const target = document.elementFromPoint(evProp.clientX || evProp.pageX, evProp.clientY || evProp.pageY);
    if (target && (target.classList.contains('audio-modal') || target.parentNode['classList'].contains('audio-modal'))) {
      this.stopRecord();
    }
  }

  stopRecordSound() {
    if (!this.isStopRecord && this.isAudioRecording) {
      this.audioFile && this.audioFile.stopRecord();
      this.isAudioRecording = false;
      setTimeout(()=>{
        this.enterCreateTaskPage(`${this.fileName}.mp3`)
      }, 50)
    }
  }
  enterCreateTaskPage(fileName?: string) {
    this.isAudioRecording = false;
    this.router.navigate(['/task-create'], {queryParams: {fileName}})
  }
}
