import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarViewComponent} from "./calendar-view/calendar-view.component";
import {CalendarViewWeekComponent} from "./calendar-view-week/calendar-view-week.component";
import {CalendarViewDayComponent} from "./calendar-view-day/calendar-view-day.component";
import {CalendarViewTaskComponent} from "./calendar-view-task/calendar-view-task.component";
import { TaskListViewContainerComponent } from './task-list-view-container/task-list-view-container.component';
import {IonicModule} from "@ionic/angular";
import {TaskListGroupComponent} from "./task-list-group/task-list-group.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
      CalendarViewComponent,
      CalendarViewWeekComponent,
      CalendarViewDayComponent,
      CalendarViewTaskComponent,
      TaskListGroupComponent,
      TaskListViewContainerComponent
  ],
  imports: [
      FormsModule,
    IonicModule.forRoot(),
    CommonModule
  ],
  exports: [
      CalendarViewComponent,
      CalendarViewWeekComponent,
      CalendarViewDayComponent,
      TaskListGroupComponent,
      TaskListViewContainerComponent,
      CalendarViewTaskComponent
  ]
})
export class ComponentModule { }
