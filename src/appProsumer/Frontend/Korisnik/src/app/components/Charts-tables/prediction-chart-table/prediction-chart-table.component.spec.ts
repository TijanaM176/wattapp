import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionChartTableComponent } from './prediction-chart-table.component';

describe('PredictionChartTableComponent', () => {
  let component: PredictionChartTableComponent;
  let fixture: ComponentFixture<PredictionChartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictionChartTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictionChartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
