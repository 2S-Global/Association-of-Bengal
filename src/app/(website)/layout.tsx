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

interface WebsiteLayoutProps {
  children: ReactNode;
}

export default function WebsiteLayout({ children }: WebsiteLayoutProps): ReactElement {
  return (
    // 1. Added 'flex' and 'flex-col' to the main wrapper
    <div className="light min-h-screen bg-[#fff8f5] text-on-surface flex flex-col">
      <Header />
      
      {/* 2. Wrapped children in a main tag with 'flex-grow' */}
      {/* This pushes the footer securely to the bottom of the page */}
      <main className="flex-grow w-full flex flex-col">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}