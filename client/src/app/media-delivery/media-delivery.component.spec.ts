import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDeliveryComponent } from './media-delivery.component';

describe('MediaDeliveryComponent', () => {
  let component: MediaDeliveryComponent;
  let fixture: ComponentFixture<MediaDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaDeliveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
