# Frontend Refactor Notes

## Scope

Frontend-only CSS and HTML class normalization. Backend files, API endpoints, request flow, and JavaScript logic were not modified.

## Renamed Selectors

New selectors were added alongside old selectors as migration aliases:

- `.header` -> `.layout-header`
- `.nav-container` -> `.layout-nav-container`
- `.nav-links` -> `.layout-nav-links`
- `.cta-container` -> `.layout-cta`
- `footer` / `.footer` -> `.layout-footer`
- `.shortcuts` -> `.layout-footer-shortcuts`
- `.quick-links` -> `.component-link-list`
- `.social-links` -> `.layout-social-links`
- `.modal` -> `.component-modal`
- `.close` -> `.component-modal-close`
- `button` / `.cta-button` usage -> `.component-button`
- `.card` -> `.card-base`
- `.panel` -> `.component-panel`
- `.flex-center` -> `.u-flex-center`
- `.stack` -> `.u-stack`
- `.dashboard` -> `.section-dashboard`
- `.mainOne` -> `.card-hero`
- `.exp-feat` -> `.card-feature`
- `.lang-box` -> `.card-language`
- `.text-box` -> `.component-text-block`
- `.name` -> `.u-accent-text`
- `.main` -> `.component-logo-main`
- `.override` -> `.component-logo-core-large`
- `.v1` -> `.component-logo-text-compact`
- `.logo-container` -> `.component-logo`
- `.logo-core` -> `.component-logo-core`
- `.logo-letter` -> `.component-logo-letter`
- `.logo-text` -> `.component-logo-text`
- `.logo-link` -> `.component-logo-link`
- `.project-section` -> `.section-projects`
- `.title` -> `.section-projects-title`
- `.summary-bar` -> `.card-project-summary`
- `.project-container` -> `.card-project-list`

## Moved Styles

- Moved repeated card, panel, flex-center, and vertical stack primitives into `root/frontend/styles/base.css`.
- Moved dashboard grid structure from `root/frontend/styles/components.css` to `root/frontend/styles/layout.css`.
- Moved home hero text and home logo variant styling from `root/frontend/styles/components.css` to `root/frontend/styles/index.css`.
- Kept project-specific section, summary, and project container styling in `root/frontend/styles/project.css`.
- Kept button and modal component styling in `root/frontend/styles/components.css`.

## Aliases Added

- Layout aliases: `layout-header`, `layout-nav-container`, `layout-nav-links`, `layout-cta`, `layout-footer`, `layout-footer-shortcuts`, `layout-social-links`.
- Component aliases: `component-button`, `component-modal`, `component-modal-close`, `component-panel`, `component-link-list`, `component-logo`, `component-logo-core`, `component-logo-letter`, `component-logo-text`, `component-logo-link`, `component-text-block`.
- Utility aliases: `u-flex-center`, `u-stack`, `u-accent-text`, `u-hidden`.
- Section/card aliases: `section-dashboard`, `section-projects`, `section-projects-title`, `card-base`, `card-hero`, `card-feature`, `card-language`, `card-project-summary`, `card-project-list`.
- Token alias: `--cel-gap` now points to the corrected `--cell-gap`.

## Deprecated Selectors

The old visual selectors are now compatibility selectors and should not be deleted until all markup and any future JS dependencies are migrated:

- `.header`, `.nav-container`, `.nav-links`, `.cta-container`
- `.footer`, `.shortcuts`, `.quick-links`, `.social-links`
- `.card`, `.panel`, `.flex-center`, `.stack`
- `.dashboard`, `.mainOne`, `.exp-feat`, `.lang-box`
- `.text-box`, `.name`, `.main`, `.override`, `.v1`
- `.project-section`, `.title`, `.summary-bar`, `.project-container`
- `.logo-container`, `.logo-core`, `.logo-letter`, `.logo-text`, `.logo-link`

Do not remove JS-critical selectors yet: `#hireModal`, `#hireForm`, `#hireMeBtn`, `.close`, `.hidden`, `#name`, `#email`, `#message`, `#githubStats`, `.heatmap-widget`, and `#backgroundCanvas`.

## Rationale

- The existing architecture was preserved: `base.css` for tokens/primitives, `layout.css` for page structure, `components.css` for reusable UI, and page CSS for page-specific styling.
- Repeated colors, shadows, blur values, and project borders were centralized as CSS variables.
- Normalized selector names follow the requested `layout-*`, `component-*`, `u-*`, `section-*`, and `card-*` patterns.
- Compatibility aliases keep old HTML and JS selector hooks working during the transition.
