import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupWorkerPageComponent } from './signup-worker-page.component';

describe('SignupWorkerPageComponent', () => {
  let component: SignupWorkerPageComponent;
  let fixture: ComponentFixture<SignupWorkerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupWorkerPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupWorkerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
