import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChooseShopPage } from '../pages/choose-shop.page';

describe('ChooseShopComponent', () => {
  let component: ChooseShopPage;
  let fixture: ComponentFixture<ChooseShopPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseShopPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
