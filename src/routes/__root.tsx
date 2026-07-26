import { Outlet, createRootRoute, HeadContent, Scripts, useNavigate } from "@tanstack/react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { seedDemoAccount } from "@/services/demoSeed";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { NotFoundState } from "@/components/empowered/StateScreens";

// Seed demo data before React renders (browser only — uses localStorage)
if (typeof window !== "undefined") {
  seedDemoAccount();
}

import appCss from "../styles.css?url";
import appIcon from "@/assets/story-pros-icon.png";

function NotFoundComponent() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <NotFoundState onHome={() => navigate({ to: "/" })} />
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
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: appIcon },
      { rel: "apple-touch-icon", href: appIcon },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800&family=Caveat:wght@500;700&display=swap",
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
