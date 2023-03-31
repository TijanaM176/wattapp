import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarOffcanvasComponent } from './navbar-offcanvas.component';

describe('NavbarOffcanvasComponent', () => {
  let component: NavbarOffcanvasComponent;
  let fixture: ComponentFixture<NavbarOffcanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarOffcanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
