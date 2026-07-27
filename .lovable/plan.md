Two small edits to the public landing-page header (`src/components/empowered/LandingPage.tsx`):

1. **Nav copy:** Change the first `NAV_LINKS` label from `"App Preview"` to `"See the App."`
2. **Logo size:** Increase the `<StoryProsLogo layout="row" size="sm" />` height by ~10 % (from `h-8` to `h-9`, i.e. 32 px → 36 px) by passing a custom height class. The surrounding `<header>` stays at `h-16`, so overall header height is unchanged.

No other header elements, pages, or components will be modified.