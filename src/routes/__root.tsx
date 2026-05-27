import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/contexts/AuthContext";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EmpoweredDLD — Words take flight" },
      { name: "description", content: "Evidence-based reading adventures designed by speech-language pathologists for kids with Developmental Language Disorder." },
      { name: "author", content: "EmpoweredDLD" },
      { property: "og:title", content: "EmpoweredDLD — Words take flight" },
      { property: "og:description", content: "Evidence-based reading adventures designed by speech-language pathologists for kids with Developmental Language Disorder." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "EmpoweredDLD — Words take flight" },
      { name: "twitter:description", content: "Evidence-based reading adventures designed by speech-language pathologists for kids with Developmental Language Disorder." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0d202b3b-9b6d-473e-bca4-033b5ae466a0/id-preview-1b4e8886--3cc1090b-e5f1-426f-9234-1408a01f8435.lovable.app-1779147773726.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0d202b3b-9b6d-473e-bca4-033b5ae466a0/id-preview-1b4e8886--3cc1090b-e5f1-426f-9234-1408a01f8435.lovable.app-1779147773726.png" },
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
