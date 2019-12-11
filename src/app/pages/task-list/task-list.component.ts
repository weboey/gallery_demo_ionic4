import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll} from "@ionic/angular";
import {animate, style, transition, trigger} from "@angular/animations";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({height: 0}),
        animate('.25s', style({height: 100})),
      ]),
      transition(':leave', [
        animate('.25s', style({height: 0}))
      ])
    ])
  ]
})
export class TaskListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: true}) infiniteScroll: IonInfiniteScroll;
  startTime = '';
  endTime = '';
  constructor(private http: HttpClient) {
  }

  queryView = false;
  curDate = new Date();

  ngOnInit() {
  }

  loadData(event) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Async operation has ended');
        resolve();
        event.target.complete();
        event.target.disabled = true;
      }, 2000);
    })
  }

  // doInfinite(infiniteScroll) {
  //     //如果是第一页，则隐藏ion-infinite-scroll，即“正在加载更多”
  //     if (this.isFirstPage) {
  //         infiniteScroll.target.complete();
  //         infiniteScroll.target.disabled = false;
  //     } else {
  //         //如果不是第一页，则继续刷新（调用queryPressRecord（方法））
  //         this.queryPressRecord(infiniteScroll);
  //     }
  // }
  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      this.infiniteScroll.disabled = false;
      event.target.complete();
    }, 2000);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  customQuery() {
    this.queryView = !this.queryView;
  }
  queryTaskHandle() {
    console.log(this.startTime);
    console.log(this.endTime);
    this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '2',
        page_size: '50',
        page_num: '1',
        start_time: this.startTime,
        end_time: this.endTime
      }
    }).subscribe()
  }
}
