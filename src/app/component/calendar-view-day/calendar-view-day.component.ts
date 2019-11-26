import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {addMonths, startOfWeek} from 'date-fns';
import { addDays } from 'date-fns';
// import { fnsFormat } from 'date-fns';
import {DateHelperService} from "../../services/date-helper.service";
import { formatDate } from '@angular/common';
import { startOfMonth } from 'date-fns';
import { endOfMonth } from 'date-fns';
import { endOfWeek } from 'date-fns';
import { differenceInCalendarMonths } from 'date-fns';
import { differenceInCalendarWeeks } from 'date-fns';
import { differenceInCalendarDays } from 'date-fns';
import { setMonth } from 'date-fns';
import { isThisMonth } from 'date-fns';
import { isSameYear } from 'date-fns';
import { isSameMonth } from 'date-fns';
import { isSameDay } from 'date-fns';
import {CalendarBase} from "../calendar-base/calendar-base";
import {HttpClient} from "@angular/common/http";
import {forkJoin} from "rxjs/index";
declare let Swiper: any;
@Component({
  selector: 'app-calendar-view-day',
  templateUrl: './calendar-view-day.component.html',
  styleUrls: ['./calendar-view-day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarViewDayComponent extends CalendarBase implements OnInit, AfterViewInit {
  @Input() nzMode = 'month';
  swiper: any = {isEnd: false};
  daysInWeek: DayCellContext[] = [];
  dateMatrix: DateCellContext[][] = [];
  dateMatrixList = [];
  virtualData: any;
  activeDate: Date = new Date();
  activeMonth: number;
  dateFullCell: TemplateRef<{ $implicit: Date }> | null = null;
  currentDateRow = -1;
  currentDateCol = -1;
  activeDateRow = -1;
  activeDateCol = -1;
  activeMonthRow = -1;
  activeMonthCol = -1;
  private currentDate = new Date();
  @ViewChild('panel') panel: ElementRef;
  private isDayViewFull = false;
  timeViewList = [];
  taskList = [];
  maxPoint = 2;
  minPoint = 0;
  @Output() readonly nzSelectChange: EventEmitter<Date> = new EventEmitter();
  constructor(private element: ElementRef,
              private dateHelper: DateHelperService,
              private cd: ChangeDetectorRef,
              private http: HttpClient) {
    super();
  }

  ngOnInit() {
    console.error('????????????????');
    this.setUpDaysInWeek();
    this.setMulMonthDateMatrix();
    // this.activeDate = this.currentDate;
    // this.setUpDateMatrix(true);
    this.calculateActiveDate();
    this.setTimeViewData();
    this.initData();
  }
  public initData() {
    this.getTaskData();
  }
  setTimeViewData() {
    for (let i = 0; i < 24; i++) {
      if (i < 10 ) {
        this.timeViewList.push(`0${i}:00`);
      } else {
        this.timeViewList.push(`${i}:00`);
      }
    }
  }
  getTaskData(curDate = this.activeDate) {
    const curData$D1 = this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '2',
        page_size: '1000',
        page_num: '1',
        start_time: formatDate(addDays(curDate, -1), 'yyyy-MM-dd', 'zh_CN'),
        end_time: formatDate(addDays(curDate, -1), 'yyyy-MM-dd', 'zh_CN')
      }
    });
    const curData$ = this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '2',
        page_size: '1000',
        page_num: '1',
        start_time: formatDate(curDate, 'yyyy-MM-dd', 'zh_CN'),
        end_time: formatDate(curDate, 'yyyy-MM-dd', 'zh_CN')
      }
    });
    const curData$A1 = this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '2',
        page_size: '1000',
        page_num: '1',
        start_time: formatDate(addDays(curDate, 1), 'yyyy-MM-dd', 'zh_CN'),
        end_time: formatDate(addDays(curDate, 1), 'yyyy-MM-dd', 'zh_CN')
      }
    });
    forkJoin(curData$D1, curData$, curData$A1).subscribe((res: any) => {
      if (res) {
        this.taskList = [
          {date: addDays(curDate, -1).getTime()},
          {date: curDate.getTime()},
          {date: addDays(curDate, 1).getTime()}
        ];
        this.taskList[0]['tasks'] = res[0].results.note_data_list;
        this.taskList[1]['tasks'] = res[1].results.note_data_list;
        this.taskList[2]['tasks'] = res[2].results.note_data_list;
        console.log('我的任务');
        console.log(this.taskList);
        this.cd.detectChanges();
      }
    })
  }
  getTaskDataSingle(curDate, direction) {
    console.log(this.taskList);
    if(this.taskList.find(item => item.date && item.date === curDate.getTime())) {
      console.error('不执行请求');
      return;
    }
    if(direction) {
      this.taskList.push({tasks: [], date: curDate.getTime()});
    } else {
      this.taskList.unshift({tasks: [], date: curDate.getTime()});
    }
    this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '2',
        page_size: '1000',
        page_num: '1',
        start_time: formatDate(curDate, 'yyyy-MM-dd', 'zh_CN'),
        end_time: formatDate(curDate, 'yyyy-MM-dd', 'zh_CN')
      }
    }).subscribe((res: any) => {
      if (res) {
        if(direction) {
          this.taskList[this.taskList.length-1]['tasks'] = res.results.note_data_list;
        } else {
          this.taskList[0]['tasks'] = res.results.note_data_list;
        }
        this.cd.detectChanges();
      }
    })
  }
  onDateSelect(date: Date): void {
    this.updateDate(date);
    this.nzSelectChange.emit(date);
    this.getTaskData();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createSwipe();
      console.log(this.dateMatrixList);
      console.log(this.taskList);
    }, 300);
  }
  private setUpDaysInWeek(): void {
    this.daysInWeek = [];
    const weekStart = startOfWeek(this.activeDate, { weekStartsOn: this.dateHelper.getFirstDayOfWeek()});
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      // const title = this.dateHelper.format(date, this.dateHelper.relyOnDatePipe ? 'E' : 'ddd');
      // const label = this.dateHelper.format(date, this.dateHelper.relyOnDatePipe ? 'EEEEEE' : 'dd').slice(1);
      const title = formatDate(date, 'E', 'zh_CN');
      const label = formatDate(date, 'EEEEEE', 'zh_CN').slice(1);

      this.daysInWeek.push({ title, label });
    }
  }
  createSwipe() {
    console.log('?????????????');
    console.log(Swiper);
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
          console.log(this.swiper);
          if(this.swiper.initialized) {
            this.renderMonthDateMatrix(this.swiper.activeIndex);
          }
        }
      }
    });
  }
  private renderMonthDateMatrix(index) {
    if (typeof index === 'undefined') {
      return;
    }
    const i = index - this.maxPoint / 2;
    const curDay = this.activeDate.getDay();
    console.log(curDay);
    console.log(i);
    console.log(formatDate(this.activeDate, 'yyyy-MM-dd', 'zh_CN'));
    // if (i > 0) {
    //   if (Math.abs(this.maxPoint - i) <= 4) {
    //     this.maxPoint ++;
    //   }
    //
    // } else {
    //   if (Math.abs(this.minPoint - i) <= 4) {
    //     this.maxPoint --;
    //   }
    // }
    if(this.swiper.swipeDirection === 'prev') {
      console.log('向左滑....');
      this.activeDate = addDays(this.activeDate, -1);
      const activeDatePre = addDays(this.activeDate, -1);
      this.getTaskDataSingle(activeDatePre, -1);
      this.maxPoint --;
    } else {
      this.maxPoint ++;
      console.log('向右滑....');
      this.activeDate = addDays(this.activeDate, 1);
      const activeDateNext = addDays(this.activeDate, 1);
      this.getTaskDataSingle(activeDateNext, 1)
    }
    console.log(formatDate(this.activeDate, 'yyyy-MM-dd', 'zh_CN'));
    this.calculateActiveDate();
    this.cd.detectChanges();
    setTimeout( () => {
      this.swiper.update();
    }, 100);
  }

  private get calendarStart(): Date {
    return startOfWeek(startOfMonth(this.activeDate), { weekStartsOn: this.dateHelper.getFirstDayOfWeek() });
  }
  // 计算周
  private get calendarStartOfWeek(): Date {
    return startOfWeek(this.activeDate, { weekStartsOn: this.dateHelper.getFirstDayOfWeek() });
  }
  // 日视图 设置当月数据
  private setMulMonthDateMatrix() {
    const curMonth = this.activeDate.getMonth();
    // for (let i = 1; i < 5; i++) {
    //   this.monthChangeHandler(curMonth + i - 2);
    // }
    // this.monthChangeHandler(curMonth);
    this.setUpDateMatrix();
  }
  setUpDateMatrix(): void {
    const dateMatrix = [];
    const monthStart = startOfMonth(this.activeDate);
    const weekStart = startOfWeek(this.activeDate);
    const monthEnd = endOfMonth(this.activeDate);
    const weekEnd = endOfWeek(this.activeDate);
    console.log(formatDate(weekStart, 'yyyy-MM-dd', 'zh_CN'));
    console.log(formatDate(weekEnd, 'yyyy-MM-dd', 'zh_CN'));
    const weekDiff =
      differenceInCalendarWeeks(monthEnd, monthStart, { weekStartsOn: this.dateHelper.getFirstDayOfWeek() }) + 2;
    for (let week = 0; week < 1; week++) {
      const row: DateCellContext[] = [];
      const weekStart = addDays(this.calendarStartOfWeek, week * 7);
      for (let day = 0; day < 7; day++) {
        const date = addDays(weekStart, day);
        const monthDiff = differenceInCalendarMonths(date, this.activeDate);
        const dateFormat = 'longDate';
        const title = this.dateHelper.format(date, dateFormat);
        const label = this.dateHelper.format(date, this.dateHelper.relyOnDatePipe ? 'dd' : 'DD');
        const rel = monthDiff === 0 ? 'current' : monthDiff < 0 ? 'last' : 'next';
        row.push({ title, label, rel, value: date });
      }
      dateMatrix.push(row);
    }
    this.dateMatrixList.push(dateMatrix);
  }
  calculateActiveDate(): void {
    this.activeDateRow = differenceInCalendarWeeks(this.activeDate, this.calendarStartOfWeek, {
      weekStartsOn: this.dateHelper.getFirstDayOfWeek()
    });
    this.activeDateCol = differenceInCalendarDays(this.activeDate, addDays(this.calendarStartOfWeek, this.activeDateRow * 7));
  }
  calculateActiveMonth() {
    this.activeMonthRow = Math.floor(this.activeDate.getMonth() / 3);
    this.activeMonthCol = this.activeDate.getMonth() % 3;
  }
  calculateCurrentDate(): void {
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
    console.log(`计算第${month}的数据`);
    const date = setMonth(this.activeDate, month);
    console.log(formatDate(date, 'yyyy-MM-dd', 'zh_CN'));
    this.updateDate(date);
  }
  updateDate(date: Date, touched: boolean = true): void {
    const dayChanged = !isSameDay(date, this.activeDate);
    const monthChanged = !isSameMonth(date, this.activeDate);
    const yearChanged = !isSameYear(date, this.activeDate);
    console.log('重要---------------------当前 activeDate');
    this.activeDate = date;
    console.log(this.activeDate);
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

  doCalendarDayViewSize() {
    console.log('?????????');
    this.isDayViewFull = !this.isDayViewFull;
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
}
