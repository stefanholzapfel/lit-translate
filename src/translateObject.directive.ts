import {AsyncDirective, directive} from 'lit/async-directive.js';
import {TranslateService, TranslationsObject} from './translate.service.js';
import {noChange} from "lit";
import {PartInfo} from 'lit/directive.js';

class TranslateObjectDirective extends AsyncDirective {
    protected translationsObject!: TranslationsObject;
    protected fallbackLanguage?: string;
    protected doEvaluate = false;

    constructor(props: PartInfo) {
        super(props);
        TranslateService.connectDirective(this);
    }

    render(translationsObject: TranslationsObject, fallbackLanguage?: string) {
        if (this.translationsObject !== translationsObject || this.doEvaluate) {
            this.doEvaluate = false;
            return TranslateService.translateFromObject(translationsObject, fallbackLanguage);
        }
        return noChange;
    }

    disconnected() {
        TranslateService.disconnectDirective(this);
    }

    reconnected() {
        TranslateService.connectDirective(this);
    }

    public evaluate(): void {
        this.doEvaluate = true;
        this.setValue(this.render(this.translationsObject));
    }
}

export {TranslateObjectDirective};

export const translateObject = directive(TranslateObjectDirective);