import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss']
})
export class CalendarModalComponent {
  curDate = new Date();
  curTime = formatDate(new Date(), 'HH:mm', 'zh_CN');
  constructor(public modalCtrl: ModalController) {
  }

  ngOnInit() {
  }

  confirm() {
    this.dismiss();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true,
      'curDate': formatDate(this.curDate, 'yyyy-MM-dd', 'zh_CN'),
      'curTime': this.curTime
    });
  }
  setDate(ev, field){
    console.log(ev.detail.value);
    this[field] = ev.detail.value;
  }
  monthDateChangeHandler(date) {
    console.log(formatDate(date, 'yyyy-MM-dd HH:mm', 'zh_CN'));
    this.curDate = date;
  }

  ionModalDidDismiss() {

  }

  ionModalDidPresent() {

  }

  ionModalWillDismiss() {

  }

  ionModalWillPresent() {

  }
}
