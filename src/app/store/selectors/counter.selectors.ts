import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCounter from '../reducers/counter.reducer';

export const selectCounterState = createFeatureSelector<fromCounter.ICounterState>(
  fromCounter.counterFeatureKey
);

export const selectCurrentCount = createSelector(selectCounterState, state => state.count);
