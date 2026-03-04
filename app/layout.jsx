import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://liberiadigitalinsights.com",
  ),
  title: {
    default: "Liberia Digital Insights",
    template: "%s | Liberia Digital Insights",
  },
  description:
    "Your gateway to Liberia's digital transformation. Exploring tech trends, policies, and opportunities in Liberia.",
  keywords: [
    "Liberia",
    "Digital Transformation",
    "Tech",
    "Innovation",
    "ICT",
    "Economy",
  ],
  authors: [{ name: "LDI Team" }],
  creator: "Liberia Digital Insights",
  openGraph: {
    type: "website",
    locale: "en_LR",
    url: "https://liberiadigitalinsights.com",
    siteName: "Liberia Digital Insights",
    title: "Liberia Digital Insights",
    description: "Your gateway to Liberia's digital transformation.",
    images: [
      {
        url: "/LDI_favicon.png", // Fallback image
        width: 1200,
        height: 630,
        alt: "Liberia Digital Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liberia Digital Insights",
    description: "Your gateway to Liberia's digital transformation.",
    images: ["/LDI_favicon.png"],
    creator: "@LDI_Liberia",
  },
  icons: {
    icon: "/LDI_favicon.png",
    shortcut: "/LDI_favicon.png",
    apple: "/LDI_favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ClientProviders>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:m-4 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
          >
            Skip to content
          </a>
          <Navbar />
          <main
            id="main-content"
            className="outline-none focus:outline-none min-h-screen"
          >
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
