import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {html, render} from 'lit';
import {TranslateService} from '../src/translate.service';
import {translate} from '../src/translate.directive';
import {translateObject} from '../src/translateObject.directive';

const strings: Record<string, any> = {
    en: {app: {hi: 'Hello', greet: 'Hi {{ name }}'}},
    de: {app: {hi: 'Hallo', greet: 'Hallo {{ name }}'}}
};

let container: HTMLElement;

beforeEach(async () => {
    TranslateService.init(async (lang) => strings[lang] ?? {});
    container = document.createElement('div');
    document.body.appendChild(container);
    await TranslateService.use('en');
});

afterEach(() => {
    container.remove();
});

describe('translate directive', () => {
    it('renders the active translation', () => {
        render(html`<span>${translate('app.hi')}</span>`, container);
        expect(container.textContent).toBe('Hello');
    });

    it('updates rendered directives on language change', async () => {
        render(html`<span>${translate('app.hi')}</span>`, container);
        expect(container.textContent).toBe('Hello');
        await TranslateService.use('de');
        expect(container.textContent).toBe('Hallo');
    });

    // The same template call site must be reused across renders so Lit keeps the
    // same directive instance; otherwise it rebuilds the part and re-translates.
    it('takes the noChange path when nothing changed (#3)', () => {
        const tpl = () => html`<span>${translate('app.hi')}</span>`;
        const spy = vi.spyOn(TranslateService, 'translate');
        render(tpl(), container);
        const afterFirst = spy.mock.calls.length;
        render(tpl(), container);
        expect(spy.mock.calls.length).toBe(afterFirst);
        spy.mockRestore();
    });

    it('treats value-equal interpolations as unchanged (#3 deep compare)', () => {
        const tpl = (v: string) => html`<span>${translate('app.hi', {x: v})}</span>`;
        const spy = vi.spyOn(TranslateService, 'translate');
        render(tpl('1'), container);
        const afterFirst = spy.mock.calls.length;
        render(tpl('1'), container); // new object, equal value -> deep compare -> noChange
        expect(spy.mock.calls.length).toBe(afterFirst);
        spy.mockRestore();
    });

    it('detects an in-place mutation of the same interpolations object (#3)', () => {
        const interp: any = {name: 'A'};
        const tpl = () => html`<span>${translate('app.greet', interp)}</span>`;
        render(tpl(), container);
        expect(container.textContent).toBe('Hi A');
        interp.name = 'B'; // same object reference, mutated property
        render(tpl(), container);
        expect(container.textContent).toBe('Hi B');
    });

    it('re-translates when an interpolation value changes', () => {
        const tpl = (v: string) => html`<span>${translate('app.hi', {x: v})}</span>`;
        const spy = vi.spyOn(TranslateService, 'translate');
        render(tpl('1'), container);
        const afterFirst = spy.mock.calls.length;
        render(tpl('2'), container);
        expect(spy.mock.calls.length).toBeGreaterThan(afterFirst);
        spy.mockRestore();
    });
});

describe('translateObject directive', () => {
    it('detects an in-place mutation of the same translations object', () => {
        const obj: Record<string, string> = {en: 'Hello'};
        const tpl = () => html`<span>${translateObject(obj)}</span>`;
        render(tpl(), container);
        expect(container.textContent).toBe('Hello');
        obj['en'] = 'Hey'; // same object reference, mutated value
        render(tpl(), container);
        expect(container.textContent).toBe('Hey');
    });

    it('detects a key added in place to the same translations object', () => {
        const obj: Record<string, string> = {de: 'Hallo'};
        const tpl = () => html`<span>${translateObject(obj, 'de')}</span>`;
        render(tpl(), container);
        expect(container.textContent).toBe('Hallo'); // fallback, active 'en' missing
        obj['en'] = 'Hello'; // add active-language key in place
        render(tpl(), container);
        expect(container.textContent).toBe('Hello');
    });

    it('keeps its fallback language after a language switch (#6)', async () => {
        await TranslateService.use('fr'); // active language has no entry in the object
        render(html`<span>${translateObject({en: 'Hello', de: 'Hallo'}, 'en')}</span>`, container);
        expect(container.textContent).toBe('Hello'); // fallback applied
        await TranslateService.use('de'); // triggers evaluate() on all directives
        expect(container.textContent).toBe('Hallo');
        await TranslateService.use('fr'); // missing again -> fallback must still work
        expect(container.textContent).toBe('Hello');
    });
});
