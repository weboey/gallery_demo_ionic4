import {AfterViewInit, Component, OnInit} from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    this.createCalendar();
  }
  createCalendar() {
    console.log('创建日历');
    const options = window['plugins'].calendar.getCreateCalendarOptions();
    options.calendarName = "MyCordovaCalendar";
    options.calendarColor = "#FF0000"; // red
      window['plugins'].calendar.createCalendar(options, this.onSuccess, this.onError);
  }

  onSuccess(msg) {
      alert('Calendar success: ' + JSON.stringify(msg));
  }

  onError(msg) {
      alert('Calendar error: ' + JSON.stringify(msg));
  }
}
