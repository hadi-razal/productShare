# ProductShare dashboard UI redesign

## Audit and scope

The repository already supplied `/store`, products, categories, add/edit product,
reviews, support messages, and store settings. Authentication uses Supabase;
storefront pages and themes use the same persisted store data. Product management
already supported filtering, selection, export, and bulk deletion. Settings already
provided catalogue themes, fonts, banner controls, visibility, and live preview.

The redesign keeps those routes, API calls, database operations, permissions,
storefront preferences, and business rules. There was no image attachment for the
Hostinger reference; the written brief supplied the visual direction.

## Implemented

- Scoped ProductShare design tokens, Geist, white surfaces, restrained purple,
  rounded cards, consistent controls, and responsive spacing.
- Fixed 260px sidebar, collapse control, labelled navigation groups, sticky header,
  profile menu, plan summary, skip link, and native modal navigation drawer.
- Dashboard greeting, setup tasks derived from actual saved data, quick actions,
  statistics, analytics date ranges, product performance, inventory insights, and
  share actions. Missing enquiry/click tracking is explicitly unavailable.
- Product grid/list controls, price/name/view sorting, existing filters and bulk
  actions, image placeholders, loading states, and retryable load errors.
- Native modal category and product confirmation dialogs with focus trapping,
  Escape cancellation, and busy-state protection.
- Product form styling, sticky submit controls, accessible image controls,
  next/image upload previews, and unsaved-change warnings for changed form inputs
  on external navigation links or tab close. Browser Back and programmatic
  navigation are not intercepted.
- Settings page header, sticky save button, and mobile Customize/Preview tabs.
- Copy link, open catalogue, WhatsApp/email share, locally generated QR code, and
  SVG QR download. QR generation does not send catalogue URLs to another service.
- Shared route loading/error boundaries, keyboard focus styles, reduced-motion
  support, and nonanimated analytics rendering.

Reusable components are in `components/dashboard`: PageHeader, QuickActionCard,
SetupTaskCard, ErrorState, WorkspaceDialog, ManagementProductCard, CatalogueQrCode,
and useUnsavedChanges. Existing cards, tables, and form components reuse the scoped
CSS system. The repository has no shadcn setup; native HTML dialogs were used for
modal accessibility without introducing a second component framework.

## Features not supplied by the existing app

Collections, customer management, domain provisioning/DNS/SSL, integrations,
billing history/renewal/payment data, event activity logs, and persisted enquiry or
link-click analytics have no working supporting flows in this repository. They
were not fabricated as clickable features. Pricing remains at `/pricing`, design
at `/store/settings`, and sharing within `/store#share-catalogue` to preserve URL
semantics and avoid taking existing storefront usernames.

The setup checklist has three verifiable tasks. It does not mark a domain or share
step complete without persisted evidence. Hidden products retain their existing
meaning; no new draft/publish business state or SEO persistence was invented.

## Verification

- TypeScript: `node node_modules/typescript/bin/tsc --noEmit`.
- Lint: `npm run lint` passes with existing warnings in admin and image components.
- Production build: `NEXT_DIST_DIR=.next-qa npm run build` (PowerShell: assign
  `$env:NEXT_DIST_DIR='.next-qa'` first). Isolated output avoids a running dev server.
- Serve that build with the same environment and `next start -p 3012`.
- `npm run test:dashboard` defaults to `http://localhost:3012`; override using
  `DASHBOARD_TEST_URL`. Browser fixtures intercept Supabase requests and mutations.
- Existing onboarding test passes against the isolated server using
  `ONBOARDING_TEST_URL=http://localhost:3012`.

Dashboard browser coverage includes setup, sidebar collapse, mobile drawer and
Escape, product search/grid/sort/selection, destructive dialog cancellation,
category dialog, load error recovery, QR download, mobile settings tabs, overflow,
and JavaScript errors. Screenshots are saved to ignored `artifacts/` for review.
Live database writes, billing, and external sharing delivery were not tested.
