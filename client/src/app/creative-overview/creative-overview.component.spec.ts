import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeOverviewComponent } from './creative-overview.component';

describe('CreativeOverviewComponent', () => {
  let component: CreativeOverviewComponent;
  let fixture: ComponentFixture<CreativeOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreativeOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
