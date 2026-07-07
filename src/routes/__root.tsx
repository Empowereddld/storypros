import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { seedDemoAccount } from "@/services/demoSeed";
import danDariaThinking from "@/assets/dan-daria-thinking.webp";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import {
  AuthBackdrop,
  MiniPlane,
  StoryProsLogo,
  Star,
} from "@/components/empowered/StoryProsBrand";

// Seed demo data before React renders (browser only — uses localStorage)
if (typeof window !== "undefined") {
  seedDemoAccount();
}

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col overflow-hidden bg-cream px-5 text-center">
        <AuthBackdrop />
        <Star className="absolute left-9 top-28 z-10 h-5 w-5 text-secondary animate-sparkle" />
        <Star className="absolute right-10 top-40 z-10 h-4 w-4 text-primary/35 animate-sparkle" />
        <MiniPlane className="absolute right-12 top-20 z-10 h-8 w-8 rotate-[18deg] text-secondary animate-float" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center pb-8">
          <StoryProsLogo layout="row" size="md" className="scale-95" />
          <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-card bg-secondary text-secondary-foreground shadow-card animate-bounce-in">
            <Star className="h-11 w-11" />
          </div>
          <h1 className="mt-5 font-display text-[58px] font-extrabold leading-none text-primary">
            404
          </h1>
          <h2 className="mt-1 font-display text-[30px] font-extrabold leading-tight text-ink">
            Page not found
          </h2>
          <p className="mt-2 max-w-[300px] text-[15px] font-semibold leading-snug text-ink-soft">
            This path is not part of the Story Pros adventure.
          </p>

          <div className="mt-6 w-full overflow-hidden rounded-[28px] border-[6px] border-card bg-card shadow-soft">
            <img
              src={danDariaThinking}
              alt=""
              className="h-[220px] w-full object-cover object-center"
            />
          </div>

          <Link
            to="/"
            className="btn-tactile mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-primary px-5 text-lg font-extrabold text-primary-foreground"
          >
            Go Home
          </Link>
        </div>
      </div>
    </PhoneFrame>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EmpoweredDLD — Words take flight" },
      {
        name: "description",
        content:
          "Evidence-based reading adventures designed by speech-language pathologists for kids with Developmental Language Disorder.",
      },
      { name: "author", content: "EmpoweredDLD" },
      { property: "og:title", content: "EmpoweredDLD — Words take flight" },
      {
        property: "og:description",
        content:
          "Evidence-based reading adventures designed by speech-language pathologists for kids with Developmental Language Disorder.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "EmpoweredDLD — Words take flight" },
      {
        name: "twitter:description",
        content:
          "Evidence-based reading adventures designed by speech-language pathologists for kids with Developmental Language Disorder.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0d202b3b-9b6d-473e-bca4-033b5ae466a0/id-preview-1b4e8886--3cc1090b-e5f1-426f-9234-1408a01f8435.lovable.app-1779147773726.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0d202b3b-9b6d-473e-bca4-033b5ae466a0/id-preview-1b4e8886--3cc1090b-e5f1-426f-9234-1408a01f8435.lovable.app-1779147773726.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
