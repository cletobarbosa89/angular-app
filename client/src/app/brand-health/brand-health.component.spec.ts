import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandHealthComponent } from './brand-health.component';

describe('BrandHealthComponent', () => {
  let component: BrandHealthComponent;
  let fixture: ComponentFixture<BrandHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandHealthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
