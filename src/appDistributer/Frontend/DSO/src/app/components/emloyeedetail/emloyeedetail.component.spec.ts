import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmloyeedetailComponent } from './emloyeedetail.component';

describe('EmloyeedetailComponent', () => {
  let component: EmloyeedetailComponent;
  let fixture: ComponentFixture<EmloyeedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmloyeedetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmloyeedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
