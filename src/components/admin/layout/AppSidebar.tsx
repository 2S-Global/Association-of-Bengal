
// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { useSidebar } from "@/context/admin/SidebarContext";
// import {
//   ChevronDownIcon,
//   GridIcon,
//   HorizontaLDots,
// } from "@/icons";
// import { AlertCircleIcon, FileText, MessageSquare } from "lucide-react";
// // Removed lucide-react since you are using your custom MembersIcon now!

// const BallotIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
//     <path d="M7 4.75h10a1.5 1.5 0 0 1 1.5 1.5v11.5A1.5 1.5 0 0 1 17 19.25H7A1.5 1.5 0 0 1 5.5 17.75V6.25A1.5 1.5 0 0 1 7 4.75Z" strokeLinecap="round" strokeLinejoin="round" />
//     <path d="M9 8.5h6M9 12h6M9 15.5h4.5" strokeLinecap="round" strokeLinejoin="round" />
//     <path d="M8 3.75v2M16 3.75v2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const TicketIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
//     <path d="M4.75 9.5V7.25A1.5 1.5 0 0 1 6.25 5.75h11.5a1.5 1.5 0 0 1 1.5 1.5v2.25a2.25 2.25 0 0 0 0 4.5v2.25a1.5 1.5 0 0 1-1.5 1.5H6.25a1.5 1.5 0 0 1-1.5-1.5v-2.25a2.25 2.25 0 0 0 0-4.5Z" strokeLinecap="round" strokeLinejoin="round" />
//     <path d="M9 8.25v7.5M15 8.25v7.5" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const MembersIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
//     {/* Main person body */}
//     <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
//     {/* Main person head */}
//     <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
//     {/* Second person body */}
//     <path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
//     {/* Second person head */}
//     <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: {
//     name: string;
//     path: string;
//     pro?: boolean;
//     new?: boolean;
//   }[];
// };

// const navItems: NavItem[] = [
//   {
//     icon: <GridIcon />,
//     name: "Dashboard",
//     path: "/admin/dashboard",
//   },
//   {
//     icon: <MembersIcon />, 
//     name: "Members",
//     subItems: [
//       {
//         name: "All Members",
//         path: "/admin/members",
//       },
//     ],
//   },
//   {
//     icon: <BallotIcon />,
//     name: "Manage Election",
//     subItems: [
//       {
//         name: "Add Election",
//         path: "/admin/manage-election/add-election",
//       },
//       {
//         name: "List Election",
//         path: "/admin/manage-election/list-election",
//       },
//     ],
//   },
//   {
//     icon: <TicketIcon />,
//     name: "Stall Bookings",
//     subItems: [
//       {
//         name: "All Bookings",
//         path: "/admin/stall-bookings/list",
//       },
//     ],
//   },
//   {
//   icon: <FileText size={20} />,
//   name: "Manage CMS",
//   subItems: [
//     {
//       name: "Manage Event",
//       path: "/admin/manage-cms/manage-events",
//     },
//     {
//       name: "List Pages",
//       path: "/admin/manage-cms/list-pages",
//     },
//   ],
// },
//   {
//   icon: <MessageSquare className="w-5 h-5" />,
//   name: "Complaints",
//   subItems: [
//     {
//       name: "All Complaints",
//       path: "/admin/complaints",
//     },
//   ],
// },
// ];

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const pathname = usePathname();

//   const [openSubmenu, setOpenSubmenu] = useState<{
//     type: "main";
//     index: number;
//   } | null>(null);

//   // 1. THIS FIXES THE INITIAL LOAD
//   // Automatically opens the correct submenu based on current URL when page loads
//   useEffect(() => {
//     const activeIndex = navItems.findIndex((item) =>
//       item.subItems?.some(
//         (subItem) => pathname === subItem.path || pathname.startsWith(`${subItem.path}/`)
//       )
//     );

//     if (activeIndex !== -1) {
//       setOpenSubmenu({ type: "main", index: activeIndex });
//     }
//   }, [pathname]);

//   const isActive = (path: string) => path === pathname;

//   // 2. THIS FIXES THE CLICKING BUG
//   // Now it solely relies on the state, allowing you to actually close it
//   const isSubmenuOpen = (index: number) => {
//     return openSubmenu?.type === "main" && openSubmenu.index === index;
//   };

//   const handleSubmenuToggle = (index: number, menuType: "main") => {
//     setOpenSubmenu((prevOpenSubmenu) => {
//       if (
//         prevOpenSubmenu &&
//         prevOpenSubmenu.type === menuType &&
//         prevOpenSubmenu.index === index
//       ) {
//         return null;
//       }
//       return {
//         type: menuType,
//         index,
//       };
//     });
//   };

//   const renderMenuItems = (items: NavItem[]) => (
//     <ul className="flex flex-col gap-4">
//       {items.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.subItems ? (
//             <>
//               <button
//                 onClick={() => handleSubmenuToggle(index, "main")}
//                 className={`menu-item group ${
//                   isSubmenuOpen(index)
//                     ? "menu-item-active"
//                     : "menu-item-inactive"
//                 } cursor-pointer ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "lg:justify-start"
//                 }`}
//               >
//                 <span
//                   className={`${
//                     isSubmenuOpen(index)
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>

//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="menu-item-text">{nav.name}</span>
//                 )}

//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <ChevronDownIcon
//                     className={`menu-item-arrow ml-auto h-5 w-5 text-white transition-transform duration-200 ${
//                       isSubmenuOpen(index)
//                         ? "menu-item-arrow-active"
//                         : "menu-item-arrow-inactive"
//                     }`}
//                   />
//                 )}
//               </button>

//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <div
//                   className="overflow-hidden transition-all duration-300"
//                   style={{
//                     height: isSubmenuOpen(index) ? "auto" : "0px",
//                   }}
//                 >
//                   <ul className="mt-2 space-y-1 ml-9">
//                     {nav.subItems.map((subItem) => (
//                       <li key={subItem.name}>
//                         <Link
//                           href={subItem.path}
//                           className={`menu-dropdown-item ${
//                             isActive(subItem.path)
//                               ? "menu-dropdown-item-active"
//                               : "menu-dropdown-item-inactive"
//                           }`}
//                         >
//                           {subItem.name}

//                           <span className="flex items-center gap-1 ml-auto">
//                             {subItem.new && (
//                               <span
//                                 className={`ml-auto ${
//                                   isActive(subItem.path)
//                                     ? "menu-dropdown-badge-active"
//                                     : "menu-dropdown-badge-inactive"
//                                 } menu-dropdown-badge`}
//                               >
//                                 new
//                               </span>
//                             )}

//                             {subItem.pro && (
//                               <span
//                                 className={`ml-auto ${
//                                   isActive(subItem.path)
//                                     ? "menu-dropdown-badge-active"
//                                     : "menu-dropdown-badge-inactive"
//                                 } menu-dropdown-badge`}
//                               >
//                                 pro
//                               </span>
//                             )}
//                           </span>
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </>
//           ) : (
//             nav.path && (
//               <Link
//                 href={nav.path}
//                 className={`menu-item group ${
//                   isActive(nav.path)
//                     ? "menu-item-active"
//                     : "menu-item-inactive"
//                 }`}
//               >
//                 <span
//                   className={`${
//                     isActive(nav.path)
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>

//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="menu-item-text">{nav.name}</span>
//                 )}
//               </Link>
//             )
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-brand-500 border-brand-600 text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-transparent ${
//         isExpanded || isMobileOpen
//           ? "w-[270px]"
//           : isHovered
//           ? "w-[270px]"
//           : "w-[90px]"
//       } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Logo */}
//       <div
//         className={`py-8 flex items-center ${
//           !isExpanded && !isHovered
//             ? "lg:justify-center"
//             : "justify-start"
//         }`}
//       >
//         <Link href="/admin">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <div className="flex items-center gap-3">
//               <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
//                 <Image
//                   src="/images/logo/balc_logo.png"
//                   alt="Logo"
//                   width={30}
//                   height={30}
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-xs font-bold text-white leading-tight">
//                   ASSOCIATION OF BENGAL
//                 </span>
//                 <span className="text-xs font-semibold text-white/80 leading-tight">
//                   FOR LITERATURE AND CULTURE
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
//               <Image
//                 src="/images/logo/balc_logo.png"
//                 alt="Logo"
//                 width={30}
//                 height={30}
//               />
//             </div>
//           )}
//         </Link>
//       </div>

//       {/* Navigation */}
//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div>
//             <h2
//               className={`mb-4 text-xs uppercase flex leading-[20px] text-white/70 ${
//                 !isExpanded && !isHovered
//                   ? "lg:justify-center"
//                   : "justify-start"
//               }`}
//             >
//               {isExpanded || isHovered || isMobileOpen ? (
//                 "Menu"
//               ) : (
//                 <HorizontaLDots />
//               )}
//             </h2>

//             {renderMenuItems(navItems)}
//           </div>
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;


"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/admin/SidebarContext";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
} from "@/icons";
import { FileText, MessageSquare } from "lucide-react";

const BallotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
    <path d="M7 4.75h10a1.5 1.5 0 0 1 1.5 1.5v11.5A1.5 1.5 0 0 1 17 19.25H7A1.5 1.5 0 0 1 5.5 17.75V6.25A1.5 1.5 0 0 1 7 4.75Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 8.5h6M9 12h6M9 15.5h4.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 3.75v2M16 3.75v2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TicketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
    <path d="M4.75 9.5V7.25A1.5 1.5 0 0 1 6.25 5.75h11.5a1.5 1.5 0 0 1 1.5 1.5v2.25a2.25 2.25 0 0 0 0 4.5v2.25a1.5 1.5 0 0 1-1.5 1.5H6.25a1.5 1.5 0 0 1-1.5-1.5v-2.25a2.25 2.25 0 0 0 0-4.5Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 8.25v7.5M15 8.25v7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MembersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: <MembersIcon />, 
    name: "Members",
    subItems: [
      {
        name: "All Members",
        path: "/admin/members",
      },
    ],
  },
  {
    icon: <BallotIcon />,
    name: "Manage Election",
    subItems: [
      {
        name: "Add Election",
        path: "/admin/manage-election/add-election",
      },
      {
        name: "List Election",
        path: "/admin/manage-election/list-election",
      },
    ],
  },
  {
    icon: <TicketIcon />,
    name: "Stall Bookings",
    subItems: [
      {
        name: "All Bookings",
        path: "/admin/stall-bookings/list",
      },
    ],
  },
  {
    icon: <FileText size={20} />,
    name: "Manage CMS",
    subItems: [
      {
        name: "Manage Event",
        path: "/admin/manage-cms/manage-events",
      },
      {
      name: "Manage Gallery",
      path: "/admin/manage-cms/manage-gallery",
    },
      {  name: "Manage Wings",
        path: "/admin/manage-cms/manage-wings",
      },
    ],
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    name: "Complaints",
    subItems: [
      {
        name: "All Complaints",
        path: "/admin/complaints",
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, toggleMobileSidebar, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);

  useEffect(() => {
    const activeIndex = navItems.findIndex((item) =>
      item.subItems?.some(
        (subItem) => pathname === subItem.path || pathname.startsWith(`${subItem.path}/`)
      )
    );

    if (activeIndex !== -1) {
      setOpenSubmenu({ type: "main", index: activeIndex });
    }
  }, [pathname]);

  const isActive = (path: string) => path === pathname;

  const isSubmenuOpen = (index: number) => {
    return openSubmenu?.type === "main" && openSubmenu.index === index;
  };

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return {
        type: menuType,
        index,
      };
    });
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-3">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index, "main")}
                className={`menu-item group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isSubmenuOpen(index)
                    ? "menu-item-active bg-white/10 text-white font-medium shadow-xs"
                    : "menu-item-inactive text-white/80 hover:bg-white/5 hover:text-white"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span className={`flex-shrink-0 ${isSubmenuOpen(index) ? "text-[#fed488]" : "text-white/80"}`}>
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text text-sm truncate">{nav.name}</span>
                )}

                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`menu-item-arrow ml-auto h-4 w-4 text-white/70 transition-transform duration-200 ${
                      isSubmenuOpen(index)
                        ? "menu-item-arrow-active rotate-180 text-white"
                        : "menu-item-arrow-inactive"
                    }`}
                  />
                )}
              </button>

              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    height: isSubmenuOpen(index) ? "auto" : "0px",
                  }}
                >
                  <ul className="mt-1.5 space-y-1 ml-9 border-l border-white/10 pl-3">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          onClick={() => {
                            if (isMobileOpen) toggleMobileSidebar();
                          }}
                          className={`menu-dropdown-item flex items-center py-2 px-3 rounded-lg text-xs sm:text-sm transition-all ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active font-semibold text-[#fed488] bg-white/10"
                              : "menu-dropdown-item-inactive text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                onClick={() => {
                  if (isMobileOpen) toggleMobileSidebar();
                }}
                className={`menu-item group flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive(nav.path)
                    ? "menu-item-active font-semibold bg-white/10 text-white shadow-xs"
                    : "menu-item-inactive text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className={`flex-shrink-0 ${isActive(nav.path) ? "text-[#fed488]" : "text-white/80"}`}>
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text text-sm truncate">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={toggleMobileSidebar}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-screen flex flex-col px-4 bg-brand-500 border-r border-brand-600 text-white transition-all duration-300 ease-in-out z-50 shadow-2xl lg:shadow-none ${
          isExpanded || isMobileOpen
            ? "w-[270px]"
            : isHovered
            ? "w-[270px]"
            : "w-[90px]"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo Section */}
        <div
          className={`py-6 sm:py-8 flex items-center border-b border-white/10 mb-4 ${
            !isExpanded && !isHovered
              ? "lg:justify-center"
              : "justify-start gap-3"
          }`}
        >
          <Link 
            href="/admin" 
            onClick={() => { if (isMobileOpen) toggleMobileSidebar(); }}
            className="flex items-center gap-3 w-full"
          >
            <div className="bg-white rounded-xl p-2 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Image
                src="/images/logo/balc_logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>

            {(isExpanded || isHovered || isMobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-white tracking-wider truncate leading-tight">
                  ASSOCIATION OF BENGAL
                </span>
                <span className="text-[10px] font-medium text-white/70 tracking-wide truncate leading-tight mt-0.5">
                  FOR LITERATURE AND CULTURE
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Area */}
        <div className="flex flex-col overflow-y-auto flex-grow duration-300 ease-linear no-scrollbar pb-10">
          <nav className="mb-6">
            <h2
              className={`mb-3 text-[10px] font-bold tracking-wider uppercase flex leading-[20px] text-white/50 px-1 ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                "Main Menu"
              ) : (
                <HorizontaLDots />
              )}
            </h2>

            {renderMenuItems(navItems)}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
