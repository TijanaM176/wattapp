import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizationChartTableComponent } from './realization-chart-table.component';

describe('RealizationChartTableComponent', () => {
  let component: RealizationChartTableComponent;
  let fixture: ComponentFixture<RealizationChartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealizationChartTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizationChartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
