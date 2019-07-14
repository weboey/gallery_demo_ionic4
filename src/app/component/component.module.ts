import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarViewComponent} from "./calendar-view/calendar-view.component";
import {CalendarViewWeekComponent} from "./calendar-view-week/calendar-view-week.component";
import {CalendarViewDayComponent} from "./calendar-view-day/calendar-view-day.component";

@NgModule({
  declarations: [
      CalendarViewComponent,
      CalendarViewWeekComponent,
      CalendarViewDayComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
      CalendarViewComponent,
      CalendarViewWeekComponent,
      CalendarViewDayComponent
  ]
})
export class ComponentModule { }
