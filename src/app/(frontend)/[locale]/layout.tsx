import type { Metadata } from "next";

import { cn } from "src/utilities/cn";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import React from "react";

import { AdminBar } from "@/components/AdminBar";
import { Footer } from "@/globals/Footer/Component";
import { Header } from "@/globals/Header/Component";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { Providers } from "@/providers";
import { InitTheme } from "@/providers/Theme/InitTheme";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";
import { draftMode } from "next/headers";
import { TypedLocale } from "payload";
import { ReactLenis } from "@/utilities/lenis";

import "./globals.css";
import "leaflet/dist/leaflet.css";

import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import localization from "@/i18n/localization";

type Args = {
  children: React.ReactNode;
  params: Promise<{
    locale: TypedLocale;
  }>;
};

export default async function RootLayout({ children, params }: Args) {
  const { locale } = await params;
  const direction = "ltr";

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  setRequestLocale(locale);

  const { isEnabled } = await draftMode();
  const messages = await getMessages();

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang={locale}
      dir={direction}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="flex flex-col min-h-screen">
        <ReactLenis root>
          <Providers>
            <NextIntlClientProvider messages={messages}>
              {/* <AdminBar
                adminBarProps={{
                  preview: isEnabled,
                }}
              /> */}
              <LivePreviewListener />

              <Header locale={locale} />
              <main className="flex-grow">{children}</main>
              <Footer locale={locale} />
            </NextIntlClientProvider>
          </Providers>
        </ReactLenis>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SERVER_URL || "https://payloadcms.com"
  ),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: "summary_large_image",
    creator: "@payloadcms",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
