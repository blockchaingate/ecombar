/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CompareComponent } from './compare.component';

describe('CompareComponent', () => {
  let component: CompareComponent;
  let fixture: ComponentFixture<CompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
