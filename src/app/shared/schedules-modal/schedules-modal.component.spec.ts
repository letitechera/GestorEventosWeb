import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesModalComponent } from './schedules-modal.component';

describe('SchedulesModalComponent', () => {
  let component: SchedulesModalComponent;
  let fixture: ComponentFixture<SchedulesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
