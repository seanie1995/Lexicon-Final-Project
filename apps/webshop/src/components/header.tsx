import React from "react";

const header = () => {
  return (
    <nav className="fixed top-0 w-full z-50 rounded-none bg-[#fff9eb]/85 backdrop-blur-md">
      <div className="flex justify-between items-center w-full px-8 py-6 max-w-screen-2xl mx-auto">
        <div className="text-2xl font-serif italic text-[#4f1819]">
          The Digital Archivist
        </div>
        <div className="hidden md:flex gap-10 font-headline serif tracking-tight">
          <a
            className="text-[#4f1819] font-bold border-b border-[#4f1819] pb-1 hover:text-[#4f1819] transition-colors duration-300"
            href="#"
          >
            Catalog
          </a>
          <a
            className="text-[#725a42] font-medium hover:text-[#4f1819] transition-colors duration-300"
            href="#"
          >
            Rarities
          </a>
          <a
            className="text-[#725a42] font-medium hover:text-[#4f1819] transition-colors duration-300"
            href="#"
          >
            Chronology
          </a>
          <a
            className="text-[#725a42] font-medium hover:text-[#4f1819] transition-colors duration-300"
            href="#"
          >
            Curations
          </a>
        </div>
        <div className="flex items-center gap-6 text-[#4f1819]">
          <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2">
            <span
              className="material-symbols-outlined text-sm mr-2"
              data-icon="search"
            >
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm font-label italic placeholder:text-outline/50 w-48"
              placeholder="Search the archives..."
              type="text"
            />
          </div>
          <span
            className="material-symbols-outlined cursor-pointer"
            data-icon="account_circle"
          >
            account_circle
          </span>
          <span
            className="material-symbols-outlined cursor-pointer"
            data-icon="shopping_bag"
          >
            shopping_bag
          </span>
        </div>
      </div>
    </nav>
  );
};

export default header;
