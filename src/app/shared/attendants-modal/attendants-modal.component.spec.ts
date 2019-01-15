import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendantsModalComponent } from './attendants-modal.component';

describe('AttendantsModalComponent', () => {
  let component: AttendantsModalComponent;
  let fixture: ComponentFixture<AttendantsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendantsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendantsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
