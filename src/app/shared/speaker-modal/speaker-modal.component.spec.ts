import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerModalComponent } from './speaker-modal.component';

describe('SpeakerModalComponent', () => {
  let component: SpeakerModalComponent;
  let fixture: ComponentFixture<SpeakerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
