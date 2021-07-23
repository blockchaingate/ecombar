/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Collections2Component } from './collections2.component';

describe('Collections2Component', () => {
  let component: Collections2Component;
  let fixture: ComponentFixture<Collections2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Collections2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Collections2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
