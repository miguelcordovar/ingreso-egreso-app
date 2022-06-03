import { createReducer, on } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

import * as ingresoEgreso from './ingreso-egreso.actions';

export interface State {
     items: IngresoEgreso[] | [],
};

const initialState: State = {
    items: [],
};

export const ingresoEgresoReducer = createReducer(
  initialState,
  on(
    ingresoEgreso.setItems,
    (state, {items}) => ({...state, items: [...items]}),
  ),
  on(
    ingresoEgreso.unsetItems,
    (state) => ({...state, items: []}),
  ),
);
