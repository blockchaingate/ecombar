import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { LocalStorageEffects } from 'ngrx-localstorage-store';
import { counterFeatureKey, ICounterState } from '../reducers/counter.reducer';
import { selectCounterState } from '../selectors/counter.selectors';

@Injectable()
export class CounterEffects {
  saveToLocalStorage$ = this.localStorageEffects.saveForFeature(
    this.actions$,
    counterFeatureKey,
    selectCounterState
  );

  constructor(
    private actions$: Actions,
    private localStorageEffects: LocalStorageEffects<ICounterState>
  ) {}
}
