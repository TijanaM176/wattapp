import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionLimitComponent } from './consumption-limit.component';

describe('ConsumptionLimitComponent', () => {
  let component: ConsumptionLimitComponent;
  let fixture: ComponentFixture<ConsumptionLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumptionLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumptionLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
