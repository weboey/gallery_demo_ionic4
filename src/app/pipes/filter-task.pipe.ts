import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTask'
})
export class FilterTaskPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const argsH = args.split(':')[0];
    const argsM = args.split(':')[1];
    return value.filter(item => {
      let h = item.tip_time.split(' ')[1].split(':')[0];
      let m = item.tip_time.split(' ')[1].split(':')[1];
      if ( h == argsH && m > argsM) {
        return item
      }
    });
  }
}
