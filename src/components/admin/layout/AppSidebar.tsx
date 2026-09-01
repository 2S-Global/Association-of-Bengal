// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { useSidebar } from "@/context/admin/SidebarContext";
// import {
//   ChevronDownIcon,
//   GridIcon,
//   HorizontaLDots,
// } from "@/icons";
// import { UsersIcon } from "lucide-react";

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
//  {
//     icon: <MembersIcon />, // Now using your custom inline icon!
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
  
// ];
// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const pathname = usePathname();

//   const [openSubmenu, setOpenSubmenu] = useState<{
//     type: "main";
//     index: number;
//   } | null>(null);

//   const isActive = (path: string) => path === pathname;
//   const isSubmenuOpen = (index: number, subItems: NonNullable<NavItem["subItems"]>) =>
//     (openSubmenu?.type === "main" && openSubmenu.index === index) ||
//     subItems.some(({ path }) => pathname === path || pathname.startsWith(`${path}/`));

//   const handleSubmenuToggle = (
//     index: number,
//     menuType: "main"
//   ) => {
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
//                   isSubmenuOpen(index, nav.subItems)
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
//                     isSubmenuOpen(index, nav.subItems)
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
//                       isSubmenuOpen(index, nav.subItems)
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
//                     height: isSubmenuOpen(index, nav.subItems)
//                         ? "auto"
//                         : "0px",
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
// Removed lucide-react since you are using your custom MembersIcon now!

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
    {/* Main person body */}
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Main person head */}
    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
    {/* Second person body */}
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
    {/* Second person head */}
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
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);

  // 1. THIS FIXES THE INITIAL LOAD
  // Automatically opens the correct submenu based on current URL when page loads
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

  // 2. THIS FIXES THE CLICKING BUG
  // Now it solely relies on the state, allowing you to actually close it
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
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index, "main")}
                className={`menu-item group ${
                  isSubmenuOpen(index)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`${
                    isSubmenuOpen(index)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}

                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`menu-item-arrow ml-auto h-5 w-5 text-white transition-transform duration-200 ${
                      isSubmenuOpen(index)
                        ? "menu-item-arrow-active"
                        : "menu-item-arrow-inactive"
                    }`}
                  />
                )}
              </button>

              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height: isSubmenuOpen(index) ? "auto" : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}

                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}

                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
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
                className={`menu-item group ${
                  isActive(nav.path)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-brand-500 border-brand-600 text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-transparent ${
        isExpanded || isMobileOpen
          ? "w-[270px]"
          : isHovered
          ? "w-[270px]"
          : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex items-center ${
          !isExpanded && !isHovered
            ? "lg:justify-center"
            : "justify-start"
        }`}
      >
        <Link href="/admin">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
                <Image
                  src="/images/logo/balc_logo.png"
                  alt="Logo"
                  width={30}
                  height={30}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-tight">
                  ASSOCIATION OF BENGAL
                </span>
                <span className="text-xs font-semibold text-white/80 leading-tight">
                  FOR LITERATURE AND CULTURE
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
              <Image
                src="/images/logo/balc_logo.png"
                alt="Logo"
                width={30}
                height={30}
              />
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div>
            <h2
              className={`mb-4 text-xs uppercase flex leading-[20px] text-white/70 ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                "Menu"
              ) : (
                <HorizontaLDots />
              )}
            </h2>

            {renderMenuItems(navItems)}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;