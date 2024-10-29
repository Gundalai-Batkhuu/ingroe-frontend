import { useState } from "react";

export const IconWrapper = ({ children, tooltip }: { children: React.ReactNode; tooltip: string }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
        {isHovered && (
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap mb-1">
            {tooltip}
          </span>
        )}
      </div>
    );
  };