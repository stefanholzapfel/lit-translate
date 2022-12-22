import {directive} from 'lit/async-directive.js';
import {Interpolations} from './translate.service';
import {TranslateDirective} from './translate.directive';

class TranslateLowercaseDirective extends TranslateDirective {
    render(identifier: string, interpolations?: Interpolations) {
        const val = super.render(identifier, interpolations);
        return (typeof val === 'symbol') ?
            val : (val as string).toLowerCase();
    }
}

export { TranslateLowercaseDirective };

export const translateLowercase = directive(TranslateLowercaseDirective);
