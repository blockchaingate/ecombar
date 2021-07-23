import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDistributionUpdateRewardCoinsComponent } from './fee-distribution-update-reward-coins.component';

describe('FeeDistributionUpdateRewardCoinsComponent', () => {
  let component: FeeDistributionUpdateRewardCoinsComponent;
  let fixture: ComponentFixture<FeeDistributionUpdateRewardCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDistributionUpdateRewardCoinsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDistributionUpdateRewardCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
