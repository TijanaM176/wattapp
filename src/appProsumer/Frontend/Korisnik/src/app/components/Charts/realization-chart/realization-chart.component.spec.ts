import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizationChartComponent } from './realization-chart.component';

describe('RealizationChartComponent', () => {
  let component: RealizationChartComponent;
  let fixture: ComponentFixture<RealizationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealizationChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
