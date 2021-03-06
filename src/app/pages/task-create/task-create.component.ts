import {Component, OnInit} from '@angular/core';
import {Events, ModalController, NavController, ToastController} from '@ionic/angular';
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
    audioFilePath = '';

    constructor(public modalController: ModalController,
                private activatedRoute: ActivatedRoute,
                private file: File,
                public toastController: ToastController,
                public nav: NavController,
                private http: HttpClient,
                private events: Events,
                private fileService: FileService) {
    }

    ngOnInit() {
        this.activatedRoute.queryParamMap.subscribe(q => {
            this.audioFileName = q.get('fileName');
            // console.log(this.audioFileName);
            // console.log(this.file.externalRootDirectory + this.audioFileName);
            if (!!this.audioFileName) {
                setTimeout(()=>{
                    this.fileService.upload(this.file.externalDataDirectory  + this.audioFileName).then((data: any) => {
                        if (data.code === '200') {
                            this.audioFilePath = data.results.file_path;
                            this.content = data.results.content;
                        } else {
                            this.audioTip(data);
                        }
                    })
                }, 10)
            }
        })
    }

    async audioTip(data) {
        const toast = await this.toastController.create({
            message: JSON.stringify(data),
            duration: 2000
        });
        toast.present();
    }

    async openSelectDateModal() {
        const modal = await this.modalController.create({
            component: <any>CalendarModalComponent,
          backdropDismiss: false
        });
        modal.onDidDismiss().then(v => {
            this.curDate = v.data.curDate;
            this.curTime = v.data.curTime;
        });
        modal.present();
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
        }).subscribe((res: any) => {
            toast.present();
            this.events.publish('addTask', res.results);
            setTimeout(() => {
                this.nav.back();
                // this.nav.goBack();
            }, 100)
        })
    }
}
