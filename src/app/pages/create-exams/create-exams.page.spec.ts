import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExamsPage } from './create-exams.page';

describe('CreateExamsPage', () => {
  let component: CreateExamsPage;
  let fixture: ComponentFixture<CreateExamsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExamsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExamsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
