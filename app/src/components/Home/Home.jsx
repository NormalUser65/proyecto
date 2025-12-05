import React from "react";
import LogoEduhelp from "../../assets/EduhelpLogo.png";
import FondoImg from "../../assets/Fondo.webp";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation("home");
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden text-white">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${FondoImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.6)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent -z-10" />
      <div className="relative max-w-5xl mx-auto px-8 md:px-16 flex flex-col gap-x-8 md:flex-row items-center justify-between">
        <div className="max-w-lg md:text-left text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            {t("home.titulo_p1")} <br />
            <span className="text-primary">{t("home.titulo_p2")}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            {t("home.descripcion_1")}
          </p>
          <p>{t("home.descripcion_2")}</p>

          <div className="flex justify-center md:justify-start gap-4 pt-2">
            <a
              href="/tickets/crear"
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow-lg hover:bg-primary/90 transition !rounded-2xl"
            >
              {t("home.boton_reporte")}
            </a>
            <a
              href="/user/login"
              className="px-6 py-3 bg-secondary text-white rounded-lg font-semibold shadow-lg hover:bg-secondary/90 transition !rounded-2xl"
            >
              {t("home.boton_login")}
            </a>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center justify-center text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-xl font-semibold mb-2 text-white">
            {t("home.panel_titulo")}
          </h2>
          <p className="text-sm text-gray-200 mb-4">
            {t("home.panel_descripcion")}
          </p>
          <img src={LogoEduhelp} alt={t("home.alt_imagen")} className="w-56 h-36 object-cover rounded-lg shadow-md"/>
        </div>
      </div>
    </div>
  );
}