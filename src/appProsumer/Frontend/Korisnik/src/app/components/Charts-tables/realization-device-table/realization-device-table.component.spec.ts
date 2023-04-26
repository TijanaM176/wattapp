import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizationDeviceTableComponent } from './realization-device-table.component';

describe('RealizationDeviceTableComponent', () => {
  let component: RealizationDeviceTableComponent;
  let fixture: ComponentFixture<RealizationDeviceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealizationDeviceTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizationDeviceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
