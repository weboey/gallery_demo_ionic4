import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
@Pipe({
  name: 'dateView'
})
export class DateViewPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let dateStr = formatDate(value, 'yyyy-MM-dd', 'zh_CN');
    let month = formatDate(value, 'MM', 'zh_CN');
    return this.monthKeys(month)
  }

  monthKeys(month) {
    switch (month) {
      case '01' : return '一月';
      case '02' : return '二月';
      case '03' : return '三月';
      case '04' : return '四月';
      case '05' : return '五月';
      case '06' : return '六月';
      case '07' : return '七月';
      case '08' : return '八月';
      case '09' : return '九月';
      case '10' : return '十月';
      case '11' : return '十一月';
      case '12' : return '十二月';
    }
  }
}

