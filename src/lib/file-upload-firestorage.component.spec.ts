import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadFirestorageComponent } from './file-upload-firestorage.component';

describe('FileUploadFirestorageComponent', () => {
  let component: FileUploadFirestorageComponent;
  let fixture: ComponentFixture<FileUploadFirestorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadFirestorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadFirestorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
