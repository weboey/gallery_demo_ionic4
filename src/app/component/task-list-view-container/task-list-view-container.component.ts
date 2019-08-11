import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll} from "@ionic/angular";
import {animate, style, transition, trigger} from "@angular/animations";
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-task-list-view-container',
  templateUrl: './task-list-view-container.component.html',
  styleUrls: ['./task-list-view-container.component.scss'],
    animations: [
        trigger('myInsertRemoveTrigger', [
            transition(':enter', [
                style({ height: 0 }),
                animate('.25s', style({ height: 78 })),
            ]),
            transition(':leave', [
                animate('.25s', style({ height: 0}))
            ])
        ])
    ]
})
export class TaskListViewContainerComponent implements OnInit {
    startDate = formatDate(new Date(), 'yyyy-MM-dd', 'zh_CN');
    endDate = formatDate(new Date(), 'yyyy-MM-dd', 'zh_CN');
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    constructor() { }
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
    setDate(ev, field){
      this[field] = ev.detail.value;
    }
    queryHandler() {
      console.log(this.startDate, this.endDate, '22')
    }
}