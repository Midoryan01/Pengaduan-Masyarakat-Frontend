import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TabelPengaduan from '../components/Tables/TablePengaduan';

const TabelPengaduanPages = () => {
  return (
    <>
      <Breadcrumb pageName="Tabel Pengaduan" />

      <div className="flex flex-col gap-10">
        <TabelPengaduan />
      </div>
    </>
  );
};

export default TabelPengaduanPages;
