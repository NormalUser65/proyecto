"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Ticket,
  Layers,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Menu,
  X,
  ChevronDown,
  Clapperboard,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

const userData = { email: "demo@correo.com" };
const ticketCount = 3; // reemplaza con el contador real desde tu estado/prop

const navItems = [
  { title: "Tickets", href: "/tickets", icon: <Ticket className="h-4 w-4" /> },
  { title: "Catálogo", href: "/catalog", icon: <Layers className="h-4 w-4" /> },
];

const userItems = [
  { title: "Iniciar Sesión", href: "/user/login", icon: <LogIn className="h-4 w-4" /> },
  { title: "Registrarse", href: "/user/create", icon: <UserPlus className="h-4 w-4" /> },
  { title: "Cerrar Sesión", href: "/user/logout", icon: <LogOut className="h-4 w-4" /> },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ajusta esta clase para mover la navegación más/menos a la derecha.
  // Ejemplos: "translate-x-16" (más a la derecha), "translate-x-8" (ligeramente) o "translate-x-0" (centrado exacto)
  const SHIFT_CLASS = "translate-x-16";

  return (
    <header
      className="w-[95%] mx-auto fixed top-2 left-0 right-0 z-50 bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-lg shadow-lg border border-white/20 rounded-full px-4 transition-all duration-300"
      role="banner"
    >
      <div className="relative flex items-center px-6 py-4 max-w-7xl mx-auto text-white">
        {/* Logo izquierda */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-wide hover:opacity-90 transition"
            aria-label="Inicio"
          >
            <div className="bg-white/20 p-2 rounded-full shadow-sm">
              <Clapperboard className="h-6 w-6 text-white" />
            </div>
            <span className="hidden sm:inline">MovieSphere</span>
          </Link>
        </div>

        {/* Navegación central (posicionada absolutamente en el centro, luego desplazada a la derecha) */}
        <nav
          className={`hidden md:flex items-center gap-2 absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 ${SHIFT_CLASS}`}
          aria-label="Navegación principal"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-2 py-2 px-4 rounded-full text-sm hover:bg-white/10 transition"
              aria-label={item.title}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.title}</span>
            </Link>
          ))}
        </nav>

        {/* Bloque derecho: Tickets + usuario */}
        <div className="ml-auto flex items-center gap-4">
          {/* Icono Tickets con contador */}
          <Link to="/tickets" className="relative hover:opacity-90" aria-label="Tickets">
            <div className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <Badge
              className="absolute -top-2 -right-2 rounded-full px-2 py-0 text-xs font-semibold"
              variant="secondary"
              aria-hidden="true"
            >
              {ticketCount}
            </Badge>
          </Link>

          {/* Menú de usuario */}
          <div className="hidden md:flex">
            <Menubar className="w-auto bg-transparent border-none shadow-none">
              <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-2 font-medium text-white hover:bg-white/15 px-4 py-2 rounded-full transition">
                  <User className="h-4 w-4" /> {userData.email}
                  <ChevronDown className="h-3 w-3" />
                </MenubarTrigger>
                <MenubarContent className="bg-white/10 backdrop-blur-lg border-none rounded-xl shadow-xl mt-2">
                  {userItems.map((item) => (
                    <MenubarItem key={item.href} asChild>
                      <Link
                        to={item.href}
                        className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition"
                        aria-label={item.title}
                      >
                        {item.icon} {item.title}
                      </Link>
                    </MenubarItem>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          {/* Botón menú móvil */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden inline-flex items-center justify-center p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-gradient-to-b from-primary/90 to-secondary/90 text-white backdrop-blur-lg border-none">
              <nav className="mt-10 space-y-6 px-4" aria-label="Navegación móvil">
                <Link to="/" className="flex items-center gap-2 text-xl font-semibold" onClick={() => setMobileOpen(false)}>
                  <Clapperboard /> MovieSphere
                </Link>

                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Ticket /> Tickets
                  </h4>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition"
                      aria-label={item.title}
                    >
                      {item.icon} {item.title}
                    </Link>
                  ))}
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <User /> {userData.email}
                  </h4>
                  {userItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition"
                      aria-label={item.title}
                    >
                      {item.icon} {item.title}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}