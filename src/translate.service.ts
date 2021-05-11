import {TranslateDirective} from './translate.directive';

class TranslateService {
    private static stringsLoader: StringsLoader;
    private static strings = new Map<string, Strings>();
    private static activeLanguage: string;
    private static registeredDirectives = new Set<TranslateDirective>();

    public static init(loader: StringsLoader) {
        this.stringsLoader = loader;
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

    public static translate(identifier: string, interpolations: Interpolations): string {
        const identifierArray = identifier.split('.');
        let strings: string | Strings = TranslateService.strings.get(TranslateService.activeLanguage);
        for (const segment of identifierArray) {
            const subObj = strings[segment];
            if (subObj) {
                strings = subObj;
            } else {
                return identifier;
            }
        }
        if (typeof strings === 'string') {
            if (interpolations) {
                for (const interpolation in interpolations) {
                    strings = strings.replace(new RegExp(`{{\\s?${interpolation}\\s?}}`, 'gm'), interpolations[interpolation]);
                }
            }
            return strings;
        }
        return identifier;
    }

    public static clearStrings() {
        TranslateService.strings = new Map<string, Strings>();
    }

    public static connectDirective(directive: TranslateDirective) {
        TranslateService.registeredDirectives.add(directive);
    }

    public static disconnectDirective(directive: TranslateDirective) {
        TranslateService.registeredDirectives.delete(directive);
    }
}

export { TranslateService };

export type Interpolations = {
    [key: string]: string;
}

export type Strings = {
    [key: string]: string | Strings;
};

export type StringsLoader = (language: LanguageIdentifier) => Promise<Strings>;

export type LanguageIdentifier = string;
