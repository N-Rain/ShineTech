import "./globals.css";
import "bootstrap-material-design/dist/css/bootstrap-material-design.min.css";
import TopNav from "@/components/TopNav";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "ShineTech",
  description: "Website bán thiết bị điện tử...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        
        {children}
        <Toaster />
      </body>
    </html>
  );
}
