import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 mt-10 py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} <span className="font-semibold">Evidenca</span>. Sva prava zadržana.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Napravljeno sa pažnjom za jednostavno upravljanje evidencijama.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Za podršku, pišite na{" "}
          <a href="mailto:support@evidenca.com" className="text-blue-600 hover:underline">
            support@evidenca.com
          </a>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
