import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MobilePayDetailsComponent } from '../components/mobile-pay-details.component';

describe('MobilePayDetailsComponent', () => {
  let component: MobilePayDetailsComponent;
  let fixture: ComponentFixture<MobilePayDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilePayDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilePayDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
