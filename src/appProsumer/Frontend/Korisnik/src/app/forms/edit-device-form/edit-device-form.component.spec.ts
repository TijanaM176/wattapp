import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeviceFormComponent } from './edit-device-form.component';

describe('EditDeviceFormComponent', () => {
  let component: EditDeviceFormComponent;
  let fixture: ComponentFixture<EditDeviceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDeviceFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeviceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
