import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { DropZoneText } from './constants/texts';

@Component({
  selector: 'lib-file-upload-firestorage',
  template: `
  <div class="dropzone" dropZone (hovered)="toggleHover($event)" (dropped)="startUpload($event)"
  [class.hovering]="isHovering">



  <h3> {{ texts.title }} </h3>
  <h6> {{ texts.subtitle }} </h6>

  <div class="file">
    <label class="file-label">
      <input class="file-input" type="file" (change)="startUpload($event.target.files)">
      <span class="file-cta">
        <span class="file-icon">
          <i class="fa fa-upload"></i>
        </span>
        <span class="file-label">
        {{ texts.action.or }} <strong>{{ texts.action.click }}</strong>{{ texts.action.choose }}…
        </span>
      </span>
    </label>
  </div>
</div>

<div *ngIf="(percentage | async) as pct">

  <progress class="progress is-info" [value]="pct || 0" max="100">
  </progress>

  {{ pct | number }}%

</div>

<div *ngIf="(snapshot | async) as snap">
  {{ snap.bytesTransferred | fileSize }} of {{ snap.totalBytes | fileSize }}

  <button (click)="task.pause()" class="button is-warning" [disabled]="!isActive(snap)">{{ texts.button.pause }}</button>
  <button (click)="task.cancel()" class="button is-danger" [disabled]="!isActive(snap)">{{ texts.button.cancel }}</button>
  <button (click)="task.resume()" class="button is-info" [disabled]="!(snap?.state === 'paused')">{{ texts.button.resume }}</button>

</div>
  `,
  styles: [`
    .dropzone {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 100%;
      min-height: 100px;
      border: 2px dashed #f16624;
      border-radius: 5px;
      background: white;
      margin: 0;
      cursor:pointer;
      padding: .5rem;
    }

    .dropzone:hover {
      border: 2px solid #f16624;
      color: #dadada !important;
    }

    .dropzone .file input.file-input{
        width: 0;
    }

    progress::-webkit-progress-value {
        transition: width 0.1s ease;
    }
  `]
})
export class FileUploadFirestorageComponent implements OnInit {

  @Output() res = new EventEmitter();
  @Input() lang: 'es' | 'en' = 'en';
  @Input() storagePath: string;
  @Input() maxSize: number;
  @Input() onlyType: string; // Separated by comas

  // Labels
  texts: any;

  // Main task
  task: AngularFireUploadTask;

  // Progress Monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;

  // Download Url
  downloadURL: Promise<any>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  constructor(private storage: AngularFireStorage) { }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    // The File object
    const file = event.item(0);

    // Client-side validation example
    if (this.onlyType) {
      if (!(this.onlyType.includes(file.type.split('/')[0]))) {
        console.error('unsupported file type: ', file.type.split('/')[0]);
        return;
      }
    }

    if (this.maxSize) {
      if (file.size >= this.maxSize) {
        console.error('unsupported size file. Its too heavy ', file.size);
        return;
      }
    }

    if ( !this.onlyType && (file.type.split('/')[0] !== 'image' && file.type.split('/')[0] !== 'pdf')) {
      console.error('unsupported file type: ', file.type.split('/')[0]);
      return;
    }



    // The storage path
    const path = `${this.storagePath}/${new Date().getTime()}_${file.name}`;

    // // Totally optional metadata
    // const customMetadata = { app: 'Murbinas Painting Uploader' };

    // The main task
    this.task = this.storage.upload(path, file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();

    // The file's download URL
    this.task.then(d => {
      d.ref.getDownloadURL().then(url => {
        this.snapshot = null;
        this.percentage = null;
        this.res.emit({ thumbnail: url, locationPath: d.ref.fullPath.split('/').pop() });
      });
    });
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }


  ngOnInit() {
    this.texts = new DropZoneText( this.lang );
  }

}
