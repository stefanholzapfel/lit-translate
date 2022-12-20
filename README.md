# lit-translate
A very basic and lightweight translation directive for Lit 2

<h1>Installation</h1>

```
npm install @stefanholzapfel/lit-translate
```

<h1>Initialize the service</h1>

Before using the directive register a "loader" with the service.

The loader is an async function telling the translator how to load any specific language.

It receives a language identifier (string) and must return a Strings object which is an arbitrarily deep nested object with only string values.

```
import { TranslateService } from '@stefanholzapfel/lit-translate';

TranslateService.init(
    language => {
        // load and return translations for language here (e.g. fetch from JSON file)
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

The directive will automatically listen for language changes and change all translate's values accordingly.

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

Interplolations can be strings, TemplateResults or DirectiveResults. That means you can e.g. nest translate directives
in eachother: 
```
<span>translate('app.my_string', { test_var: translate('app.nested_string') })</span>
```


<h3>Clear all cached Strings:</h3>

```
TranslateService.clearStrings();
```

<h1>Changelog</h1>
Starts with version 3, please see commit history for earlier changes.

<h3>v3.0.0</h3>
- **Interpolations** can now take **TemplateResults** and **DirectiveResults** and not only strings. This change requires a major version change since the API for interpolations has changed

<h4>v3.0.1</h4>
- Upgraded Lit to 2.2.8

<h4>v3.0.2</h4>
- Adapted directory cleanup in build scripts (Linux only)
- Made interpolations optional in translate service

<h4>v3.0.4</h4>
- Upgraded Lit to 2.4.1

<h4>v3.0.4</h4>
- Upgraded Lit to 2.5.0 and Typescript to 4.9.4

<h3>v3.1.0</h3>
- **isTemplateResult()** was removed from translate.service.ts since the naming didn't correctly reflect what it was doing and there is a proper 
isTemplateResult() available in lit/directive-helpers. But since it was part of the public api this is a breaking change.