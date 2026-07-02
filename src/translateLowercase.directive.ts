import {directive} from 'lit/async-directive.js';
import {Interpolations} from './translate.service.js';
import {TranslateDirective} from './translate.directive.js';

class TranslateLowercaseDirective extends TranslateDirective {
    render(identifier: string, interpolations?: Interpolations) {
        const val = super.render(identifier, interpolations);
        return (typeof val === 'string') ?
            val.toLowerCase() : val;
    }
}

export { TranslateLowercaseDirective };

export const translateLowercase = directive(TranslateLowercaseDirective);
