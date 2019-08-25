import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, ToastController} from "@ionic/angular";
import {CalendarModalComponent} from "../calendar-modal/calendar-modal.component";
import {ActivatedRoute} from "@angular/router";
import {FileService} from "../../services/file.service";
import {File} from "@ionic-native/file/ngx";
import {HttpClient} from "@angular/common/http";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {
  audioFileName = '';
  count = 1;
  curTime = formatDate(new Date(), 'HH:mm', 'zh_CN');
  curDate = formatDate(new Date(), 'yyyy-MM-dd', 'zh_CN');
  content = '';
  constructor(public modalController: ModalController,
              private activatedRoute: ActivatedRoute,
              private file: File,
              public toastController: ToastController,
              public nav:NavController,
              private http: HttpClient,
              private fileService: FileService) { }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(q => {
      this.audioFileName = q.get('fileName');
      console.log(this.audioFileName);
      console.log(this.file.externalRootDirectory + this.audioFileName);
      this.fileService.upload(this.file.externalRootDirectory + this.audioFileName).then(data => {
        console.log(data);
        this.content = JSON.stringify(data);
      })
    })
  }

  async  openSelectDateModal() {
    const modal = await this.modalController.create({
        component: <any>CalendarModalComponent
    });
    modal.onWillDismiss().then(v => {
      console.log(v);
      this.curDate = v.data.curDate;
      this.curTime = v.data.curTime;
    });
    return await modal.present();
  }

  async saveTaskHandler() {
    const toast = await this.toastController.create({
      message: '保存成功',
      duration: 2000
    });
    this.http.post('/api_note/v1/note_view', {
      tip_time: this.curDate + ' ' + this.curTime, // '2019-08-25 14:30',
      title: this.content,
      content: this.content
    }).subscribe(res => {
      toast.present();
      setTimeout(()=>{
        this.nav.goBack();
        this.nav.goBack();
      }, 100)
    })
  }
}
