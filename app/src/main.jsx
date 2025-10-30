import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { RouterProvider } from 'react-router'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'

import { ListaTecnico } from './components/Tecnico/ListaTecnico'
import { ListaCategoria } from './components/Categoria/ListaCategoria';
import { ListaTicket } from './components/Ticket/ListaTicket';
import { VistaSemanalAsignaciones } from "./components/Asignacion/VistaSemanalAsignaciones";
import { DetalleTecnico } from './components/Tecnico/detalleTecnico';

//Crear las rutas
const rutas = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: '*', element: <PageNotFound /> },

      // Rutas componentes
      { path: "tecnicos", element: <ListaTecnico /> },
      { path: "tecnicos/detalle/:id", element: <DetalleTecnico /> },
      { path: "categorias", element: <ListaCategoria /> },
      { path: "tickets", element: <ListaTicket /> },
      { path: "asignaciones", element: <VistaSemanalAsignaciones /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router= {rutas}/>
  </StrictMode>,
)
