import {EventEmitter, Output} from "@angular/core";
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

export abstract class CalendarBase {
    activeDate: Date = new Date();
    constructor() {console.log('base ---------22----');}
    @Output() readonly nzSelectChange: EventEmitter<Date> = new EventEmitter();
    @Output() readonly nzValueChange: EventEmitter<Date> = new EventEmitter();
    onDateSelect(date: Date): void {
        console.log(date);
        this.updateDate(date);
        this.nzSelectChange.emit(date);
    }
    public calculateActiveDate(): void {}
    public setUpDateMatrix(): void {}
    public calculateCurrentDate(): void {}
    public calculateActiveMonth(): void {}
    public calculateCurrentMonth(): void {}
    public onChangeFn(): void {}

    public updateDate(date: Date, touched: boolean = true): void {
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
            this.calculateCurrentMonth();
        }

        if (touched) {
            this.nzValueChange.emit(date);
        }
    }
}