import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDistributionUpdatePaymentFeeRateComponent } from './fee-distribution-update-payment-fee-rate.component';

describe('FeeDistributionUpdatePaymentFeeRateComponent', () => {
  let component: FeeDistributionUpdatePaymentFeeRateComponent;
  let fixture: ComponentFixture<FeeDistributionUpdatePaymentFeeRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDistributionUpdatePaymentFeeRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDistributionUpdatePaymentFeeRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
