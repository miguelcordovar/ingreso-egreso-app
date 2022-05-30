import { createReducer, on } from '@ngrx/store';
import { User } from '../models/user.model';
import * as auth from './auth.actions';

export interface State {
     user: User | null,
};

const initialState: State = {
    user: null,
};

export const authReducer = createReducer(
  initialState,
  on(
    auth.setUser,
    (state, {user}) => ({...state, user: {...user}}),
  ),
  on(
    auth.unsetUser,
    (state) => ({...state, user: null}),
  ),
);
