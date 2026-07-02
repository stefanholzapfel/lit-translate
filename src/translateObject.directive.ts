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
        if (this.translationsObjectChanged(translationsObject) || this.fallbackLanguage !== fallbackLanguage || this.doEvaluate) {
            this.doEvaluate = false;
            // Store a shallow snapshot (not the reference) so a later in-place mutation
            // of the same object is still detected by translationsObjectChanged().
            this.translationsObject = { ...translationsObject };
            this.fallbackLanguage = fallbackLanguage;
            return TranslateService.translateFromObject(translationsObject, fallbackLanguage);
        }
        return noChange;
    }

    protected translationsObjectChanged(translationsObject: TranslationsObject): boolean {
        if (!this.translationsObject) {
            return true;
        }
        const k1 = Object.keys(translationsObject);
        const k2 = Object.keys(this.translationsObject);
        if (k1.length !== k2.length) {
            return true;
        }
        for (const key of k1) {
            if (translationsObject[key] !== this.translationsObject[key]) {
                return true;
            }
        }
        return false;
    }

    disconnected() {
        TranslateService.disconnectDirective(this);
    }

    reconnected() {
        TranslateService.connectDirective(this);
    }

    public evaluate(): void {
        this.doEvaluate = true;
        this.setValue(this.render(this.translationsObject, this.fallbackLanguage));
    }
}

export {TranslateObjectDirective};

export const translateObject = directive(TranslateObjectDirective);