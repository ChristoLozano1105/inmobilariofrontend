import { BrowserRouter, Routes, Route } from 'react-router'; // o 'react-router-dom'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import { InmobilarioProvider } from './context/InmobilarioContext';
import { SolicitudProvider } from './context/SolicitudContext';
import InmobilariosPage from './pages/InmobilariosPage';
import InmobilarioFormPage from './pages/InmobilarioFormPage';
import AdminSolicitudesPage from './pages/AdminSolicitudesPage';
import MisSolicitudesPage from './pages/MisSolicitudesPage';
import Header from "./components/Header";
import CatalogPage from './pages/CatalogPage';
import InmuebleDetallePage from './pages/InmuebleDetallePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <InmobilarioProvider>
        <SolicitudProvider>
        <BrowserRouter>
        <Header />
          <Routes>
            {/* Público */}
            <Route path='/' element={<CatalogPage />} />
            <Route path='/mis-solicitudes' element={<MisSolicitudesPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

            <Route path='/inmueble/:id' element={<InmuebleDetallePage />} />

            {/* RUTAS PROTEGIDAS (usuario logueado) */}
            <Route element={<ProtectedRoute />}>
              <Route path='/profile' element={<h1>Profile Page</h1>} />
              

              {/* SOLO ADMIN */}
              <Route element={<AdminRoute />}>
              <Route path='/admin/solicitudes' element={<AdminSolicitudesPage />} />
                {/* CRUD inmuebles */}
                <Route path='/inmobilarios' element={<InmobilariosPage />} />
                <Route path='/add-inmobilario' element={<InmobilarioFormPage />} />
                <Route path='/inmobilario/:id' element={<InmobilarioFormPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        </SolicitudProvider>
      </InmobilarioProvider>
    </AuthProvider>
  );
}

export default App;
