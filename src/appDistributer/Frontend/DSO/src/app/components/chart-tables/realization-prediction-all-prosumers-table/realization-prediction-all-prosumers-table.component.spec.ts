import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizationPredictionAllProsumersTableComponent } from './realization-prediction-all-prosumers-table.component';

describe('RealizationPredictionAllProsumersTableComponent', () => {
  let component: RealizationPredictionAllProsumersTableComponent;
  let fixture: ComponentFixture<RealizationPredictionAllProsumersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealizationPredictionAllProsumersTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizationPredictionAllProsumersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
