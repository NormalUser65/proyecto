import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
    .use(HttpBackend)
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
    fallbackLng: "es",
    debug: false,
    interpolation: {
        escapeValue: false
    },
    backend: {
        loadPath: "/Traducciones/{{lng}}/{{ns}}.json"
    },
    ns:[
        "crearTecnico",
        "actualizarTecnico",
        "listaCartTecnico",
        "header",
        "home",
        "customMultiSelect",
        "detalleTicket",
        "listaCartTicket",
        "crearCategoria",
        "customSelect",
        "listaCartCategoria",
        "actualizarCategoria",
        "detalleCategoria",
        "detalleAsignacion",
        "VistaSemanalAsignaciones"
    ]
    });


export default i18n;