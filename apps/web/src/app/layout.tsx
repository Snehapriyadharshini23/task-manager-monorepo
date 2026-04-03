import "./globals.css";

export const metadata = {
  title: "Smart Task Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-blue-500">
        {children}
      </body>
    </html>
  );
}