import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizationChartProductionComponent } from './realization-chart-production.component';

describe('RealizationChartProductionComponent', () => {
  let component: RealizationChartProductionComponent;
  let fixture: ComponentFixture<RealizationChartProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealizationChartProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizationChartProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
