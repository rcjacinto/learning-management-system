import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatedPage } from './evaluated.page';

describe('EvaluatedPage', () => {
  let component: EvaluatedPage;
  let fixture: ComponentFixture<EvaluatedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluatedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluatedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
