import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartProsumersTableComponent } from './pie-chart-prosumers-table.component';

describe('PieChartProsumersTableComponent', () => {
  let component: PieChartProsumersTableComponent;
  let fixture: ComponentFixture<PieChartProsumersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieChartProsumersTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieChartProsumersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
