import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";

// Layout
import { Layout } from "./components/Layout/Layout";

// Páginas principales
import { Home } from "./components/Home/Home";
import { PageNotFound } from "./components/Home/PageNotFound";

// Models de técnicos
import { ListaTecnico } from "./components/Tecnico/ListaTecnico";
import { DetalleTecnico } from "./components/Tecnico/detalleTecnico";
import { ActualizarTecnico } from "./components/Tecnico/ActualizarTecnico";
import { CrearTecnico } from "./components/Tecnico/CrearTecnico";

// Models de categorías
import { ListaCategoria } from "./components/Categoria/ListaCategoria";
import { DetalleCategoria } from "./components/Categoria/DetalleCategoria";
import { CrearCategoria } from "./components/Categoria/CrearCategoria";
import { ActualizarCategoria } from "./components/Categoria/ActualizarCategoria";

// Models de tickets
import { ListaTicket } from "./components/Ticket/ListaTicket";
import { DetalleTicket } from "./components/Ticket/DetalleTicket";
import { CrearTicket } from "./components/Ticket/CrearTicket";
import { CambioEstado } from "./components/Ticket/CambioEstado";
import { HistorialTicket } from "./components/Ticket/HistorialTicket";

// Models de asignaciones
import { VistaSemanalAsignaciones } from "./components/Asignacion/VistaSemanalAsignaciones";
import { DetalleAsignacion } from "./components/Asignacion/DetalleAsignacion";
import { GestionAsignacion } from "./components/Asignacion/GestionAsignacion";
import { AsignacionManual } from "./components/Asignacion/AsignacionManual";
import { AsignacionAutomatica } from "./components/Asignacion/AsignacionAutomatica";

import { Login } from "./components/Usuario/Login";
import { Register } from "./components/Usuario/Register";

import "./i18n/i18n";

// Contextos globales (UserProvider y CartProvider)
import UserProvider from "./Context/UserProvider";
import CartProvider from "./Context/CartProvider";
import RoleRoute from "./components/Auth/RoleRoute";

// Definición de rutas
const rutas = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "*", element: <PageNotFound /> },

      // Rutas de usuario
      { path: "user/login", element: <Login /> },
      { path: "user/create", element: <Register /> },

      // Rutas Técnicos
      { path: "tecnicos", element: (<RoleRoute requiredRoles={["Administrador"]}><ListaTecnico /></RoleRoute>),},
      { path: "tecnicos/detalle/:id", element: (<RoleRoute requiredRoles={["Administrador"]}><DetalleTecnico /></RoleRoute>),},
      { path: "tecnicos/editar/:id", element: (<RoleRoute requiredRoles={["Administrador"]}><ActualizarTecnico /></RoleRoute>),},
      { path: "tecnicos/crear", element: (<RoleRoute requiredRoles={["Administrador"]}><CrearTecnico /></RoleRoute>),},

      // Rutas Categorías
      { path: "categorias", element: (<RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}><ListaCategoria /></RoleRoute>),},
      { path: "categorias/detalle/:id", element: (<RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}><DetalleCategoria /></RoleRoute>),},
      { path: "categorias/crear", element: (<RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}><CrearCategoria /></RoleRoute>),},
      { path: "categorias/editar/:id", element: (<RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}><ActualizarCategoria /></RoleRoute>),},

      // Rutas Tickets
      { path: "tickets", element: (<RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}><ListaTicket /></RoleRoute>),},
      { path: "tickets/detalleTicket/:id", element: (<RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}><DetalleTicket /></RoleRoute>),},
      { path: "tickets/crear", element: (<RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}><CrearTicket /></RoleRoute>),},
      { path: "tickets/cambiarEstado/:id",element: (<RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}><CambioEstado /></RoleRoute>),},
      {path: "tickets/historial/:id",element: (<RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}><HistorialTicket /></RoleRoute>),},

      // Rutas Asignaciones
      { path: "asignaciones", element: (<RoleRoute requiredRoles={["Administrador", "Técnico"]}><VistaSemanalAsignaciones /></RoleRoute>),},
      { path: "asignaciones/detalle/:id",element: (<RoleRoute requiredRoles={["Administrador", "Técnico"]}><DetalleAsignacion /></RoleRoute>),},
      { path: "asignaciones/gestion", element: (<RoleRoute requiredRoles={["Administrador"]}><GestionAsignacion /></RoleRoute>),},
      { path: "asignaciones/manual", element: (<RoleRoute requiredRoles={["Administrador"]}><AsignacionManual /></RoleRoute>),},
      { path: "asignaciones/auto", element: (<RoleRoute requiredRoles={["Administrador"]}><AsignacionAutomatica /></RoleRoute>),},
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <CartProvider>
        <RouterProvider router={rutas} />
      </CartProvider>
    </UserProvider>
  </StrictMode>
);
