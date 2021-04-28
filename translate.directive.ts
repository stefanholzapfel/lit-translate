import {AsyncDirective, directive} from 'lit/async-directive.js';
import {Interpolations, TranslateService} from './translate.service';

export class TranslateDirective extends AsyncDirective {
    private identifier;
    private interpolations;

    constructor(props) {
        super(props);
        TranslateService.connectDirective(this);
    }

    render(identifier: string, interpolations?: Interpolations) {
        this.identifier = identifier;
        this.interpolations = interpolations;
        return TranslateService.translate(this.identifier, this.interpolations);
    }

    disconnected() {
        TranslateService.disconnectDirective(this);
    }

    reconnected() {
        TranslateService.connectDirective(this);
    }

    public evaluate(): void {
        this.setValue(TranslateService.translate(this.identifier, this.interpolations));
    }
}

export const translate = directive(TranslateDirective);
