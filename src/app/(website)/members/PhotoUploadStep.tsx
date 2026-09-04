// "use client";

// import React from "react";
// import { Upload } from "lucide-react";

// interface PhotoUploadStepProps {
//   photo: File | null;
//   onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onSkip: () => void;
//   error?: string;
// }

// export default function PhotoUploadStep({
//   photo,
//   onFileChange,
//   onSkip,
//   error,
// }: PhotoUploadStepProps) {
//   return (
//     <div className="space-y-6 animate-in fade-in duration-300 py-2 sm:py-4 text-center">
//       <div className="space-y-1 text-left">
//         <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
//           Upload Profile Photograph (Optional)
//         </h4>
//         <p className="text-[12px] sm:text-[13px] text-[#584141]">
//           Please upload a clear passport-size photograph for your verified digital ID card, or skip to complete it later.
//         </p>
//         {error && <p className="text-[11px] text-red-500">{error}</p>}
//       </div>

//       <div className="space-y-1">
//         <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#e0bfbf] hover:border-[#570013] rounded-2xl p-6 sm:p-10 bg-white/75 cursor-pointer transition-all group shadow-sm">
//           <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fbf2ed] flex items-center justify-center text-[#775a19] group-hover:scale-110 transition-transform mb-3 shadow-inner">
//             <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
//           </div>
//           <p className="text-[13px] sm:text-[14px] font-semibold text-[#570013] text-center px-2">
//             {photo ? photo.name : "Click to browse or drag photo here"}
//           </p>
//           <p className="text-[11px] text-[#8c7071] mt-1">SVG, PNG, JPG or WEBP (Max 5MB)</p>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={onFileChange}
//             className="hidden"
//           />
//         </label>
//       </div>

//       <div className="text-right">
//         <button
//           type="button"
//           onClick={onSkip}
//           className="text-[12px] font-semibold text-[#775a19] hover:underline"
//         >
//           Skip for now →
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, X, CheckCircle, Image as ImageIcon } from "lucide-react";

interface PhotoUploadStepProps {
  photo: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkip: () => void;
  error?: string;
}

export default function PhotoUploadStep({
  photo,
  onFileChange,
  onSkip,
  error,
}: PhotoUploadStepProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generate a preview URL whenever the photo file changes
  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(photo);
    setPreviewUrl(objectUrl);

    // Clean up memory on unmount or file change
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 py-2 sm:py-4">
      {/* Header Info */}
      <div className="space-y-1 text-left">
        <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
          Upload Profile Photograph
        </h4>
        <p className="text-[12px] sm:text-[13px] text-[#584141]">
          Please upload a clear, passport-size photograph for your verified digital ID card, or skip to complete it later.
        </p>
        {error && <p className="text-[11px] font-medium text-red-500 mt-1">{error}</p>}
      </div>

      {/* Upload Box / Preview Area */}
      <div className="space-y-2">
        {previewUrl ? (
          <div className="relative flex flex-col items-center justify-center border-2 border-solid border-[#570013]/30 rounded-2xl p-6 bg-white shadow-sm transition-all">
            {/* Remove / Change button */}
            <label
              htmlFor="photo-upload-input"
              className="absolute top-3 right-3 text-xs font-semibold bg-[#fbf2ed] text-[#570013] px-3 py-1.5 rounded-lg border border-[#e0bfbf] hover:bg-[#e0bfbf]/30 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            >
              Change Photo
            </label>

            {/* Circular Preview Container */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#fff8f5] shadow-md mb-3 ring-2 ring-[#570013]/20">
              <Image
                src={previewUrl}
                alt="Profile Preview"
                fill
                className="object-cover"
              />
            </div>

            {/* File info badge */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#570013] bg-[#fbf2ed] px-3 py-1 rounded-full border border-[#e0bfbf]/50">
              <CheckCircle className="w-3.5 h-3.5 text-[#1b5e20]" />
              <span className="truncate max-w-[200px]">{photo?.name}</span>
            </div>
            
            <p className="text-[11px] text-[#8c7071] mt-1">
              {(photo ? photo.size / (1024 * 1024) : 0).toFixed(2)} MB • Ready to upload
            </p>
          </div>
        ) : (
          <label
            htmlFor="photo-upload-input"
            className="flex flex-col items-center justify-center border-2 border-dashed border-[#e0bfbf] hover:border-[#570013] rounded-2xl p-6 sm:p-10 bg-white/75 cursor-pointer transition-all group shadow-sm"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fbf2ed] flex items-center justify-center text-[#775a19] group-hover:scale-110 transition-transform mb-3 shadow-inner">
              <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <p className="text-[13px] sm:text-[14px] font-semibold text-[#570013] text-center px-2">
              Click to browse or drag photo here
            </p>
            <p className="text-[11px] text-[#8c7071] mt-1">SVG, PNG, JPG or WEBP (Max 5MB)</p>
          </label>
        )}

        {/* Hidden File Input shared by both states */}
        <input
          id="photo-upload-input"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {/* Skip Button */}
      <div className="text-right pt-1">
        <button
          type="button"
          onClick={onSkip}
          className="text-[12px] font-semibold text-[#775a19] hover:underline cursor-pointer"
        >
          Skip for now →
        </button>
      </div>
    </div>
  );
}