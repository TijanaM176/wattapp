/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RealizationPredictionAllProsumersComponent } from './realizationPredictionAllProsumers.component';

describe('RealizationPredictionAllProsumersComponent', () => {
  let component: RealizationPredictionAllProsumersComponent;
  let fixture: ComponentFixture<RealizationPredictionAllProsumersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealizationPredictionAllProsumersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealizationPredictionAllProsumersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
