import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TabelTanggapan from '../components/Tables/TableTanggapan';

const TabelTanggapanPages = () => {
  return (
    <>
      <Breadcrumb pageName="Tabel Tanggapan" />

      <div className="flex flex-col gap-10">
        <TabelTanggapan />
      </div>
    </>
  );
};

export default TabelTanggapanPages;
