import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateAddComponent } from './exchange-rate-add.component';

describe('ExchangeRateAddComponent', () => {
  let component: ExchangeRateAddComponent;
  let fixture: ComponentFixture<ExchangeRateAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeRateAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
