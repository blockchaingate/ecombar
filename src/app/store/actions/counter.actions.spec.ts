import * as fromCounter from './counter.actions';

describe('loadCounters', () => {
  it('should return an action', () => {
    expect(fromCounter.loadCounters().type).toBe('[Counter] Load Counters');
  });
});
