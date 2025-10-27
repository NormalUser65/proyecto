import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { RouterProvider } from 'react-router'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'

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
      //{ path: "tecnicos", element: <ListaTecnicos /> },// lista de tecnicos
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router= {rutas}/>
  </StrictMode>,
)
