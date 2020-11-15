import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { AuthenticatedUserGuard } from '../guards/authenticated-user.guard';

describe('AuthenticatedUserGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticatedUserGuard]
    });
  });

  it('should ...', inject([AuthenticatedUserGuard], (guard: AuthenticatedUserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
