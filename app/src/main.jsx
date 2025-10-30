import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { RouterProvider } from 'react-router'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'

import { ListaTecnico } from './components/Tecnico/ListaTecnico'
import { ListaCategoria } from './components/Categoria/ListaCategoria'

import { ListaTicket } from './components/Ticket/ListaTicket';
import { VistaSemanalAsignaciones } from "./components/Asignacion/VistaSemanalAsignaciones";



//Crear las rutas
const rutas=createBrowserRouter([
  {
    element: <Layout/>, 
    children:[
      //Ruta por defecto localhost:5173
      {index:true, element:<Home/>},
      //Ruta comodín 404
      {path: '*', element: <PageNotFound/>},
      //Rutas componentes
      { path: "tecnicos", element: <ListaTecnico /> }, // lista de tecnicos
      { path: "categorias", element: <ListaCategoria /> },

      { path: "tickets", element: <ListaTicket /> },
      { path: "asignaciones", element: <VistaSemanalAsignaciones /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router= {rutas}/>
  </StrictMode>,
)
