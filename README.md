# lit-translate
A very basic and lightweight translation directive for Lit

<h1>Installation</h1>

```
npm install @stefanholzapfel/lit-translate
```

<h1>Initialize the service</h1>

Before using the directive register a "loader" with the service.

The loader is an async function telling the translator how to load any specific language.

It receives a language identifier (string) and must return a Strings object which is an arbitrarily deeply nested object with only string values.

```
import { TranslateService } from '@stefanholzapfel/lit-translate';

TranslateService.init(
    language => {
        // load and return translations for language here (e.g. fetch from a JSON file)
    });
```

<h1>Usage</h1>

<h3>Set language:</h3>

Set the language to use with use().

The function is async and can be awaited if you want to avoid translation identifiers flashing up in your app.

The translation identifier can be whatever string you want, but I suggest to stick to a standard like ISO639.
```
await TranslateService.use('en-GB');
```

<h3>Usage in lit-html:</h3>

The translate directive accepts an identifier in dot notation. For this Strings object:
```
{
    app: {
        my_string: "TEST"
    }
}
```



```
<span>translate('app.my_string')</span>
```

resolves to:
```
<span>TEST</span>
```

The directive will automatically listen for language changes and change all directive values accordingly.

Use ``translateUnsafeHTML()`` if you want HTML in translations to be interpreted (otherwise same interface).
Use ``translateUppercase()`` if you want the output in uppercase letters.

<h3>Interpolation:</h3>

You can have dynamic parts in your translations. Just mark them with {{ name }} e.g.:

```
{
    app: {
        my_string: "TEST {{ test_var }}"
    }
}
```


```
<span>translate('app.my_string', { test_var: "another test" })</span>
```

resolves to:
```
<span>TEST another test</span>
```

Use as many interpolation values as you want. Just add them as properties to the interpolation object.

Interpolations can be strings, TemplateResults or DirectiveResults. That means you can e.g. nest translate directives
in each other: 
```
<span>translate('app.my_string', { test_var: translate('app.nested_string') })</span>
```


<h3>Clear all cached Strings:</h3>

```
TranslateService.clearStrings();
```

<h1>Optional: Directly translate from objects</h1>

This library also offers a way to provide a translations object in-place and a directive that automatically renders the language currently active in the `TranslateService` from it:

A sample translations object:

```
const myTranslations = {
    'en-GB': 'Hi, I'm a translationsObject!',
    'de-DE': 'Hallo, ich bin ein translationsObject!'
};
```

Usage with the directive:

```
translateObject(myTranslations);
```

A fallback language identifier can be provided as second parameter to the directive.