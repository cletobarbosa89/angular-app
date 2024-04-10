import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeOverview2Component } from './creative-overview-2.component';

describe('CreativeOverview2Component', () => {
  let component: CreativeOverview2Component;
  let fixture: ComponentFixture<CreativeOverview2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreativeOverview2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeOverview2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
