// import "./web.css"
// import Header from './component/header';
// import Footer from './component/footer';

// export default function WebsiteLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <>
//       <Header/>
//       {children}
//       <Footer/>
//     </>
//   );
// }

import { ReactElement, ReactNode } from "react";
import Header from "./component/header";
import Footer from "./component/footer";
import "../globals.css"
import { Toaster } from 'sonner';

interface WebsiteLayoutProps {
  children: ReactNode;
}

export default function WebsiteLayout({ children }: WebsiteLayoutProps): ReactElement {
  return (
    // Removed 'min-h-screen' and 'flex-col' from here
    <div className="light bg-[#fff8f5] text-on-surface">
      <Header />
      
      {/* Removed 'flex-grow' from here so it simply wraps the content */}
      <main className="w-full">
        {children}
        <Toaster position="top-center" richColors />
      </main>
      
      <Footer />
    </div>
  );
}