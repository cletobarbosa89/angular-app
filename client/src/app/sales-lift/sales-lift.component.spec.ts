import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesLiftComponent } from './sales-lift.component';

describe('SalesLiftComponent', () => {
  let component: SalesLiftComponent;
  let fixture: ComponentFixture<SalesLiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesLiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesLiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
