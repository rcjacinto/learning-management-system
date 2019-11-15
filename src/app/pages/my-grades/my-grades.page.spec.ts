import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGradesPage } from './my-grades.page';

describe('MyGradesPage', () => {
  let component: MyGradesPage;
  let fixture: ComponentFixture<MyGradesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGradesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGradesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
