import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Liberia Digital Insights",
  description: "Your gateway to Liberia's digital transformation.",
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
