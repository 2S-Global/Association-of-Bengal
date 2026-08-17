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
    <div className="light min-h-screen bg-[#fff8f5] text-on-surface">
      <Header/>
      {children}
      <Footer/>
    </div>
  );
}