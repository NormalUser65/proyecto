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
} from "lucide-react";

import { NotificationButton } from "../notificationButton";
import LanguageDropdown from "@/components/LanguageDropdown";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";

// 🔹 Importa el contexto de usuario
import useUser from "@/hooks/useUser";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation("header");

  // 🔹 Contexto de usuario
  const { user, isAuthenticated, clearUser } = useUser();

  const navItems = [
    { title: t("header.nav.tickets"), href: "/tickets" },
    { title: t("header.nav.asignaciones"), href: "/asignaciones" },
    { title: t("header.nav.categorias"), href: "/categorias" },
    { title: t("header.nav.tecnicos"), href: "/tecnicos" },
  ];

  // 🔹 Opciones dinámicas según autenticación
  const userItems = isAuthenticated
    ? [
        {
          title: t("header.user.cerrarSesion"),
          href: "#",
          icon: <LogOut className="h-4 w-4" />,
          action: clearUser,
        },
      ]
    : [
        {
          title: t("header.user.iniciarSesion"),
          href: "/user/login",
          icon: <LogIn className="h-4 w-4" />,
        },
        {
          title: t("header.user.registrarse"),
          href: "/user/create",
          icon: <UserPlus className="h-4 w-4" />,
        },
      ];

  return (
    <header
      className="w-[98%] mx-auto fixed top-2 left-0 right-0 z-50 bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-lg shadow-lg border border-white/20 rounded-full px-4 transition-all duration-300"
      role="banner"
    >
      <div className="flex items-center justify-between px-4 mx-auto text-white flex-wrap">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-wide hover:opacity-90 transition"
            aria-label="Inicio"
          >
            <div className="p-1 rounded-full shadow-sm">
              <img src={EduhelpLogo} alt="Logo EduHelp" className="h-15" />
            </div>
            <span className="hidden sm:inline">{t("header.brand")}</span>
          </Link>
        </div>

        {/* NAV DESKTOP */}
        <nav
          className="hidden md:flex items-center gap-4 flex-1 justify-center"
          aria-label="Navegación principal"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-2 py-2 px-4 rounded-full text-sm hover:bg-white/10 transition"
              aria-label={item.title}
            >
              {item.title}
            </Link>
          ))}

          {/* 🔹 Sección de mantenimientos */}
          <Menubar className="w-auto bg-transparent border-none shadow-none">
            <MenubarMenu>
              <MenubarTrigger className="flex items-center gap-2 py-2 px-4 rounded-full text-sm hover:bg-white/10 transition">
                <Layers className="h-4 w-4" /> {t("header.nav.mantenimientos")}
                <ChevronDown className="h-3 w-3" />
              </MenubarTrigger>

              <MenubarContent className="bg-white/10 backdrop-blur-lg border-none rounded-xl shadow-xl mt-2">
                <MenubarItem asChild>
                  <Link
                    to="/categorias/crear"
                    className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition"
                  >
                    {t("header.nav.crearCategoria")}
                  </Link>
                </MenubarItem>

                <MenubarItem asChild>
                  <Link
                    to="/tecnicos/crear"
                    className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition"
                  >
                    {t("header.nav.crearTecnico")}
                  </Link>
                </MenubarItem>

                <MenubarItem asChild>
                  <Link
                    to="/tickets/crear"
                    className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition"
                  >
                    {t("header.nav.crearTicket")}
                  </Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </nav>

        {/* ICONOS DERECHA */}
        <div className="flex items-center gap-2">
          <LanguageDropdown />
          <NotificationButton />

          {/* Usuario Desktop */}
          <div className="hidden md:flex">
            <Menubar className="w-auto bg-transparent border-none shadow-none">
              <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-2 font-medium text-white hover:bg-white/15 px-4 py-2 rounded-full transition">
                  <User className="h-4 w-4" />{" "}
                  {isAuthenticated ? user?.email : t("header.user.guest")}
                  <ChevronDown className="h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-180" />
                </MenubarTrigger>

                <MenubarContent className="bg-white/10 backdrop-blur-lg border-none rounded-xl shadow-xl mt-2">
                  {userItems.map((item) => (
                    <MenubarItem key={item.title} asChild>
                      {item.action ? (
                        <button
                          onClick={item.action}
                          className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition w-full text-left"
                        >
                          {item.icon} {item.title}
                        </button>
                      ) : (
                        <Link
                          to={item.href}
                          className="flex items-center gap-2 py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition"
                        >
                          {item.icon} {item.title}
                        </Link>
                      )}
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
                {mobileOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="bg-gradient-to-b from-primary/90 to-secondary/90 text-white backdrop-blur-lg border-none"
            >
              <nav
                className="mt-10 space-y-6 px-4"
                aria-label="Navegación móvil"
              >
                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    {t("header.mobile.opciones")}
                  </h4>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition"
                    >
                      {item.title}
                    </Link>
                  ))}

                  {/* 🔹 Mantenimientos en móvil */}
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Layers className="h-4 w-4" />{" "}
                      {t("header.nav.mantenimientos")}
                    </h4>
                    <Link
                      to="/categorias/crear"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition"
                    >
                      {t("header.nav.crearCategoria")}
                    </Link>
                    <Link
                      to="/tecnicos/crear"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition"
                    >
                      {t("header.nav.crearTecnico")}
                    </Link>
                    <Link
                      to="/tickets/crear"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition"
                    >
                      {t("header.nav.crearTicket")}
                    </Link>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <User />{" "}
                    {isAuthenticated ? user?.email : t("header.user.guest")}
                  </h4>
                  {userItems.map((item) =>
                    item.action ? (
                      <button
                        key={item.title}
                        onClick={() => {
                          item.action();
                          setMobileOpen(false);
                        }}
                        className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition w-full text-left"
                      >
                        {item.icon} {item.title}
                      </button>
                    ) : (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition"
                      >
                        {item.icon} {item.title}
                      </Link>
                    )
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}