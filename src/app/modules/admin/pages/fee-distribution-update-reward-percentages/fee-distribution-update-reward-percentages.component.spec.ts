import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDistributionUpdateRewardPercentagesComponent } from './fee-distribution-update-reward-percentages.component';

describe('FeeDistributionUpdateRewardPercentagesComponent', () => {
  let component: FeeDistributionUpdateRewardPercentagesComponent;
  let fixture: ComponentFixture<FeeDistributionUpdateRewardPercentagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDistributionUpdateRewardPercentagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDistributionUpdateRewardPercentagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
