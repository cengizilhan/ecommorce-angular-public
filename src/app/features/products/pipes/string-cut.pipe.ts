import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringCut',
  standalone: true,
})
export class StringCutPipe implements PipeTransform {
  transform(value: string, ...args: any[]): unknown {
    if (!value) return '';
    if (args.length < 1) return value;

    const numberOfChart: number = args[0];
    if (value && value.length > numberOfChart)
      return value.substring(0, numberOfChart) + '...';
    else return value;
  }
}
