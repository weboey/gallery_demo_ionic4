import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {CalendarModalComponent} from "../calendar-modal/calendar-modal.component";
import {ActivatedRoute} from "@angular/router";
import {FileService} from "../../services/file.service";
import {File} from "@ionic-native/file/ngx";

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {
  audioFileName = '';
  constructor(public modalController: ModalController,
              private activatedRoute: ActivatedRoute,
              private file: File,
              private fileService: FileService) { }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(q => {
      this.audioFileName = q.get('fileName');
      console.log(this.audioFileName);
      console.log(this.file.externalRootDirectory + this.audioFileName);
      // this.fileService.upload(this.file.externalRootDirectory + this.audioFileName).then(data => {
      //   console.log(data);
      // })
    })
  }

  async  openSelectDateModal() {
    const modal = await this.modalController.create({
        component: <any>CalendarModalComponent
    });
    return await modal.present();
  }
}
