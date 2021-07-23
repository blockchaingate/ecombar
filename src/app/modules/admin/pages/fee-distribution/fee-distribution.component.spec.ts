import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDistributionComponent } from './fee-distribution.component';

describe('FeeDistributionComponent', () => {
  let component: FeeDistributionComponent;
  let fixture: ComponentFixture<FeeDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDistributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
