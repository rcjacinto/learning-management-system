import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeExamsPage } from './take-exams.page';

describe('TakeExamsPage', () => {
  let component: TakeExamsPage;
  let fixture: ComponentFixture<TakeExamsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeExamsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeExamsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
