import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {CalendarModalComponent} from "../calendar-modal/calendar-modal.component";

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

    async  openSelectDateModal() {
      const modal = await this.modalController.create({
          component: <any>CalendarModalComponent
      });
      return await modal.present();
    }
}
