import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, TemplateRef,
  ViewChild
} from '@angular/core';
import { startOfWeek } from 'date-fns';
import { addDays } from 'date-fns';
// import { fnsFormat } from 'date-fns';
import {DateHelperService} from "../../services/date-helper.service";
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
import {forkJoin} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
declare let Swiper: any;
@Component({
  selector: 'app-calendar-view-week',
  templateUrl: './calendar-view-week.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar-view-week.component.scss']
})
export class CalendarViewWeekComponent implements OnInit, AfterViewInit {
  @Input() nzMode = 'month';
  swiper: any = {isEnd: false};
  timeViewList = [];
  taskList = [];
  daysInWeek: DayCellContext[] = [];
  dateMatrix: DateCellContext[][] = [];
  dateMatrixList = [];
  activeDate: Date = new Date();
  activeMonth: number;
  currentDateRow = -1;
  currentDateCol = -1;
  activeDateRow = -1;
  activeDateCol = -1;
  activeMonthRow = -1;
  activeMonthCol = -1;
  private currentDate = new Date();
  maxPoint = 0;
  curPoint = 0;
  @ViewChild('panel', { static: true }) panel: ElementRef;
  constructor(private element: ElementRef, private dateHelper: DateHelperService,
              private cd: ChangeDetectorRef,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit() {
    this.setUpDaysInWeek();
    this.setMulMonthDateMatrix();
    this.setUpDateMatrix(true);
    this.calculateActiveDate();
    this.setTimeViewData();
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
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createSwipe();
      console.log('当前视图的日历数据...');
      console.log(this.dateMatrixList);
      this.activeDate = this.currentDate;
      this.calculateActiveDate();
      this.cd.detectChanges();
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
  createSwipe() {
    console.log('?????????????');
    console.log(Swiper);
    this.swiper = new Swiper(this.panel.nativeElement, {
      initialSlide: this.curPoint, // 初始化显示第几个
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
        // slideChange: () => {
        //   console.log(this.swiper);
        //   if (this.swiper && this.swiper.isEnd) {
        //     this.swiper.slideTo(2, 0);
        //   }
        // }
      },
    });
  }
  getTaskData() {
    this.http.get('/api_note/v1/query_note_view', {
      params: {
        query_type: '4'
      }
    }).subscribe((res: any) => {
      if (res) {
        const taskResults = res.results.note_data_list;
        this.dateMatrixList[this.curPoint].forEach(weekItem => {
          const weekTasks = [];
          weekItem.forEach(col => {
            console.log(col);
            taskResults.forEach(tasks => {
              let taskDate = new Date(tasks.tip_time);
              // tasks['colOffset'] = differenceInCalendarDays(taskDate, addDays(this.calendarStart, this.activeDateRow * 7));
              if(col.value.getMonth() === taskDate.getMonth() && col.value.getDate() === taskDate.getDate()) {
                weekTasks.push(tasks);
              }
            });
          });
          console.log('这周的任务');
          console.log(weekItem);
          console.error(this.dateMatrixList[this.curPoint]);
          this.dateMatrixList[this.curPoint].tasks = this.dateMatrixList[this.curPoint].tasks.map(row => {
            const argsH = row[0][0].title.split(':')[0];
            const argsM = row[0][0].title.split(':')[1];
            weekTasks.forEach(item => {
              let taskDate = new Date(item.tip_time);
              let colOffset = differenceInCalendarDays(taskDate, addDays(this.calendarStart, this.activeDateRow * 7));
              let h = item.tip_time.split(' ')[1].split(':')[0];
              let m = item.tip_time.split(' ')[1].split(':')[1];
              if ( h == argsH && m > argsM && colOffset >= 0) {
                console.error(colOffset);
                row[colOffset+1].push(item)
              }
            })
            // console.error([row[0]].concat(this.transform(weekTasks, row[0][0].title)));
            // return [row[0]].concat(this.transform(weekTasks, row[0][0].title))
            return row;
          })
          this.cd.detectChanges();
        });
      }
    })
  }
  // transform(value: any, args?: any): any {
  //   const argsH = args.split(':')[0];
  //   const argsM = args.split(':')[1];
  //   const result = [];
  //   return value.filter(item => {
  //     let taskDate = new Date(item.tip_time);
  //     let colOffset = differenceInCalendarDays(taskDate, addDays(this.calendarStart, this.activeDateRow * 7));
  //     let h = item.tip_time.split(' ')[1].split(':')[0];
  //     let m = item.tip_time.split(' ')[1].split(':')[1];
  //     if ( h == argsH && m > argsM) {
  //       return item
  //     }
  //   });
  // }

  private get calendarStart(): Date {
    return startOfWeek(startOfMonth(this.activeDate), { weekStartsOn: this.dateHelper.getFirstDayOfWeek() });
  }
  private setMulMonthDateMatrix() {
    const curMonth = this.activeDate.getMonth();
    this.monthChangeHandler(curMonth);
    for (let i = 1; i < 5; i++) {
      // this.monthChangeHandler(curMonth + i - 2);
    }
  }
  private setUpDateMatrix(isTop = false): void {
    console.error(this.activeDate);
    const monthStart = startOfMonth(this.activeDate);
    const monthEnd = endOfMonth(this.activeDate);
    const weekDiff =
      differenceInCalendarWeeks(monthEnd, monthStart, { weekStartsOn: this.dateHelper.getFirstDayOfWeek() }) + 1;
    this.maxPoint = weekDiff;
    for (let week = 0; week < weekDiff; week++) {
      const dateMatrix = [];
      const row: DateCellContext[] = [];
      const weekStart = addDays(this.calendarStart, week * 7);
      for (let day = 0; day < 7; day++) {
        const date = addDays(weekStart, day);
        const monthDiff = differenceInCalendarMonths(date, this.activeDate);
        const dateFormat = 'longDate';
        const title = this.dateHelper.format(date, dateFormat);
        const label = this.dateHelper.format(date, this.dateHelper.relyOnDatePipe ? 'dd' : 'DD');
        const rel = monthDiff === 0 ? 'current' : monthDiff < 0 ? 'last' : 'next';
        if(date.getMonth() === this.activeDate.getMonth() && date.getDate() === this.activeDate.getDate()) {
          this.curPoint = week;
          console.log('找到了');
          console.log(this.curPoint);
        }
        row.push({ title, label, rel, value: date });
      }
      dateMatrix.push(row);
      dateMatrix['tasks'] = [];
      for (let i = 0; i < 24; i++) {
        if (i < 10 ) {
          dateMatrix['tasks'].push([[{title: `0${i}:00`}], [], [], [], [], [], [], []]);
        } else {
          dateMatrix['tasks'].push([[{title: `${i}:00`}], [], [], [], [], [], [], []]);
        }
      }
      dateMatrix['panel'] = week;
      this.dateMatrixList.push(dateMatrix);
    }
    // if (isTop) {
    //   this.dateMatrixList.unshift(dateMatrix);
    // } else {
    //   this.dateMatrixList.push(dateMatrix);
    // }
  }
  private calculateActiveDate(): void {
    this.activeDateRow = differenceInCalendarWeeks(this.activeDate, this.calendarStart, {
      weekStartsOn: this.dateHelper.getFirstDayOfWeek()
    });
    this.activeDateCol = differenceInCalendarDays(this.activeDate, addDays(this.calendarStart, this.activeDateRow * 7));
    console.error('高亮计算');
    console.error(this.activeDateRow, this.activeDateCol)
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
    console.log(`计算第${month}的数据`);
    const date = setMonth(this.activeDate, month);
    console.log(date);
    console.log(formatDate(date, 'yyyy-MM-dd', 'zh_CN'));
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

  toggleMode(v) {
    this.nzMode = v;
    this.ngOnInit();
  }
  enterTaskDetailPage(ev, task) {
    ev.stopPropagation();
    if(task.id) {
      this.router.navigate(['/task-detail'], {
        queryParams: task
      })
    }
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
