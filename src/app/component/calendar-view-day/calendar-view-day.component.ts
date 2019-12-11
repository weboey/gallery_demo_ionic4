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
import {Events} from '@ionic/angular';
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
  @ViewChild('panel', { static: true }) panel: ElementRef;
  private isDayViewFull = false;
  disableSlide = false;
  timeViewList = [];
  taskList = [];
  maxPoint = 4;
  minPoint = 0;
  @Output() readonly nzSelectChange: EventEmitter<Date> = new EventEmitter();
  constructor(private element: ElementRef,
              private dateHelper: DateHelperService,
              private cd: ChangeDetectorRef,
              private events: Events,
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
    this.events.subscribe('addTask', (task) => {
      console.error('增加了任务 day');
      console.error(task);
      let taskDate = new Date(task.tip_time);
      let time = formatDate(taskDate, 'yyyy-MM-dd', 'zh_CN');
      this.taskList.forEach(taskPanel => {
        console.log(formatDate(new Date(taskPanel.date), 'yyyy-MM-dd', 'zh_CN'));
        if(formatDate(new Date(taskPanel.date), 'yyyy-MM-dd', 'zh_CN') === time) {
          taskPanel.tasks.push(task);
        }
      })
    })
  }
  public initData() {
    console.error(this.activeDate);
    this.maxPoint = differenceInCalendarDays(this.activeDate, addDays(this.calendarStartOfWeek, 0));
    // this.maxPoint = addDays(this.calendarStartOfWeek, 0 * 7);
    console.error('this.maxPoint')
    console.error(this.maxPoint)
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
    // const weekStart = startOfWeek(this.activeDate);
    const params = [];
    const week = 0;
    const weekStart = addDays(this.calendarStartOfWeek, week * 7);
    for (let day = 0; day < 7; day++) {
      const date = addDays(weekStart, day);
      params.push(formatDate(date, 'yyyy-MM-dd', 'zh_CN'))
    }
    console.log('时间');
    console.log(params);

    const curData$D00 = this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '2',
        page_size: '1000',
        page_num: '1',
        start_time: params[0],
        end_time: params[0]
      }
    });
    const curData$D0 = this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '2',
        page_size: '1000',
        page_num: '1',
        start_time: params[1],
        end_time: params[1]
      }
    });
    const curData$D1 = this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '2',
        page_size: '1000',
        page_num: '1',
        start_time: params[2],
        end_time: params[2]
      }
    });
    const curData$ = this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '2',
        page_size: '1000',
        page_num: '1',
        start_time: params[3],
        end_time: params[3],
      }
    });
    const curData$A1 = this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '2',
        page_size: '1000',
        page_num: '1',
        start_time: params[4],
        end_time: params[4],
      }
    });
    const curData$A2 = this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '2',
        page_size: '1000',
        page_num: '1',
        start_time: params[5],
        end_time: params[5],
      }
    });
    const curData$A3 = this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '2',
        page_size: '1000',
        page_num: '1',
        start_time: params[6],
        end_time: params[6],
      }
    });
    forkJoin(curData$D00, curData$D0, curData$D1, curData$, curData$A1, curData$A2, curData$A3).subscribe((res: any) => {
      if (res) {
        this.taskList = [
          {date: new Date(params[0]).getTime()},
          {date: new Date(params[1]).getTime()},
          {date: new Date(params[2]).getTime()},
          {date: new Date(params[3]).getTime()},
          {date: new Date(params[4]).getTime()},
          {date: new Date(params[5]).getTime()},
          {date: new Date(params[6]).getTime()}
        ];
        this.taskList[0]['tasks'] = res[0].results.note_data_list;
        this.taskList[1]['tasks'] = res[1].results.note_data_list;
        this.taskList[2]['tasks'] = res[2].results.note_data_list;
        this.taskList[3]['tasks'] = res[3].results.note_data_list;
        this.taskList[4]['tasks'] = res[4].results.note_data_list;
        this.taskList[5]['tasks'] = res[5].results.note_data_list;
        this.taskList[6]['tasks'] = res[6].results.note_data_list;
        console.log('我的任务');
        console.log(this.taskList);
        this.cd.detectChanges();
      }
    })
  }
  getTaskDataSingle(curDate, direction) {
    return new Promise((resolve, reject) => {
      console.log(this.taskList);
      if(this.taskList.find(item => item.date && item.date === curDate.getTime())) {
        console.error('不执行请求');
        return;
      }
      if(direction > 0) {
        this.taskList.push({tasks: [], date: curDate.getTime(), id: formatDate(curDate, 'yyyy-MM-dd', 'zh_CN')});
      } else {
        this.taskList.unshift({tasks: [], date: curDate.getTime(), id: formatDate(curDate, 'yyyy-MM-dd', 'zh_CN')});
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
          if(direction > 0) {
            this.taskList[this.taskList.length-1]['tasks'] = res.results.note_data_list;
          } else {
            this.taskList[0]['tasks'] = res.results.note_data_list;
          }
          console.error('>>>>>>>>>>>>>>>>>', this.maxPoint);
          resolve(true)
        }
      }, ()=>{reject(false)})
    })
  }
  onDateSelect(date: Date, index): void {
    this.disableSlide = true;
    this.swiper.slideTo(index);
    this.updateDate(date);
    this.nzSelectChange.emit(date);
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
      initialSlide: this.maxPoint , // 初始化显示第几个
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
        touchStart: () => {
          console.log('??????????????')
          this.disableSlide = false;
        },
        slideChange: () => {
          console.log(this.swiper);
          if(this.swiper.initialized && !this.disableSlide) {
             this.renderMonthDateMatrix(this.swiper.activeIndex);
          }
        }
      }
    });
  }
  private renderMonthDateMatrix(index) {
    console.error('滑动')
    console.error(this.swiper.activeIndex)
    console.error(this.swiper.swipeDirection);
    if (typeof index === 'undefined') {
      return;
    }
    const curDay = this.activeDate.getDay();
    console.log(curDay);
    console.log(formatDate(this.activeDate, 'yyyy-MM-dd', 'zh_CN'));
    if(this.swiper.swipeDirection === 'prev') {
      console.log('向左滑....');
      this.activeDate = addDays(this.activeDate, -1);
      const activeDatePre = addDays(this.activeDate, -2);
      this.maxPoint --;
      this.calculateActiveDate();
      this.cd.detectChanges();
      // this.getTaskDataSingle(activeDatePre, -1).then(()=>{
      //   setTimeout( () => {
      //     this.swiper.update();
      //      // this.createSwipe();
      //   }, 200);
      // });
    } else if(this.swiper.swipeDirection === 'next') {
      this.maxPoint ++;
      console.log('向右滑....');
      this.activeDate = addDays(this.activeDate, 1);
      const activeDateNext = addDays(this.activeDate, 1);
      this.calculateActiveDate();
      this.cd.detectChanges();
      // this.getTaskDataSingle(activeDateNext, 1).then(()=>{
      //   setTimeout( () => {
      //     this.swiper.update();
      //   }, 2000);
      // })
    }
    console.log(formatDate(this.activeDate, 'yyyy-MM-dd', 'zh_CN'));
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
    console.log('开始视图时间设置');
    console.log(formatDate(this.activeDate, 'yyyy-MM-dd', 'zh_CN'));
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
        console.log(date);
        row.push({ title, label, rel, value: date });
      }
      dateMatrix.push(row);
    }
    this.dateMatrixList.push(dateMatrix);
    console.error(this.dateMatrixList)
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
