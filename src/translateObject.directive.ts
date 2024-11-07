import {AsyncDirective, directive} from 'lit/async-directive.js';
import {TranslateService, TranslationsObject} from './translate.service';
import {noChange} from "lit";

class TranslateObjectDirective extends AsyncDirective {
    protected translationsObject;
    protected doEvaluate = false;

    constructor(props) {
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