import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsumerinfoComponent } from './prosumerinfo.component';

describe('ProsumerinfoComponent', () => {
  let component: ProsumerinfoComponent;
  let fixture: ComponentFixture<ProsumerinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProsumerinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProsumerinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
