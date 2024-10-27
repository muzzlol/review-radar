import { FC } from "react";

export const Header: FC = () => {
  return (
    <header className="w-full py-6 bg-gradient-to-r from-teal-500 to-blue-500">
      <h1 className="text-center text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight font-['Kaushan_Script']">
        Review
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Radar
        </span>
      </h1>
    </header>
  );
};
