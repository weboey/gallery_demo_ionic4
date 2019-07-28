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
    public items = [
        { val: '开会', isChecked: false, date: '14:00' },
        { val: '打羽毛球', isChecked: false, date: '2019/04/08 16:55' },
        { val: '见客户', isChecked: false, date: '2019/07/07 12:15' },
        { val: '开会2', isChecked: false, date: '14:00' },
        { val: '打羽毛球2', isChecked: false, date: '2019/04/08 16:55' },
        { val: '见客户2', isChecked: false, date: '2019/07/07 12:15' },
        { val: '开会3', isChecked: false, date: '14:00' },
        { val: '打羽毛球3', isChecked: false, date: '2019/04/08 16:55' },
        { val: '见客户3', isChecked: false, date: '2019/07/07 12:15' },
        { val: '开会999999999', isChecked: false, date: '14:00' },
        { val: '打羽毛球999999999', isChecked: false, date: '2019/04/08 16:55' },
        { val: '见客户999999999', isChecked: false, date: '2019/07/07 12:15' }
    ];
}
