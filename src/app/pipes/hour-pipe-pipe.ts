import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourPipe',
})
export class HourPipePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (!value) return '';
    return value + ':00';
  }
}
