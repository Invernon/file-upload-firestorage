import { TestBed } from '@angular/core/testing';

import { FileUploadFirestorageService } from './file-upload-firestorage.service';

describe('FileUploadFirestorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileUploadFirestorageService = TestBed.get(FileUploadFirestorageService);
    expect(service).toBeTruthy();
  });
});
