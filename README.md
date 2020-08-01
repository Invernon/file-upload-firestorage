# FileUploadFirestorage

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.3.
This Module will help you to make a file uploader for your Angular project with firebase/firestore.

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
<lib-file-upload-firestorage />
```

You must define (1) input and output elements to make the module work great.
- (res) - This will give to you the response with the data of the uploaded file.
- storagePath - You have to define the name of the folder where you want to upload your file.

By default it will allow the user to upload image or pdf files with no size restriction

Optional:
- maxSize - If you need to stabish a max file size. 
- onlyType - If you want to avoid some file types. YOU must use , separator or black spaces.

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