import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionAllProsumersTableComponent } from './prediction-all-prosumers-table.component';

describe('PredictionAllProsumersTableComponent', () => {
  let component: PredictionAllProsumersTableComponent;
  let fixture: ComponentFixture<PredictionAllProsumersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictionAllProsumersTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictionAllProsumersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
