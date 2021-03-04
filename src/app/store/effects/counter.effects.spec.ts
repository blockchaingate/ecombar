import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CounterEffects } from './counter.effects';

describe('CounterEffects', () => {
  let actions$: Observable<any>;
  let effects: CounterEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CounterEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<CounterEffects>(CounterEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
