import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateShopDialogComponent } from '../components/create-shop-dialog.component';

describe('CreateShopComponent', () => {
  let component: CreateShopDialogComponent;
  let fixture: ComponentFixture<CreateShopDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShopDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShopDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
