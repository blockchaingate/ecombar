import { createReducer, on } from '@ngrx/store';
import * as CounterActions from '../actions/counter.actions';

export const counterFeatureKey = 'counter';

export interface ICounterState {
  count: number;
}

export const initialState: ICounterState = {
  count: 0,
};

export const reducer = createReducer(
  initialState,
  on(CounterActions.add, (state) => ({
    ...state,
    count: state.count + 1,
  })),
  on(CounterActions.subtract, (state) => ({
    ...state,
    count: state.count - 1,
  }))
);
