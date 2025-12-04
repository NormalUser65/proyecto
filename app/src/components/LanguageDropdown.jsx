import { useState, useEffect, useRef } from "react";
import i18n from "i18next";
import Flag from "react-country-flag";

export default function LanguageDropdown() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        function handleClickOutside(e) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setOpen(false);
    };

    const currentFlag = i18n.language === "es" ? "CR" : "US";
    const currentLabel = i18n.language === "es" ? "Español" : "English";

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition text-sm font-medium">
            <Flag countryCode={currentFlag} svg className="mr-1" />
            {currentLabel}
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform ${
                open ? "rotate-180" : ""
            }`}viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
            </svg>
        </button>

        {open && (
            <div
            className="absolute right-0 mt-2 w-48 z-5 bg-white/10 backdrop-blur-xl shadow-xl rounded-xl border border-white/20 animate-in fade-in-0 zoom-in-95">
            <div className="py-1 text-sm text-white">
                <button onClick={() => changeLanguage("es")} className="flex items-center w-full px-4 py-2 gap-2 hover:bg-white/20 rounded-lg transition">
                <Flag countryCode="CR" svg className="mr-2" /> Español
                </button>

                <button onClick={() => changeLanguage("en")} className="flex items-center w-full px-4 py-2 gap-2 hover:bg-white/20 rounded-lg transition">
                <Flag countryCode="US" svg className="mr-2" />
                English
                </button>
            </div>
            </div>
        )}
        </div>
    );
}

