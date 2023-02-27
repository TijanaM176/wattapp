import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowWorkersComponent } from './show-workers.component';

describe('ShowWorkersComponent', () => {
  let component: ShowWorkersComponent;
  let fixture: ComponentFixture<ShowWorkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowWorkersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowWorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
