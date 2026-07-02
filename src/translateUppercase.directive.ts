import {directive} from 'lit/async-directive.js';
import {Interpolations} from './translate.service.js';
import {TranslateDirective} from './translate.directive.js';

class TranslateUppercaseDirective extends TranslateDirective {
    render(identifier: string, interpolations?: Interpolations) {
        const val = super.render(identifier, interpolations);
        return (typeof val === 'string') ?
            val.toUpperCase() : val;
    }
}

export { TranslateUppercaseDirective };

export const translateUppercase = directive(TranslateUppercaseDirective);
