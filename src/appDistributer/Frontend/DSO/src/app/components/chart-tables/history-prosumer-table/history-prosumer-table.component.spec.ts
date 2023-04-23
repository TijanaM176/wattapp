import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryProsumerTableComponent } from './history-prosumer-table.component';

describe('HistoryProsumerTableComponent', () => {
  let component: HistoryProsumerTableComponent;
  let fixture: ComponentFixture<HistoryProsumerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryProsumerTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryProsumerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
