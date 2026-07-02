import {beforeEach, describe, expect, it} from 'vitest';
import {html} from 'lit';
import {isTemplateResult} from 'lit/directive-helpers.js';
import {TranslateService} from '../src/translate.service';

const strings = {
    app: {
        plain: 'Hello',
        greeting: 'Hello {{ name }}',
        spaced: 'Hello {{  name  }}',
        dotted: 'Total {{ price.total }}',
        multi: '{{ a }} and {{ b }}',
        tpl: 'Before {{ slot }} after'
    }
};

describe('TranslateService.translate', () => {
    beforeEach(async () => {
        TranslateService.init(async () => strings);
        await TranslateService.use('en');
    });

    it('resolves dot-notation identifiers', () => {
        expect(TranslateService.translate('app.plain')).toBe('Hello');
    });

    it('returns the identifier when the key is missing', () => {
        expect(TranslateService.translate('app.missing')).toBe('app.missing');
        expect(TranslateService.translate('does.not.exist')).toBe('does.not.exist');
    });

    it('interpolates a single value', () => {
        expect(TranslateService.translate('app.greeting', {name: 'Sam'})).toBe('Hello Sam');
    });

    it('interpolates even with extra whitespace inside the braces (#4)', () => {
        expect(TranslateService.translate('app.spaced', {name: 'Sam'})).toBe('Hello Sam');
    });

    it('interpolates keys that contain regex special characters (#5)', () => {
        expect(TranslateService.translate('app.dotted', {'price.total': '5'})).toBe('Total 5');
    });

    it('interpolates multiple values', () => {
        expect(TranslateService.translate('app.multi', {a: '1', b: '2'})).toBe('1 and 2');
    });

    it('throws on an invalid interpolation type', () => {
        expect(() => TranslateService.translate('app.greeting', {name: 5 as any})).toThrow();
    });

    it('returns a TemplateResult when a template interpolation is given', () => {
        const res = TranslateService.translate('app.tpl', {slot: html`<b>x</b>`});
        expect(isTemplateResult(res)).toBe(true);
    });
});

describe('TranslateService.translateFromObject', () => {
    beforeEach(async () => {
        TranslateService.init(async () => ({}));
        await TranslateService.use('de');
    });

    it('returns the active-language value', () => {
        expect(TranslateService.translateFromObject({de: 'Hallo', en: 'Hello'})).toBe('Hallo');
    });

    it('falls back to fallbackLanguage when the active language is missing', () => {
        expect(TranslateService.translateFromObject({en: 'Hello'}, 'en')).toBe('Hello');
    });

    it('returns an empty string when neither active nor fallback exist', () => {
        expect(TranslateService.translateFromObject({fr: 'Bonjour'})).toBe('');
        expect(TranslateService.translateFromObject({fr: 'Bonjour'}, 'es')).toBe('');
    });
});
