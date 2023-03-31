import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarResponsiveComponent } from './sidebar-responsive.component';

describe('SidebarResponsiveComponent', () => {
  let component: SidebarResponsiveComponent;
  let fixture: ComponentFixture<SidebarResponsiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarResponsiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarResponsiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
