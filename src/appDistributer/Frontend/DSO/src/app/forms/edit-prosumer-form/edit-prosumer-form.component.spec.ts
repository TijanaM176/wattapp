import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProsumerFormComponent } from './edit-prosumer-form.component';

describe('EditProsumerFormComponent', () => {
  let component: EditProsumerFormComponent;
  let fixture: ComponentFixture<EditProsumerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProsumerFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProsumerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
