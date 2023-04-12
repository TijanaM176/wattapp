import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesStatusComponent } from './devices-status.component';

describe('DevicesStatusComponent', () => {
  let component: DevicesStatusComponent;
  let fixture: ComponentFixture<DevicesStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicesStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevicesStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
