import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-calendar-view-task',
  templateUrl: './calendar-view-task.component.html',
  styleUrls: ['./calendar-view-task.component.scss']
})
export class CalendarViewTaskComponent implements OnInit {
  @Input() items;
  constructor(private router: Router, public navCtrl: NavController) { }

  ngOnInit() {
  }
  enterTaskDetailPage(task) {
    // this.navCtrl.navigateForward(['/task-detail'], {
    //   queryParams: task
    // });
    console.log('angular 路由...');
    this.router.navigate(['/task-detail'], {
      queryParams: task
    })
  }
}
