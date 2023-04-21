import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAllProsumersTableComponent } from './history-all-prosumers-table.component';

describe('HistoryAllProsumersTableComponent', () => {
  let component: HistoryAllProsumersTableComponent;
  let fixture: ComponentFixture<HistoryAllProsumersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryAllProsumersTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryAllProsumersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
