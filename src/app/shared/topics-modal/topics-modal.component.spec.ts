import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsModalComponent } from './topics-modal.component';

describe('TopicsModalComponent', () => {
  let component: TopicsModalComponent;
  let fixture: ComponentFixture<TopicsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
