import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import ECommerce from './pages/Dashboard/ECommerce';
import DefaultLayout from './layout/DefaultLayout';
import FormPengaduan from './pages/Form/FormPengaduan';
import FormTanggapan from './pages/Form/FormTanggapan';
import TabelPengaduanPages from './pages/TabelPengaduan';
import TabelTanggapanPages from './pages/TabelTanggapan';
import AddTanggapan from './components/Tables/Tanggapan/AddTanggapanModal';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {/* Semua route yang menggunakan DefaultLayout */}
      <Route
        path="/"
        element={
          <DefaultLayout>
            <>
              <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ECommerce />
            </>
          </DefaultLayout>
        }
      />
      <Route
        path="/tabel-pengaduan"
        element={
          <DefaultLayout>
            <>
              <PageTitle title="Tabel Pengaduan" />
              <TabelPengaduanPages />
            </>
          </DefaultLayout>
        }
      />
      <Route
        path="/tabel-tanggapan"
        element={
          <DefaultLayout>
            <PageTitle title="Tabel Pengaduan" />
            <TabelTanggapanPages />
          </DefaultLayout>
        }
      />
      <Route
        path="/form-tanggapan"
        element={
          <DefaultLayout>
            <>
              <PageTitle title="Form Tanggapan" />
              <FormTanggapan />
            </>
          </DefaultLayout>
        }
      />
      <Route
        path="/add-tanggapan/:id_pengaduan"
        element={
          <DefaultLayout>
            <>
              <PageTitle title="add Tanggapan" />
              <AddTanggapan />
            </>
          </DefaultLayout>
        }
      />
      {/* Route yang hanya merender FormPengaduan tanpa DefaultLayout */}
      <Route
        path="/form-pengaduan"
        element={
          <>
            <PageTitle title="Form Pengaduan" />
            <FormPengaduan />
          </>
        }
      />
    </Routes>
  );
}

export default App;
