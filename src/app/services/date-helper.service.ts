import {Inject, Injectable, InjectionToken, Injector, Optional} from '@angular/core';
import * as fnsParse from 'date-fns/parse';
import * as fnsGetISOWeek from 'date-fns/get_iso_week';
import * as fnsFormat from 'date-fns/format';
import {formatDate} from "@angular/common";
export interface NzDateConfig {
    /** Customize the first day of a week */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}
export const NZ_DATE_CONFIG_DEFAULT: NzDateConfig = {
    firstDayOfWeek: undefined
};
export const NZ_DATE_CONFIG = new InjectionToken<NzDateConfig>('date-config');
export function mergeDateConfig(config: NzDateConfig): NzDateConfig {
    return { ...NZ_DATE_CONFIG_DEFAULT, ...config };
}
export function DATE_HELPER_SERVICE_FACTORY(injector: Injector, config: NzDateConfig): DateHelperService {
    return new DateHelperByDatePipe(config);
}

@Injectable({
    providedIn: 'root',
    useFactory: DATE_HELPER_SERVICE_FACTORY,
    deps: [Injector, [new Optional(), NZ_DATE_CONFIG]]
})
export class DateHelperService {

    relyOnDatePipe: boolean = this instanceof DateHelperByDatePipe; // Indicate whether this service is rely on DatePipe

    constructor(@Optional() @Inject(NZ_DATE_CONFIG) protected config: NzDateConfig) {
        this.config = mergeDateConfig(this.config);
    }

    getISOWeek(date: Date): number {
        return fnsGetISOWeek(date);
    }

    // TODO: Use date-fns's "weekStartsOn" to support different locale when "config.firstDayOfWeek" is null
    // when v2.0 is ready: https://github.com/date-fns/date-fns/blob/v2.0.0-alpha.27/src/locale/en-US/index.js#L23
    getFirstDayOfWeek(): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
        return this.config.firstDayOfWeek == null ? 1 : this.config.firstDayOfWeek;
    }

    /**
     * Format a date
     * @see https://date-fns.org/docs/format#description
     * @param date Date
     * @param formatStr format string
     */
    format(date: Date, formatStr: string): string {
        return fnsFormat(date, formatStr, { locale: 'zh-CN' });
    }

    parseDate(text: string): Date | undefined {
        if (!text) {
            return;
        }
        return fnsParse(text);
    }

    parseTime(text: string): Date | undefined {
        if (!text) {
            return;
        }
        return fnsParse(`1970-01-01 ${text}`);
    }
}

export class DateHelperByDateFns extends DateHelperService {
    getISOWeek(date: Date): number {
        return fnsGetISOWeek(date);
    }

    // TODO: Use date-fns's "weekStartsOn" to support different locale when "config.firstDayOfWeek" is null
    // when v2.0 is ready: https://github.com/date-fns/date-fns/blob/v2.0.0-alpha.27/src/locale/en-US/index.js#L23
    getFirstDayOfWeek(): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
        return this.config.firstDayOfWeek == null ? 1 : this.config.firstDayOfWeek;
    }

    /**
     * Format a date
     * @see https://date-fns.org/docs/format#description
     * @param date Date
     * @param formatStr format string
     */
    format(date: Date, formatStr: string): string {
        return fnsFormat(date, formatStr, { locale: 'zh-CN' });
    }
}

export class DateHelperByDatePipe extends DateHelperService {
    constructor(@Optional() @Inject(NZ_DATE_CONFIG) config: NzDateConfig) {
        super(config);
    }

    getISOWeek(date: Date): number {
        return +this.format(date, 'w');
    }

    getFirstDayOfWeek(): WeekDayIndex {
        if (this.config.firstDayOfWeek === undefined) {
            const locale = 'zh_CN';
            return locale && ['zh_CN'].indexOf(locale.toLowerCase()) > -1 ? 1 : 0;
        }
        return this.config.firstDayOfWeek;
    }

    format(date: Date, formatStr: string): string {
        return date ? formatDate(date, formatStr, 'zh_CN')! : '';
    }

    /**
     * Compatible translate the moment-like format pattern to angular's pattern
     * Why? For now, we need to support the existing language formats in AntD, and AntD uses the default temporal syntax.
     *
     * TODO: compare and complete all format patterns
     * Each format docs as below:
     * @link https://momentjs.com/docs/#/displaying/format/
     * @link https://angular.io/api/common/DatePipe#description
     * @param format input format pattern
     */
    transCompatFormat(format: string): string {
        return (
            format &&
            format
                .replace(/Y/g, 'y') // only support y, yy, yyy, yyyy
                .replace(/D/g, 'd')
        ); // d, dd represent of D, DD for momentjs, others are not support
    }
}
export type WeekDayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;