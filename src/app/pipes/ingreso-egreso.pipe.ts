import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngresoEgreso'
})
export class IngresoEgresoPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {

    let sortFn:(a: IngresoEgreso, b: IngresoEgreso) => number = (a, b) => {
      if (a.type==='ingreso') {
        return 1;
      } else {
        return -1;
      }
    };

    return[...items].sort(sortFn);

  }

}
