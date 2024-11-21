import {directive} from 'lit/async-directive.js';
import {TranslationsObject} from './translate.service';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {TranslateObjectDirective} from "./translateObject.directive";

class TranslateObjectUnsafeHTMLDirective extends TranslateObjectDirective {
    render(translationsObject: TranslationsObject, fallbackLanguage?: string) {
        const val = super.render(translationsObject, fallbackLanguage);
        return (typeof val === 'symbol') ?
            val : unsafeHTML(val as string);
    }
}

export {TranslateObjectUnsafeHTMLDirective};

export const translateObjectUnsafeHTML = directive(TranslateObjectUnsafeHTMLDirective);
