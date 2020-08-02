# FileUploadFirestorage

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.3.
This Module will help you to make a file uploader for your Angular project with firebase/firestore.
Now I made a little mix with the library of [ngx-image-cropper](https://www.npmjs.com/package/ngx-image-cropper) to allow edit the images before upload them. 

## Installation
Use the package manager Npm to install this package.

```bash
npm install file-upload-firestorage
```

## Usage
Make sure you have imported into your app.module.ts file.

```typeScript
import { FileUploadFirestorageModule } from 'file-upload-firestorage';    
```

Then, just use it in your html template using the <lib-file-upload-firestorage> tag

```html
<lib-file-upload-firestorage 
    [storagePath] = "'images'"
    (res)="output($event)"
    [maxSize]="2"
    onlyTipe='image'
    [cropper]="false"
    lang='es'
    />
```

By default it will allow the user to upload image or any document files with no size restriction.
I decided to make this as much customizable as I could.

## API
The only required input is the storagePath

### Inputs

| Name          | Type                 | Default | Description                                                                    |
|---------------|----------------------|---------|--------------------------------------------------------------------------------|
| storagePath   | string               |         | This is the firestorage path to save the image                                 |
| maxSize       | number               |         | Define the max size of the file. Write it in Mb. Ex. 2                         |
| onlyType      | string               |         | You can restrict the file type separating them with a coma (,) Ex. image, pdf. |
| cropper       | boolean              | false   | Activate this option if you want enable the cropper tool.                      |
| cropperConfig | cropperConfiguration |         | See the next table with all availables options.                                |
| lang          | string               | en      | Change the language.                                                           |                                                                            |

For the cropperConfiguration object.
We use just some options of the original library of [ngx-image-cropper](https://www.npmjs.com/package/ngx-image-cropper). If you have some troubles with this options check their repository.

| Name                     | Type    | Default    | Description                                                                                 |
|--------------------------|---------|------------|---------------------------------------------------------------------------------------------|
| aspectRatio              | number  | 1/1        | The width / height ratio (e.g. 1/1 is square image , 4/3 ...)                               |
| maintainAspectRatio      | boolean | true       | Keep width and height of cropped image equal according to the aspectRatio                   |
| containWithinAspectRatio | boolean | false      | When set to true, padding will be added around the image to make it fit to the aspect ratio |
| cropperMinHeight         | number  | 0(Disable) |                                                                                             |
| cropperMinWidth          | number  | 0(Disable) |                                                                                             |
| resizeToHeight           | number  | 0(Disable) |                                                                                             |
| resizeToWidth            | number  | 0(Disable) |                                                                                             |
| cropperStaticWidth       | number  | 0(Disable) |                                                                                             |
| cropperStaticWidth       | number  | 0(Disable) |                                                                                             |


### Output(s)

| Name | Type  | Default | Description                                                                  |
|------|-------|---------|------------------------------------------------------------------------------|
| res  | event |         | This will return the locationPath and the thumbnail (Url) from firestorage.  |

You will obtain an object like this: event: { locationPath: string, thumbnail: string };

```html
<lib-file-upload-firestorage storagePath="downloadables" (res)="uploadFileRes($event)"/>
```

## Suggestions
I will try to improve this library to make our lives easier in the future. Any suggestion can be made through my email or as a pull request to the repo.

## Creators
[Jose Invernón](https://joseinvernon.com)
- [Personal GitHub](https://github.com/Invernon) 
- [LinkedIn](https://www.linkedin.com/in/joseinvernon/) 
## License
[MIT](https://choosealicense.com/licenses/mit/)