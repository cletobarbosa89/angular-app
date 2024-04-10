import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetingOverviewComponent } from './targeting-overview.component';

describe('TargetingOverviewComponent', () => {
  let component: TargetingOverviewComponent;
  let fixture: ComponentFixture<TargetingOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetingOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
