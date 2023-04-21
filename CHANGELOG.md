# Changelog
Starts with version 3, please see commit history for earlier changes.

## [3.0.0]
- **Interpolations** can now take **TemplateResults** and **DirectiveResults** and not only strings. This change requires a major version change since the API for interpolations has changed

## [3.0.1]
- Upgraded Lit to 2.2.8

## [3.0.2]
- Adapted directory cleanup in build scripts (Linux only)
- Made interpolations optional in translate service

## [3.0.4]
- Upgraded Lit to 2.4.1

## [3.0.4]
- Upgraded Lit to 2.5.0 and Typescript to 4.9.4

## [3.1.0]
- **isTemplateResult()** was removed from translate.service.ts since the naming didn't correctly reflect what it was doing and there is a proper
  isTemplateResult() available in lit/directive-helpers. But since it was part of the public api this is a breaking change.

## [3.2.0] Left out by mistake

## [3.3.0]
- Added **translateLowercase** directive

## [3.3.1]
- Upgraded Lit to 2.6.0

## [3.3.2]
- Upgraded Lit to 2.7.2