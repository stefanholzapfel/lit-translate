import {directive} from 'lit/async-directive.js';
import {Interpolations} from './translate.service.js';
import {TranslateDirective} from './translate.directive.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

class TranslateUnsafeHTMLDirective extends TranslateDirective {
    render(identifier: string, interpolations?: Interpolations) {
        const val = super.render(identifier, interpolations);
        return (typeof val === 'string') ?
            unsafeHTML(val) : val;
    }
}

export {TranslateUnsafeHTMLDirective};

export const translateUnsafeHTML = directive(TranslateUnsafeHTMLDirective);
