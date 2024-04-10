import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusteredChartComponent } from './clustered-chart.component';

describe('ClusteredChartComponent', () => {
  let component: ClusteredChartComponent;
  let fixture: ComponentFixture<ClusteredChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClusteredChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusteredChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
