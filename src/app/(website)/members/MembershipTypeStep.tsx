
// "use client";

// import React from "react";
// import { Check } from "lucide-react";

// interface MembershipTypeStepProps {
//   wings: any[];
//   selectedCategories: string[];
//   onToggle: (name: string) => void;
//   error?: string;
// }

// export default function MembershipTypeStep({
//   wings,
//   selectedCategories,
//   onToggle,
//   error,
// }: MembershipTypeStepProps) {
//   return (
//     <div className="space-y-3 animate-in fade-in duration-300">
//       <div className="space-y-1">
//         <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
//           Choose Your Membership Type
//         </h4>
//         <p className="text-[12px] text-[#584141]">
//           You can select <span className="font-semibold text-[#775a19]">multiple types</span> that best describe your role.
//         </p>
//         {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
//       </div>

//       <div className="space-y-2.5 max-h-[280px] sm:max-h-[320px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#e0bfbf] [&::-webkit-scrollbar-thumb]:rounded-full pr-1.5">
//         {wings.map((wingItem) => {
//           const isSelected = selectedCategories.includes(wingItem.name);
//           const IconComp = wingItem.icon;
//           return (
//             <div
//               key={wingItem.id}
//               onClick={() => onToggle(wingItem.name)}
//               className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
//                 isSelected
//                   ? "border-[#570013] bg-[#fbf2ed] ring-1 ring-[#570013]/30"
//                   : "border-[#e0bfbf]/70 bg-white hover:border-[#775a19]/50"
//               }`}
//             >
//               <div className="flex items-center gap-3 min-w-0">
//                 <div
//                   className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
//                   style={{ backgroundColor: wingItem.bgColor, color: wingItem.color }}
//                 >
//                   <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
//                 </div>
//                 <div className="min-w-0">
//                   <h5 className="font-bold text-[#570013] text-[13px] sm:text-[14px] truncate">
//                     {wingItem.name}
//                   </h5>
//                   <p className="text-[11px] sm:text-[12px] font-medium text-[#775a19] truncate">
//                     {wingItem.nameBn}
//                   </p>
//                   <p className="text-[10px] sm:text-[11px] text-[#584141] opacity-90 truncate">
//                     {wingItem.description}
//                   </p>
//                 </div>
//               </div>
//               <div
//                 className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
//                   isSelected ? "bg-[#570013] border-[#570013] text-white" : "border-[#e0bfbf] bg-white"
//                 }`}
//               >
//                 {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


"use client";

import React from "react";
import { 
  Check, 
  BookOpen, 
  Edit3, 
  ShoppingBag, 
  PenTool, 
  Brush, 
  Layers, 
  Truck, 
  Palette, 
  User, 
  Search, 
  Printer, 
  BookMarked, 
  Sparkles, 
  MoreHorizontal 
} from "lucide-react";

interface MembershipTypeStepProps {
  wings: any[];
  selectedCategories: string[];
  onToggle: (name: string) => void;
  error?: string;
}

const getIconComponent = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case "book":
    case "menu_book":
    case "auto_stories":
      return BookOpen;
    case "edit_note":
    case "create":
    case "text_fields":
      return Edit3;
    case "storefront":
    case "badge":
      return ShoppingBag;
    case "pen":
      return PenTool;
    case "draw":
    case "brush":
      return Brush;
    case "design_services":
      return Layers;
    case "local_shipping":
      return Truck;
    case "palette":
      return Palette;
    case "spellcheck":
      return Search;
    case "print":
      return Printer;
    case "history_edu":
      return BookMarked;
    case "theater_comedy":
      return Sparkles;
    case "more_horiz":
      return MoreHorizontal;
    default:
      return User;
  }
};

export default function MembershipTypeStep({
  wings,
  selectedCategories,
  onToggle,
  error,
}: MembershipTypeStepProps) {
  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
          Choose Your Membership Type
        </h4>
        <p className="text-[12px] text-[#584141]">
          You can select <span className="font-semibold text-[#775a19]">multiple types</span> that best describe your role.
        </p>
        {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
      </div>

      <div className="space-y-2.5 max-h-[280px] sm:max-h-[320px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#e0bfbf] [&::-webkit-scrollbar-thumb]:rounded-full pr-1.5">
        {wings && wings.length > 0 ? (
          wings.map((wingItem) => {
            const isSelected = selectedCategories.includes(wingItem.name);
            const IconComp = getIconComponent(wingItem.icon);
            
            return (
              <div
                key={wingItem.id || wingItem._id}
                onClick={() => onToggle(wingItem.name)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                  isSelected
                    ? "border-[#570013] bg-[#fbf2ed] ring-1 ring-[#570013]/30"
                    : "border-[#e0bfbf]/70 bg-white hover:border-[#775a19]/50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: wingItem.bgColor || "#fbf2ed", color: wingItem.color || "#570013" }}
                  >
                    <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-[#570013] text-[13px] sm:text-[14px] truncate">
                        {wingItem.name}
                      </h5>
                      {wingItem.fees !== undefined && (
                        <span className="bg-[#775a19]/10 text-[#775a19] text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          ₹{wingItem.fees}
                        </span>
                      )}
                    </div>
                    {wingItem.nameBn && (
                      <p className="text-[11px] sm:text-[12px] font-medium text-[#775a19] truncate">
                        {wingItem.nameBn}
                      </p>
                    )}
                    {wingItem.description && (
                      <p className="text-[10px] sm:text-[11px] text-[#584141] opacity-90 truncate">
                        {wingItem.description}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                    isSelected ? "bg-[#570013] border-[#570013] text-white" : "border-[#e0bfbf] bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-xs text-[#584141] italic">
            Loading membership types...
          </div>
        )}
      </div>
    </div>
  );
}