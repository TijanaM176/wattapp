import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksDetailsFormComponent } from './books-details-form.component';

describe('BooksDetailsFormComponent', () => {
  let component: BooksDetailsFormComponent;
  let fixture: ComponentFixture<BooksDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BooksDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
