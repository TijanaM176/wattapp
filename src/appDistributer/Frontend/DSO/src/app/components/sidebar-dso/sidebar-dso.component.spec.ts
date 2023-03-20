import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDsoComponent } from './sidebar-dso.component';

describe('SidebarDsoComponent', () => {
  let component: SidebarDsoComponent;
  let fixture: ComponentFixture<SidebarDsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarDsoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarDsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
