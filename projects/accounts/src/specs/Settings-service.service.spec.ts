import { TestBed } from '@angular/core/testing';

import { SettingsService } from '@smartstocktz/core-libs';

describe('SsmSettingsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsService = TestBed.get(SettingsService);
    expect(service).toBeTruthy();
  });
});
