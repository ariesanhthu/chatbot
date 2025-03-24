import React from "react";

export const Avatar = ({ name }: { name: string }) => {
  return (
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold cursor-pointer">
      {name.charAt(0).toUpperCase()}
    </div>
  );
};
