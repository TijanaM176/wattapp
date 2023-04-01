import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInfoFormComponent } from './edit-info-form.component';

describe('EditInfoFormComponent', () => {
  let component: EditInfoFormComponent;
  let fixture: ComponentFixture<EditInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInfoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
