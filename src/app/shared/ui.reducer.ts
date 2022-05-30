import { createReducer, on } from '@ngrx/store';

import * as actions from './ui.actions';

export interface State {
  isLoading: boolean
};

const initialState: State = {
  isLoading: false
};

export const uiReducer = createReducer(
  initialState,
  on(
    actions.startLoading,
    (state) => ({...state, isLoading: true}),
  ),
  on(
    actions.stopLoading,
    (state) => ({...state, isLoading: false}),
  ),
);
