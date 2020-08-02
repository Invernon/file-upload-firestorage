import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { DropZoneText } from './constants/texts';
import { Dimensions, ImageCroppedEvent, ImageTransform, ImageCropperComponent, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'lib-file-upload-firestorage',
  template: `

<div *ngIf="error.type || error.size" class="error" >
  <span *ngIf="error.type"> {{ texts.errors.type }} </span>
  <span *ngIf="error.size"> {{ texts.errors.size }} </span>
</div>

<div class="dropzone-wrapper" id="dropzone-wrapper" >

  <div class="dropzone" dropZone (hovered)="toggleHover($event)" (dropped)="loadTempFile($event)"
      [class.hovering]="isHovering" *ngIf="!tempFile && !imageUrl" >

    <h3> {{ texts.title }} </h3>
    <h6> {{ texts.subtitle }} </h6>

    <div class="file">
      <label class="file-label">
        <input class="file-input" type="file" (change)="loadTempFile($event)">
        <span class="file-cta">
          <span class="file-icon">
            <i class="fa fa-upload"></i>
          </span>
          <span class="file-label">
          {{ texts.action.or }} <strong> {{ texts.action.click }} </strong> {{ texts.action.choose }}
          </span>
        </span>
      </label>
    </div>
  </div>
  
  <div *ngIf="tempFile && !ImageType" style="flex: 1;display: flex;justify-content: center;align-items: center;">
      {{ tempFile.target.files[0].name }}
  </div>

  <div *ngIf="(tempFile && ImageType) || imageUrl" class="preview-image" >
    <image-cropper
        [imageChangedEvent]="tempFile"
        [imageURL]="imageUrl"
        [maintainAspectRatio]="cropperConfig.maintainAspectRatio"
        [aspectRatio]="cropperConfig.aspectRatio"
        [disabled]="!cropper"
        [canvasRotation]="croppedImageConfig.canvasRotation"
        [transform]="croppedImageConfig.transform"
        [alignImage]="'center'"
        [containWithinAspectRatio]="cropperConfig.containWithinAspectRatio"
        [resizeToWidth]="cropperConfig.resizeToWidth"
        [resizeToHeight]="cropperConfig.resizeToHeight"
        [cropperMinWidth]="cropperConfig.cropperMinWidth"
        [cropperMinHeight]="cropperConfig.cropperMinHeight"
        [cropperStaticWidth]="cropperConfig.cropperStaticWidth"
        [cropperStaticHeight]="cropperConfig.cropperStaticHeight"
        format="png"
        [autoCrop]="false"
        (imageCropped)="imageCropped($event)"
        (imageLoaded)="imageLoaded()"
        (cropperReady)="cropperReady($event)"
        (loadImageFailed)="loadImageFailed()"
    ></image-cropper>
  </div>

  <div class="dropzone-button-wrapper" *ngIf="tempFile || imageUrl " >

    <div *ngIf="(ImageType && cropper) || imageUrl" >
      <button type="button" class="loader-button half-button" (click)="rotateLeft()">{{ texts.action.rotateLeft }}</button>
      <button type="button" class="loader-button half-button" (click)="rotateRight()">{{ texts.action.rotateRight }}</button>
      <hr>
      <button type="button" class="loader-button half-button" (click)="flipHorizontal()">{{ texts.action.flipHorizontal }}</button>
      <button type="button" class="loader-button half-button" (click)="flipVertical()"> {{ texts.action.flipVertical }}</button>
      <hr>
      
      <button type="button" class="loader-button half-button" (click)="zoomOut()">{{ texts.action.zoomOut }}</button> 
      <button type="button" class="loader-button half-button" (click)="zoomIn()">{{ texts.action.zoomIn }}</button>
      <hr>
      
      <button type="button" class="loader-button half-button" (click)="resetImage()">{{ texts.action.reset }}</button>
      <hr>
    </div>

    <button type="button" class="loader-button button--success"  (click)="startUpload()" > {{ texts.button.upload }} </button>
    <button type="button" class="loader-button button--warning"  (click)="changeImage()" > {{ texts.button.change }} </button>
    
    <div>

    <div *ngIf="(percentage | async) as pct">
      <progress class="progress is-info" [value]="pct || 0" max="100">
      </progress>
      {{ pct | number }}%
    </div>
    
    <div *ngIf="(snapshot | async) as snap">
      {{ snap.bytesTransferred | fileSize }} of {{ snap.totalBytes | fileSize }}
      <button type="button" (click)="task.pause()" class="button is-warning" [disabled]="!isActive(snap)">{{ texts.button.pause }}</button>
      <button type="button" (click)="task.cancel()" class="button is-danger" [disabled]="!isActive(snap)">{{ texts.button.cancel }}</button>
      <button type="button" (click)="task.resume()" class="button is-info" [disabled]="!(snap?.state === 'paused')">{{ texts.button.resume }}</button>
    </div>
    
    </div>
  </div>

</div>


  `,
  styles: [`

    *{
      font-family: 'sans-serif';
    }

    button:focus{
      outline:none;
    }

    image-cropper {
      height: 50vh;
      min-height: 200px;
    }

    .dropzone-wrapper{
      display:flex;
      flex-wrap: wrap;

    }

    .preview-image{
      flex: 1 0;
      height: 100%;
      min-height: 100px;
      padding: .5rem;
    }

    .dropzone-button-wrapper{
      flex: .2 0 100px;
      box-sizing: border-box;
      padding: .5rem 1rem;
      box-shadow: inset 2px 0px 0px #80808047;
    }

    .dropzone {
      flex: 1;
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
      font-family: 'sans-serif';
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

    .loader-button{
      width: 100%;
      padding: 0.5rem 0.4rem;
      margin-bottom: 8px;
      border: none;
      font-size: 12px;
      font-family: sans-serif;
      border-radius: .5rem;
      cursor: pointer;
      transition: .3s;
    }

    .half-button{
        width: 49%;
    }

    .half-button + .half-button{
      margin-left: 2%;
    }

    .loader-button:hover{
      filter: brightness(0.8);
    }

    .loader-button.button--success{
      background: #4145c7;
      color: #ffffff;
    }
    
    .loader-button.button--warning{
      background: #ea7826;
      color: #ffffff;
    }

    .error{
      font-family: 'sans-serif';
      color: #d63600;
      font-weight: bold;
      letter-spacing: -1px;
    }

    @media (max-width: 767px){
      .dropzone-button-wrapper{
        flex: 1 0 100%;
        box-shadow: none;
      }
    }
    
    .dropzone-wrapper.responsive .dropzone-button-wrapper{
        flex: 1 0 100%;
        box-shadow: none;
      }
  `]
})
export class FileUploadFirestorageComponent implements OnInit {

  @ViewChild( ImageCropperComponent ) imageCropper: ImageCropperComponent;
  @Output() res = new EventEmitter();
  @Input() lang: 'es' | 'en' = 'en';
  @Input() storagePath: string;
  @Input() maxSize: number;
  @Input() imageUrl: string;
  @Input() onlyType: string; // Separated by comas It can be images ( for all kind of image type, images/* ) , pdf
  @Input() cropper: boolean = false;
  @Input() cropperConfig: {
    aspectRatio: number;
    maintainAspectRatio: boolean;
    containWithinAspectRatio: boolean;
    cropperMinHeight: number;
    cropperMinWidth: number;
    resizeToWidth: number;
    resizeToHeight: number;
    cropperStaticWidth: number;
    cropperStaticHeight: number;
  } = {
      aspectRatio: 1 / 1,
      maintainAspectRatio: true,
      containWithinAspectRatio: false,
      cropperMinHeight: 0,
      cropperMinWidth: 0,
      resizeToWidth: 0,
      resizeToHeight: 0,
      cropperStaticWidth: 0,
      cropperStaticHeight: 0,
    };

  // Labels
  texts: any;
  tempFile: any;

  error = {
    type: false,
    size: false
  }

  // Cropped
  croppedImage: any = '';
  croppedImageConfig: {
    rotation: number;
    canvasRotation: number;
    showCropper: boolean;
    scale: number;
    transform: ImageTransform
  } = {
    rotation: 0,
    canvasRotation: 0,
    showCropper: false,
      scale: 1,
      transform: {},
    };


  // Main task
  task: AngularFireUploadTask;

  // Progress Monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;

  // Download Url
  downloadURL: Promise<any>;

  // State for dropzone CSS toggling
  isHovering: boolean;
  ImageType: boolean;

  constructor(private storage: AngularFireStorage) { }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  loadTempFile(event: any) {
    this.error.type = false;
    this.error.size = false;
    this.ImageType = true;
    const file = event.target ? event.target.files.item(0) : event.item(0);

    // Client-side validation example
    if (this.onlyType) {
      let allow = false;
      allow = this.onlyType.split(',').some(type => file.type.includes(type.trim()));

      if (!allow) {
        this.error.type = true;
        console.error('unsupported file type: ', file.type);
        return;
      }
    }

    if (this.maxSize && (file.size / 100000) >= this.maxSize) {
      this.error.size = true;
      console.error('unsupported size file. Its too heavy ', file.size);
      return;
    }

    if (!this.error.type && !this.error.size) {
      if ( event.target ){
        this.tempFile = event;
      } else {
        let aux = {
          target: {
            files: []
          }
        }
        aux.target.files.push(file);
        this.tempFile = aux;
      }

      if( file.type.includes('image') ) {
        this.imageLoaded();
      } else {
        this.ImageType = false;
      }
    }
  }

  changeImage() {
    this.tempFile = null;
  }

  // startUpload(event: FileList) {
  startUpload(event?: FileList) {
    let file: any;

    if( !this.cropper && this.tempFile ){
      file = this.tempFile.target ? this.tempFile.target.files.item(0) : this.tempFile;
    } else {
      file = base64ToFile(this.imageCropper.crop().base64);
    }

    // The File object

    // The storage path
    const path = `${this.storagePath}/${new Date().getTime()}_${ this.tempFile ? this.tempFile.target.files[0].name : '_web' }`;

    // Totally optional metadata

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
    this.texts = new DropZoneText(this.lang);
    if( document.getElementById('dropzone-wrapper').clientWidth < 767 ){
      document.getElementById('dropzone-wrapper').classList.add('responsive');
    } 
  }

  // CropImageFunctions 
  rotateLeft() {
    this.croppedImageConfig.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.croppedImageConfig.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.croppedImageConfig.transform.flipH;
    const flippedV = this.croppedImageConfig.transform.flipV;
    this.croppedImageConfig.transform = {
      ...this.croppedImageConfig.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

  flipHorizontal() {
    this.croppedImageConfig.transform = {
      ...this.croppedImageConfig.transform,
      flipH: !this.croppedImageConfig.transform.flipH
    };
  }

  flipVertical() {
    this.croppedImageConfig.transform = {
      ...this.croppedImageConfig.transform,
      flipV: !this.croppedImageConfig.transform.flipV
    };
  }

  resetImage() {
    this.croppedImageConfig.scale = 1;
    this.croppedImageConfig.transform = {};
    this.croppedImageConfig.rotation = 0;
    this.croppedImageConfig.canvasRotation = 0;
  }

  zoomOut() {
    this.croppedImageConfig.scale -= .1;
    this.croppedImageConfig.transform = {
      ...this.croppedImageConfig.transform,
      scale: this.croppedImageConfig.scale
    };
  }

  zoomIn() {
    this.croppedImageConfig.scale += .1;
    this.croppedImageConfig.transform = {
      ...this.croppedImageConfig.transform,
      scale: this.croppedImageConfig.scale
    };
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
  }

  imageLoaded() {
    // console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    // console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

}
