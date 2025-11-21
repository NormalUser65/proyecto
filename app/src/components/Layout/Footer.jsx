import React from "react";
import EduhelpLogo from "../../assets/EduhelpLogo.png";

export function Footer() {
    return (
    <footer className="fixed bottom-0 w-full bg-secondary/95 text-white shadow-lg backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3 mb-3 md:mb-0">
            <img src={EduhelpLogo} alt="Logo EduHelp" className="h-12 w-auto rounded-md shadow-md"/>
            <span className="text-base font-semibold tracking-wide">EduHelp</span>
        </div>

        <div className="text-center text-sm md:text-base leading-tight">
            <div className="p-1">
                <p className="text-xs md:text-sm">Ana Fernández Alfaro y Fabricio Arias</p>
                <p className="text-xs md:text-sm">Universidad Tecnica Nacional</p> 
            </div>
        </div>
        <div className="text-right text-sm md:text-base mt-3 md:mt-0 opacity-90">
            <p className="font-medium">ISW-613</p>
            <p>{new Date().getFullYear()}</p>
        </div>
        </div>
    </footer>
    );
}
