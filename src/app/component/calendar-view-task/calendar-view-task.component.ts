import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-calendar-view-task',
  templateUrl: './calendar-view-task.component.html',
  styleUrls: ['./calendar-view-task.component.scss']
})
export class CalendarViewTaskComponent implements OnInit {
  @Input() items;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  enterTaskDetailPage(task) {
    this.router.navigate(['/task-detail'], {
      queryParams: task
    })
  }
}
