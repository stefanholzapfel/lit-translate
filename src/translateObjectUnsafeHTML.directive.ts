import {directive} from 'lit/async-directive.js';
import {TranslationsObject} from './translate.service.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {TranslateObjectDirective} from "./translateObject.directive.js";

class TranslateObjectUnsafeHTMLDirective extends TranslateObjectDirective {
    render(translationsObject: TranslationsObject, fallbackLanguage?: string) {
        const val = super.render(translationsObject, fallbackLanguage);
        return (typeof val === 'string') ?
            unsafeHTML(val) : val;
    }
}

export {TranslateObjectUnsafeHTMLDirective};

export const translateObjectUnsafeHTML = directive(TranslateObjectUnsafeHTMLDirective);
