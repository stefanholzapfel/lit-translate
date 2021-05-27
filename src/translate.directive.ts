import {AsyncDirective, directive} from 'lit/async-directive.js';
import {Interpolations, TranslateService} from './translate.service';
import {noChange} from 'lit';
import {DirectiveResult} from 'lit/directive';

class TranslateDirective extends AsyncDirective {
    protected identifier;
    protected interpolations;

    constructor(props) {
        super(props);
        TranslateService.connectDirective(this);
    }

    render(identifier: string, interpolations?: Interpolations): string | symbol | DirectiveResult<any>  {
        if (this.identifier !== identifier || this.interpolationsChanged(interpolations)) {
            this.identifier = identifier;
            this.interpolations = { ...interpolations };
            return TranslateService.translate(this.identifier, this.interpolations);
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
        this.setValue(TranslateService.translate(this.identifier, this.interpolations));
    }

    protected interpolationsChanged(interpolations: Interpolations): boolean {
        if (interpolations !== this.interpolations) {
            return true;
        }
        const ip1 = Object.keys(interpolations);
        const ip2 = Object.keys(this.interpolations);
        if (ip1.length !== ip2.length) {
            return true;
        }
        for (let key of ip1) {
            if (interpolations[key] !== this.interpolations[key]) {
                return true;
            }
        }
        return false;
    }
}

export { TranslateDirective };

export const translate = directive(TranslateDirective);
