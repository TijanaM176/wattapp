/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Top5ProducersComponent } from './top5Producers.component';

describe('Top5ProducersComponent', () => {
  let component: Top5ProducersComponent;
  let fixture: ComponentFixture<Top5ProducersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Top5ProducersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Top5ProducersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
