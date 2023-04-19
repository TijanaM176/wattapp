import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoGaugeComponent } from './user-info-gauge.component';

describe('UserInfoGaugeComponent', () => {
  let component: UserInfoGaugeComponent;
  let fixture: ComponentFixture<UserInfoGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInfoGaugeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInfoGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
