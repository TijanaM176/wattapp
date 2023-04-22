import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionProsumerTableComponent } from './prediction-prosumer-table.component';

describe('PredictionProsumerTableComponent', () => {
  let component: PredictionProsumerTableComponent;
  let fixture: ComponentFixture<PredictionProsumerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictionProsumerTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictionProsumerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
