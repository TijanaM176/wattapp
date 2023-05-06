import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeWorkerPasswordComponent } from './change-worker-password.component';

describe('ChangeWorkerPasswordComponent', () => {
  let component: ChangeWorkerPasswordComponent;
  let fixture: ComponentFixture<ChangeWorkerPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeWorkerPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeWorkerPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
