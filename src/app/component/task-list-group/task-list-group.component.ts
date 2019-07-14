import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-list-group',
  templateUrl: './task-list-group.component.html',
  styleUrls: ['./task-list-group.component.scss']
})
export class TaskListGroupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
    public form = [
        { val: '开会', isChecked: true, date: '14:00' },
        { val: '打羽毛球', isChecked: false, date: '2019/04/08 16：55' },
        { val: '见客户', isChecked: false, date: '2019/07/07 12：15' },
        { val: '开会2', isChecked: true, date: '14:00' },
        { val: '打羽毛球2', isChecked: false, date: '2019/04/08 16：55' },
        { val: '见客户2', isChecked: false, date: '2019/07/07 12：15' }
    ];
}
