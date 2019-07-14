import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss']
})
export class CalendarModalComponent{

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }
    confirm() {
      this.dismiss();
    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalCtrl.dismiss({
            'dismissed': true
        });
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
