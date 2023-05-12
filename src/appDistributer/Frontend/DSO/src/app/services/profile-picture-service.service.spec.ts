import { TestBed } from '@angular/core/testing';

import { ProfilePictureServiceService } from './profile-picture-service.service';

describe('ProfilePictureServiceService', () => {
  let service: ProfilePictureServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilePictureServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
