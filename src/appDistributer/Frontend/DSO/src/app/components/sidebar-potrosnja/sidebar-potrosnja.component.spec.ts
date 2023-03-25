import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPotrosnjaComponent } from './sidebar-potrosnja.component';

describe('SidebarPotrosnjaComponent', () => {
  let component: SidebarPotrosnjaComponent;
  let fixture: ComponentFixture<SidebarPotrosnjaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarPotrosnjaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarPotrosnjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
