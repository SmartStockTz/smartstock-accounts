import { TestBed } from '@angular/core/testing';

import { ShopService } from '../services/shop.service';

describe('ShopDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopService = TestBed.get(ShopService);
    expect(service).toBeTruthy();
  });
});
