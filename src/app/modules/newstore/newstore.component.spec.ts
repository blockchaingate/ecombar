import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewstoreComponent } from './newstore.component';

describe('NewstoreComponent', () => {
  let component: NewstoreComponent;
  let fixture: ComponentFixture<NewstoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewstoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
