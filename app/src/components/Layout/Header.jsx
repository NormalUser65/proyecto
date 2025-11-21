"use client";

import EduhelpLogo from "../../assets/EduhelpLogo.png";
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
const ticketCount = 0;

const navItems = [
  { title: "Tickets", href: "/tickets" },
  { title: "Asignaciones", href: "/asignaciones" },
  { title: "Categorias", href: "/categorias" },
  { title: "Tecnicos", href: "/tecnicos" },
];

const userItems = [
  { title: "Iniciar Sesión", href: "/user/login", icon: <LogIn className="h-4 w-4" /> },
  { title: "Registrarse", href: "/user/create", icon: <UserPlus className="h-4 w-4" /> },
  { title: "Cerrar Sesión", href: "/user/logout", icon: <LogOut className="h-4 w-4" /> },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="w-[98%] mx-auto fixed top-2 left-0 right-0 z-50 bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-lg shadow-lg border border-white/20 rounded-full px-4 transition-all duration-300"
      role="banner"
    >
      <div className="relative flex px-4 mx-auto text-white">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-wide hover:opacity-90 transition"
            aria-label="Inicio"
          >
            <div className="p-1 rounded-full shadow-sm">
              <img src={EduhelpLogo} alt="Logo EduHelp" className="h-15" />
            </div>
            <span className="hidden sm:inline">Eduhelp</span>
          </Link>
        </div>

        {/* NAV DESKTOP */}
        <nav
          className="hidden md:flex items-center gap-2 absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2"
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

          <Menubar className="w-auto bg-transparent border-none shadow-none">
            <MenubarMenu>
              <MenubarTrigger className="flex items-center gap-2 py-2 px-4 rounded-full text-sm hover:bg-white/10 transition">
                <Layers className="h-4 w-4" /> Mantenimientos
                <ChevronDown className="h-3 w-3" />
              </MenubarTrigger>

              <MenubarContent className="bg-white/10 backdrop-blur-lg border-none rounded-xl shadow-xl mt-2">
                <MenubarItem asChild>
                  <Link
                    to="/categorias/crear"
                    className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition"
                  >
                    Crear una Categoría
                  </Link>
                </MenubarItem>

                <MenubarItem asChild>
                  <Link
                    to="/tecnicos/crear"
                    className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition"
                  >
                    Crear un Técnico
                  </Link>
                </MenubarItem>

                <MenubarItem asChild>
                  <Link
                    to="/tickets/crear"
                    className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition"
                  >
                    Crear Ticket
                  </Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          
        </nav>

        {/* Íconos derecha */}
        <div className="ml-auto flex items-center gap-2">
          <Link to="/tickets" className="relative hover:opacity-90" aria-label="Tickets">
            <div className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <Badge className="absolute -top-2 -right-2 rounded-full px-2 py-0 text-xs font-semibold" variant="secondary">
              {ticketCount}
            </Badge>
          </Link>

          {/* Usuario Desktop */}
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

          {/* MENU Celular */}
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
                <Link
                  to="/"
                  className="flex items-center gap-2 text-xl font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  
                </Link>

                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">Opciones</h4>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition"
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
