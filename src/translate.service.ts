import {TranslateDirective} from './translate.directive';
import {isDirectiveResult, isTemplateResult} from 'lit/directive-helpers.js';
import {html, TemplateResult} from 'lit';
import {DirectiveResult} from 'lit-html/directive';
import {TranslateObjectDirective} from "./translateObject.directive";

const STRING_SEPARATOR = '__!!!LIT!!!__';

class TranslateService {
    private static set translateServiceData(data) { window['litTranslateServiceData'] = data; }
    private static get translateServiceData(): LitTranslateServiceData { return window['litTranslateServiceData']; }
    private static get stringsLoader(): StringsLoader { return this.translateServiceData.loader; };
    private static set strings(strings) { window['litTranslateServiceData'].strings = strings; }
    private static get strings() { return this.translateServiceData.strings; };
    private static set activeLanguage(string) { window['litTranslateServiceData'].activeLanguage = string; }
    private static get activeLanguage(): string { return this.translateServiceData.activeLanguage; };
    private static get registeredDirectives() { return this.translateServiceData.registeredDirectives; };

    public static init(loader: StringsLoader) {
        TranslateService.translateServiceData = {
            loader,
            strings: new Map<string, Strings>(),
            registeredDirectives: new Set<TranslateDirective>()
        };
    }

    public static async use(language: LanguageIdentifier): Promise<Strings> {
        if (!TranslateService.stringsLoader) {
            throw new Error('Lit-translate: Call init first and set a loader!');
        }
        let strings = TranslateService.strings.get(language);
        if (!strings) {
            strings = await TranslateService.stringsLoader(language);
        }
        TranslateService.activeLanguage = language;
        TranslateService.strings.set(language, strings);
        TranslateService.registeredDirectives.forEach(directive => {
            directive.evaluate();
        });
        return strings;
    }

    public static translate(identifier: string, interpolations?: Interpolations): string | TemplateResult {
        let strings: string | Strings = TranslateService.strings.get(TranslateService.activeLanguage);
        const identifierArray = identifier.split('.');
        for (const segment of identifierArray) {
            if (strings && strings.hasOwnProperty(segment)) {
                strings = strings[segment];
            } else {
                return identifier;
            }
        }
        if (typeof strings === 'string') {
            const templates = {};
            if (interpolations) {
                for (const interpolation in interpolations) {
                    let _interpolation = interpolations[interpolation];
                    if (isTemplateResult(_interpolation) || isDirectiveResult(_interpolation)) {
                        templates[interpolation] = _interpolation;
                        _interpolation = `{{${interpolation}}}${STRING_SEPARATOR}`;
                    } else if (typeof _interpolation === 'string') {
                        strings = (strings as string).replace(new RegExp(`{{\\s?${interpolation}\\s?}}`, 'gm'), _interpolation);
                    } else
                        throw new Error('Invalid type for interpolation provided!')
                }
            }
            if (!!Object.keys(templates).length) {
                let _stringsAndTemplates = strings.split(STRING_SEPARATOR);
                if (_stringsAndTemplates.length === 1) return strings;
                for (let i = _stringsAndTemplates.length - 1; i >= 0; i--) {
                    for (const interpolationKey in templates) {
                        if (_stringsAndTemplates[i].endsWith(`{{${interpolationKey}}}`)) {
                            _stringsAndTemplates[i] = _stringsAndTemplates[i].replace(`{{${interpolationKey}}}`, '');
                            _stringsAndTemplates.splice(i + 1, 0, templates[interpolationKey]);
                        }
                    }
                }
                return html`${_stringsAndTemplates.filter(v => v !== '')}`;
            }
            return strings;
        }
        return identifier;
    }

    public static translateFromObject(translationsObject: TranslationsObject, fallbackLanguage?: string) {
        return translationsObject[TranslateService.activeLanguage] ??
            fallbackLanguage ?
                translationsObject[fallbackLanguage] ?? '' : '';
    }

    public static clearStrings() {
        TranslateService.strings = new Map<string, Strings>();
    }

    public static connectDirective(directive: TranslateDirective | TranslateObjectDirective) {
        TranslateService.registeredDirectives.add(directive);
    }

    public static disconnectDirective(directive: TranslateDirective | TranslateObjectDirective) {
        TranslateService.registeredDirectives.delete(directive);
    }
}

interface LitTranslateServiceData {
    loader: StringsLoader;
    strings: Map<string, Strings>;
    activeLanguage?: string;
    registeredDirectives: Set<TranslateDirective | TranslateObjectDirective>;
}

export {TranslateService};

export type Interpolations = {
    [key: string]: string | TemplateResult | DirectiveResult;
}

export type Strings = {
    [key: string]: string | Strings;
};

export type StringsLoader = (language: LanguageIdentifier) => Promise<Strings>;

export type LanguageIdentifier = string;

export interface TranslationsObject {
    [key: string]: string | DirectiveResult | TemplateResult;
}