import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {addMonths, startOfWeek} from 'date-fns';
import { addDays } from 'date-fns';
// import { fnsFormat } from 'date-fns';

import { formatDate } from '@angular/common';
import { startOfMonth } from 'date-fns';
import { endOfMonth } from 'date-fns';
import { differenceInCalendarMonths } from 'date-fns';
import { differenceInCalendarWeeks } from 'date-fns';
import { differenceInCalendarDays } from 'date-fns';
import { setMonth } from 'date-fns';
import { isThisMonth } from 'date-fns';
import { isSameYear } from 'date-fns';
import { isSameMonth } from 'date-fns';
import { isSameDay } from 'date-fns';
import {DateHelperService} from "../../services/date-helper.service";
import {HttpClient} from "@angular/common/http";
import {Events} from '@ionic/angular';
declare let Swiper: any;
@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarViewComponent implements OnInit, AfterViewInit {
  @Input() nzMode = 'month';
  @Input() isLoadData = true;
  swiper: any = {isEnd: false};
  daysInWeek: DayCellContext[] = [];
  dateMatrix: DateCellContext[][] = [];
  dateMatrixList = [];
  virtualData: any;
  activeDate: Date = new Date();
  activeMonth: number;
  currentDateRow = -1;
  currentDateCol = -1;
  activeDateRow = -1;
  activeDateCol = -1;
  activeMonthRow = -1;
  activeMonthCol = -1;
  maxPoint = 4;
  minPoint = 0;
  isReady = false;
  private currentDate = new Date();
  activeMonthTasks = [];
  @ViewChild('panel', { static: true }) panel: ElementRef;
  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() nzSelectChange: EventEmitter<any> = new EventEmitter<any>();
  constructor(private element: ElementRef, private dateHelper: DateHelperService,
              private cd: ChangeDetectorRef,
              private events: Events,
              private http: HttpClient) { }
  onDateSelect(date: Date): void {
    console.log(formatDate(date, 'yyyy-MM-dd', 'zh_CN'));
    this.nzSelectChange.emit(date);
    this.updateDate(date);
  }
  ngOnInit() {
    if(this.isLoadData) {
      this.getTaskData();
    }
    this.setUpDaysInWeek();
    this.setMulMonthDateMatrix();
    // this.calculateActiveDate();
    // this.setUpDateMatrix(true);
    this.cd.detectChanges();
    this.events.subscribe('addTask', (task) => {
      console.error('增加了任务');
      console.error(task);
      const curMonthViewPanel = this.dateMatrixList.find(item => item['month'] === this.currentDate.getMonth());
      console.error(curMonthViewPanel);
      if(curMonthViewPanel) {
        curMonthViewPanel.forEach(row => {
          row.forEach( col => {
            let taskDate = new Date(task.tip_time);
            if(col.value.getMonth() === taskDate.getMonth() && col.value.getDate() === taskDate.getDate()) {
              col.tasks.push(task);
            }
          })
        })
        this.cd.detectChanges();
      }
    })
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createSwipe();
      this.activeDate = this.currentDate;
      this.calculateActiveDate();
      if(this.isLoadData) {
        this.cd.detectChanges();
      }
    }, 200);
  }
  private setUpDaysInWeek(): void {
    this.daysInWeek = [];
    const weekStart = startOfWeek(this.activeDate, { weekStartsOn: this.dateHelper.getFirstDayOfWeek()});
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const title = this.dateHelper.format(date, this.dateHelper.relyOnDatePipe ? 'E' : 'ddd');
      const label = this.dateHelper.format(date, this.dateHelper.relyOnDatePipe ? 'EEEEEE' : 'dd').slice(1);
      // const label2 = fnsFormat(date, 'EEEEEE', { locale: 'zh_CN' });
      // const label3 = formatDate(date, 'EEEEEE', 'zh_CN');
      this.daysInWeek.push({ title, label });
    }
  }
  getTaskData(month?: any, year?: any) {
    if(this.isLoadData) {
      this.http.get('/api_note/v1/query_note_view', {
        params: {
          query_type: '5',
          mouth: month ? month : '',
          year: year ? year : ''
        }
      }).subscribe((res: any) => {
        if (res) {
          console.log(res);
          this.activeMonthTasks = res.results.note_data_list;
          this.updateTask();
        }
      })
    }
  }
  updateTask() {
    const curMonthView = this.dateMatrixList.find(item => item['month'] === this.currentDate.getMonth());
    console.error('======================================================');
    console.error(curMonthView);
    console.error(this.activeMonthTasks);
    if(curMonthView) {
      curMonthView.forEach(row => {
        row.forEach( col => {
          col.tasks = [];
          this.activeMonthTasks.forEach(tasks => {
            let taskDate = new Date(tasks.tip_time);
            if(col.value.getMonth() === taskDate.getMonth() && col.value.getDate() === taskDate.getDate()) {
              col.tasks.push(tasks);
            }
          });
        })
      });
      this.cd.detectChanges();
    }
  }
  createSwipe() {
    console.log('初始化显示第几个');
    console.log(this.maxPoint/ 2);
    this.swiper = new Swiper(this.panel.nativeElement, {
      initialSlide: this.maxPoint / 2, // 初始化显示第几个
      zoom: {
        maxRatio: 4,
        toggle: false,
      },
      loop: false,
      lazyLoading: true,
      lazyLoadingOnTransitionStart: true, // lazyLoadingInPrevNext : true,
      pagination: {
        el: '.swiper-pagination' // 分页器'
      },
      paginationType: 'fraction', // 分页器类型
      on: {
        slideChange: () => {
          this.renderMonthDateMatrix(this.swiper.activeIndex);
        }
      }
    });
    this.isReady = true;
  }
  private get calendarStart(): Date {
    return startOfWeek(startOfMonth(this.activeDate), { weekStartsOn: this.dateHelper.getFirstDayOfWeek() });
  }
  private renderMonthDateMatrix(index) {
    if (typeof index === 'undefined') {
      return;
    }
    if (this.swiper.swipeDirection === 'prev') {
      this.currentDate = addMonths(this.currentDate, -1)
    } else {
      this.currentDate = addMonths(this.currentDate, 1)
    }
    this.getTaskData(this.currentDate.getMonth() + 1, this.currentDate.getFullYear());
    // this.updateTask();
    this.dateChange.emit(this.currentDate);
    console.log('月份切换后的参数.....22........');
    console.log(this.currentDate.getFullYear());
    console.log(formatDate(this.activeDate, 'yyyy-MM-dd', 'zh_CN'));
    console.log(formatDate(this.currentDate, 'yyyy-MM-dd', 'zh_CN'));
    console.log(this.activeDate.getMonth() == this.currentDate.getMonth());
    console.log(this.activeDateRow, this.activeDateCol);
  }
  private setMulMonthDateMatrix() {
    const curMonth = this.activeDate.getMonth();
    for (let i = this.minPoint; i <= this.maxPoint; i++) {
      this.monthChangeHandler(curMonth + i - this.maxPoint / 2);
    }
  }
  private setUpDateMatrix(): void {
    const dateMatrix = [];
    const monthStart = startOfMonth(this.activeDate);
    const monthEnd = endOfMonth(this.activeDate);
    let weekDiff =
      differenceInCalendarWeeks(monthEnd, monthStart, { weekStartsOn: this.dateHelper.getFirstDayOfWeek() }) + 2;
    if (this.nzMode === 'week') {
      console.log(this.nzMode);
      weekDiff = 1;
    }
    for (let week = 0; week < weekDiff - 1; week++) {
      const row: DateCellContext[] = [];
      const weekStart = addDays(this.calendarStart, week * 7);
      for (let day = 0; day < 7; day++) {
        const date = addDays(weekStart, day);
        const monthDiff = differenceInCalendarMonths(date, this.activeDate);
        const dateFormat = 'longDate';
        const title = this.dateHelper.format(date, dateFormat);
        const label = this.dateHelper.format(date, this.dateHelper.relyOnDatePipe ? 'dd' : 'DD');
        const rel = monthDiff === 0 ? 'current' : monthDiff < 0 ? 'last' : 'next';
        let tasksList = [];
        row.push({ title, label, rel, value: date, tasks: tasksList});
      }
      dateMatrix.push(row);
    }
    dateMatrix['month'] = this.activeDate.getMonth();
    this.dateMatrixList.push(dateMatrix);
  }
  private setMonthDateMatrix(monthDate) {
    const dateMatrix = [];
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const weekDiff =
      differenceInCalendarWeeks(monthEnd, monthStart, { weekStartsOn: this.dateHelper.getFirstDayOfWeek() }) + 2;

    for (let week = 0; week < weekDiff; week++) {
      const row: DateCellContext[] = [];
      const weekStart = addDays(this.calendarStart, week * 7);
      for (let day = 0; day < 7; day++) {
        const date = addDays(weekStart, day);
        const monthDiff = differenceInCalendarMonths(date, monthDate);
        const dateFormat = 'longDate';
        const title = this.dateHelper.format(date, dateFormat);
        const label = this.dateHelper.format(date, this.dateHelper.relyOnDatePipe ? 'dd' : 'DD');
        const rel = monthDiff === 0 ? 'current' : monthDiff < 0 ? 'last' : 'next';
        row.push({ title, label, rel, value: date });
      }
      dateMatrix.push(row);
    }
    this.dateMatrixList.push(dateMatrix);
    return  dateMatrix;
  }
  private calculateActiveDate(): void {
    if(!this.isReady) {
      return;
    }
    this.activeDateRow = differenceInCalendarWeeks(this.activeDate, this.calendarStart, {
      weekStartsOn: this.dateHelper.getFirstDayOfWeek()
    });
    this.activeDateCol = differenceInCalendarDays(this.activeDate, addDays(this.calendarStart, this.activeDateRow * 7));
  }
  private calculateActiveMonth() {
    this.activeMonthRow = Math.floor(this.activeDate.getMonth() / 3);
    this.activeMonthCol = this.activeDate.getMonth() % 3;
  }
  private calculateCurrentDate(): void {
    if (isThisMonth(this.activeDate)) {
      this.currentDateRow = differenceInCalendarWeeks(this.currentDate, this.calendarStart, {
        weekStartsOn: this.dateHelper.getFirstDayOfWeek()
      });
      this.currentDateCol = differenceInCalendarDays(
        this.currentDate,
        addDays(this.calendarStart, this.currentDateRow * 7)
      );
    } else {
      this.currentDateRow = -1;
      this.currentDateCol = -1;
    }
  }
  monthChangeHandler(month: number) {
    const date = setMonth(this.currentDate, month);
    this.updateDate(date);
  }
  private updateDate(date: Date, touched: boolean = true): void {
    const dayChanged = !isSameDay(date, this.activeDate);
    const monthChanged = !isSameMonth(date, this.activeDate);
    const yearChanged = !isSameYear(date, this.activeDate);
    this.activeDate = date;
    if (dayChanged) {
      this.calculateActiveDate();
    }
    if (monthChanged) {
      this.setUpDateMatrix();
      this.calculateCurrentDate();
      this.calculateActiveMonth();
    }
    if (yearChanged) {
      // this.calculateCurrentMonth();
    }
  }
  conSwipeInfo() {
    console.log(this.swiper);
  }

}


export interface DayCellContext {
  title: string;
  label: string;
}

export interface MonthCellContext {
  title: string;
  label: string;
  start: Date;
}

export interface DateCellContext {
  title: string;
  label: string;
  rel: 'last' | 'current' | 'next';
  value: Date;
  tasks?: Array<any>;
}
