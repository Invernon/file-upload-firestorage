export class DropZoneText {
    title = 'File Drop Zone';
    subtitle = 'Drop your file here';
    action = {
        or: 'or',
        click: 'click here',
        choose: 'to choose a file...'
    };
    button = {
        pause: 'Pause',
        cancel: 'Cancel',
        resume: 'Resume'
    };

    constructor(lang) {

        switch (lang) {
            case 'es':
                this.title = 'Area de carga';
                this.subtitle = 'Arroje su archivo acá',
                    this.action = {
                        or: 'o',
                        click: 'Haga click aquí',
                        choose: 'para escoger su archivo...'
                    };
                this.button = {
                    pause: 'Pausa',
                    cancel: 'Cancelar',
                    resume: 'Continuar'
                };
                break;
            default:
                break;
        }
    }
}