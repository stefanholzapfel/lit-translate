# lit-translate
A very basic and lightweight translation directive for LitElement

<h1>Installation</h1>

```
npm install @stefanholzapfel/lit-translate
```

<h1>Initialize the service</h1>
Before using the directive, register a "loader" with the service and set a language.
The loader is just a function telling the translator how to load any specific language. It receives a language 
identifier (string) and must return a Strings object.

```
TranslateService.init(
    language => {
        // load and return translations for language here (e.g. from JSON file)
    }, 
    'de-DE');
```

The init function is async and can be awaited if you want to avoid translation identifiers flashing up in your app.

<h1>Usage</h1>

<h3>Change language:</h3>
```
await TranslateService.use('en-GB');
```

<h3>Usage in lit-html:</h3>

Use dot notation. For a Strings object like this returned from the loader:
```
{
    app: {
        my_string: "TEST"
    }
}
```

use:

```
<span>translate('app.my_string')</span>
```

resolves to:
```
<span>TEST</span>
```

The directive will automatically listen for language changes and change accordingly.

<h3>Interpolation:</h3>
You can have dynamic parts in your translations. Just mark them with {{ name }} e.g.:
```
{
    app: {
        my_string: "TEST {{ test_var }}"
    }
}
```

use:

```
<span>translate('app.my_string', { test_var: "another test" })</span>
```

resolves to:
```
<span>TEST another test</span>
```

Use as many interpolation values as you want. Just add them as properties to the interpolation object. 


<h3>Clear all cached Strings:</h3>
```
TranslateService.clearStrings();
```
