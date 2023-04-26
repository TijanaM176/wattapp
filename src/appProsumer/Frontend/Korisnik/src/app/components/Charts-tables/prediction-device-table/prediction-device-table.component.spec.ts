import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionDeviceTableComponent } from './prediction-device-table.component';

describe('PredictionDeviceTableComponent', () => {
  let component: PredictionDeviceTableComponent;
  let fixture: ComponentFixture<PredictionDeviceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictionDeviceTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictionDeviceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
