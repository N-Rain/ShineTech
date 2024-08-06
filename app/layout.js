import "./globals.css";
import "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"; 
import TopNav from "@/components/TopNav";

export const metadata = {
  title: "ShineTech",
  description: "Website bán thiết bị điện tử...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
