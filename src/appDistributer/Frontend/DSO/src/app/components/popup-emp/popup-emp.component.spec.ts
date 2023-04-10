import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEmpComponent } from './popup-emp.component';

describe('PopupEmpComponent', () => {
  let component: PopupEmpComponent;
  let fixture: ComponentFixture<PopupEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
