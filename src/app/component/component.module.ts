import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarViewComponent} from "./calendar-view/calendar-view.component";
import {CalendarViewWeekComponent} from "./calendar-view-week/calendar-view-week.component";
import {CalendarViewDayComponent} from "./calendar-view-day/calendar-view-day.component";
import {CalendarViewTaskComponent} from "./calendar-view-task/calendar-view-task.component";

@NgModule({
  declarations: [
      CalendarViewComponent,
      CalendarViewWeekComponent,
      CalendarViewDayComponent,
      CalendarViewTaskComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
      CalendarViewComponent,
      CalendarViewWeekComponent,
      CalendarViewDayComponent,
      CalendarViewTaskComponent
  ]
})
export class ComponentModule { }
