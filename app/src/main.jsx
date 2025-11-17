import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'

import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
import { ListaTecnico } from './components/Tecnico/ListaTecnico'
import { DetalleTecnico } from './components/Tecnico/detalleTecnico'
import { ListaCategoria } from './components/Categoria/ListaCategoria'
import { ListaTicket } from './components/Ticket/ListaTicket'
import { VistaSemanalAsignaciones } from "./components/Asignacion/VistaSemanalAsignaciones"
import { DetalleCategoria } from './components/Categoria/DetalleCategoria'
import { CrearCategoria } from './components/Categoria/CrearCategoria'
import { DetalleTicket } from './components/Ticket/DetalleTicket'
import { ActualizarTecnico } from './components/Tecnico/ActualizarTecnico'

const rutas = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: '*', element: <PageNotFound /> },
      //Rutas componentes
      { path: 'tecnicos', element: <ListaTecnico /> },
      { path: 'tecnicos/detalle/:id', element: <DetalleTecnico /> },
      { path: 'categorias', element: <ListaCategoria /> },
      { path: 'tickets', element: <ListaTicket /> },
      { path: 'tickets/detalleTicket/:id', element: <DetalleTicket/>},
      { path: 'asignaciones', element: <VistaSemanalAsignaciones /> },
      { path: 'categorias/detalle/:id', element: <DetalleCategoria /> },
      // editar tecnicos
      {
        path:"tecnicos/editar/:id",element:<ActualizarTecnico />
      },

      // Mantenimientos categorias
      {path: 'categorias/crear', element: <CrearCategoria/>},
      
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)
