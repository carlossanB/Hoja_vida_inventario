import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ListaEquipos from './pages/ListaEquipos';
import DetalleEquipo from './pages/DetalleEquipo';
import NuevoEquipo from './pages/NuevoEquipo';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ListaEquipos />} />
          <Route path="/equipos/nuevo" element={<NuevoEquipo />} />
          <Route path="/equipos/:id" element={<DetalleEquipo />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;