// Root entry exposes only the core service and shared types.
// Directives are intentionally NOT re-exported here so IDE auto-import
// and bundlers resolve them via their dedicated subpaths,
// e.g. `@stefanholzapfel/lit-translate/translateUppercase.js`.
export * from './translate.service.js';
