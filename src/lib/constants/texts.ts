export class DropZoneText {
    title = 'File Drop Zone';
    subtitle = 'Drop your file here';
    action = {
        or: 'or',
        click: 'click here',
        choose: 'to choose a file...',
        rotateLeft: 'Rotate left',
        rotateRight: 'Rotate right',
        flipHorizontal: 'Flip horizontal',
        flipVertical: 'Flip Vertical',
        zoomIn: 'Zoom +',
        zoomOut: 'Zoom -',
        reset: 'Reset image',

    };
    button = {
        pause: 'Pause',
        cancel: 'Cancel',
        resume: 'Resume',
        upload: 'Upload File',
        change: 'Change File'
    };
    errors = {
        type: 'Unsupported file type. ',
        size: 'The file is too heavy. ',
    }

    constructor(lang) {

        switch (lang) {
            case 'es':
                this.title = 'Área de carga';
                this.subtitle = 'Arrastre el archivo aquí',
                    this.action = {
                        or: 'ó',
                        click: 'Haga click aquí',
                        choose: 'para escoger su archivo...',
                        rotateLeft: 'Rotar Izq',
                        rotateRight: 'Rotar Der',
                        flipHorizontal: 'Girar horizontal',
                        flipVertical: 'Girar Vertical',
                        zoomIn: 'Acercar',
                        zoomOut: 'Alejar',
                        reset: 'Resetear',
                    };
                this.button = {
                    pause: 'Pausa',
                    cancel: 'Cancelar',
                    resume: 'Continuar',
                    upload: 'Cargar archivo',
                    change: 'Cambiar archivo'
                };
                this.errors = {
                    type: 'El tipo de archivo no es permitido.',
                    size: 'El archivo es muy grande. ',
                }
                break;
            default:
                break;
        }
    }
}