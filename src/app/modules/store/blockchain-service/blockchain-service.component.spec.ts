import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchainServiceComponent } from './blockchain-service.component';

describe('BlockchainServiceComponent', () => {
  let component: BlockchainServiceComponent;
  let fixture: ComponentFixture<BlockchainServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockchainServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockchainServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
