import {TranslateDirective} from './translate.directive.js';
import {isDirectiveResult, isTemplateResult} from 'lit/directive-helpers.js';
import {html, TemplateResult} from 'lit';
import {DirectiveResult} from 'lit/directive.js';
import {TranslateObjectDirective} from "./translateObject.directive.js";

const STRING_SEPARATOR = '__!!!LIT!!!__';

declare global {
    interface Window {
        litTranslateServiceData: LitTranslateServiceData;
    }
}

class TranslateService {
    private static set translateServiceData(data) { window['litTranslateServiceData'] = data; }
    private static get translateServiceData(): LitTranslateServiceData { return window['litTranslateServiceData']; }
    private static get stringsLoader(): StringsLoader { return this.translateServiceData.loader; };
    private static set strings(strings) { window['litTranslateServiceData'].strings = strings; }
    private static get strings() { return this.translateServiceData.strings; };
    private static set activeLanguage(string) { window['litTranslateServiceData'].activeLanguage = string; }
    private static get activeLanguage(): string | undefined { return this.translateServiceData.activeLanguage; };
    private static set activeFallbackLanguage(string) { window['litTranslateServiceData'].activeFallbackLanguage = string; }
    private static get activeFallbackLanguage(): string | undefined { return this.translateServiceData.activeFallbackLanguage; };
    private static get initFallbackLanguage(): string | undefined { return this.translateServiceData.fallbackLanguage; };
    private static get registeredDirectives() { return this.translateServiceData.registeredDirectives; };

    public static init(loader: StringsLoader, fallbackLanguage?: LanguageIdentifier) {
        TranslateService.translateServiceData = {
            loader,
            fallbackLanguage,
            strings: new Map<string, Strings>(),
            registeredDirectives: new Set<TranslateDirective>()
        };
    }

    public static async use(language: LanguageIdentifier, fallbackLanguage?: LanguageIdentifier): Promise<Strings> {
        if (!TranslateService.stringsLoader) {
            throw new Error('Lit-translate: Call init first and set a loader!');
        }
        const effectiveFallbackLanguage = fallbackLanguage ?? TranslateService.initFallbackLanguage;
        let strings = TranslateService.strings.get(language);
        if (!strings) {
            strings = await TranslateService.stringsLoader(language);
        }
        if (effectiveFallbackLanguage && effectiveFallbackLanguage !== language &&
            !TranslateService.strings.has(effectiveFallbackLanguage)) {
            TranslateService.strings.set(effectiveFallbackLanguage, await TranslateService.stringsLoader(effectiveFallbackLanguage));
        }
        TranslateService.activeLanguage = language;
        TranslateService.activeFallbackLanguage = effectiveFallbackLanguage;
        TranslateService.strings.set(language, strings);
        TranslateService.registeredDirectives.forEach(directive => {
            directive.evaluate();
        });
        return strings;
    }

    private static lookupString(language: LanguageIdentifier | undefined, identifierArray: string[]): string | undefined {
        if (language === undefined)
            return undefined;
        let strings: string | Strings | undefined = TranslateService.strings.get(language);
        for (const segment of identifierArray) {
            if (strings && typeof strings !== 'string' && strings.hasOwnProperty(segment))
                strings = strings[segment];
            else
                return undefined;
        }
        return typeof strings === 'string' ? strings : undefined;
    }

    public static translate(identifier: string, interpolations?: Interpolations): string | TemplateResult {
        const identifierArray = identifier.split('.');
        let strings: string | undefined = TranslateService.lookupString(TranslateService.activeLanguage, identifierArray) ??
            TranslateService.lookupString(TranslateService.activeFallbackLanguage, identifierArray);
        if (typeof strings === 'string') {
            const templateTypeInterpolations: Record<string, TemplateResult | DirectiveResult> = {};
            if (interpolations) {
                for (const interpolationKey in interpolations) {
                    const value = interpolations[interpolationKey];
                    let _interpolation: string;
                    if (isTemplateResult(value) || isDirectiveResult(value)) {
                        templateTypeInterpolations[interpolationKey] = value;
                        _interpolation = `{{${interpolationKey}}}${STRING_SEPARATOR}`;
                    } else if (typeof value !== 'string') {
                        throw new Error('Invalid type for interpolation provided!');
                    } else
                        _interpolation = value;
                    const escapedKey = interpolationKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    strings = strings.replace(new RegExp(`{{\\s*${escapedKey}\\s*}}`, 'gm'), _interpolation);
                }
            }
            if (!!Object.keys(templateTypeInterpolations).length) {
                let _stringsAndTemplates: (string | TemplateResult | DirectiveResult)[] = strings.split(STRING_SEPARATOR);
                if (_stringsAndTemplates.length === 1) return strings;
                for (let i = _stringsAndTemplates.length - 1; i >= 0; i--) {
                    for (const interpolationKey in templateTypeInterpolations) {
                        const part = _stringsAndTemplates[i];
                        if (typeof part === 'string' && part.endsWith(`{{${interpolationKey}}}`)) {
                            _stringsAndTemplates[i] = part.replace(`{{${interpolationKey}}}`, '');
                            _stringsAndTemplates.splice(i + 1, 0, templateTypeInterpolations[interpolationKey]);
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
        const language = TranslateService.activeLanguage;
        const effectiveFallbackLanguage = fallbackLanguage ?? TranslateService.activeFallbackLanguage;
        return (language !== undefined ? translationsObject[language] : undefined) ??
            (effectiveFallbackLanguage ?
                translationsObject[effectiveFallbackLanguage] ?? '' : '');
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
    fallbackLanguage?: string;
    strings: Map<string, Strings>;
    activeLanguage?: string;
    activeFallbackLanguage?: string;
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