import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mininavbar2Component } from './mininavbar2.component';

describe('Mininavbar2Component', () => {
  let component: Mininavbar2Component;
  let fixture: ComponentFixture<Mininavbar2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mininavbar2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mininavbar2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
