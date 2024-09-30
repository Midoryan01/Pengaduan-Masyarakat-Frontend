import React, { forwardRef } from 'react';
import { Tanggapan, Pengaduan, Petugas } from '../../../types/type';
import logo from '../../../images/logo/logo-kemensos.png';

interface PrintTanggapanProps {
  tanggapan: Tanggapan;
  pengaduan?: Pengaduan;
  petugas?: Petugas;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatTime = (): string => {
  const date = new Date();
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const DetailItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-4">
    <p className="font-semibold">{label}</p>
    <p className="col-span-2">: {value ?? 'Tidak ditemukan'}</p>
  </div>
);

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <h2 className="font-semibold text-lg mb-4">{title}</h2>
    {children}
  </div>
);

const Header: React.FC = () => (
  <div className="text-center mb-6 border-b-2 pb-4">
    <div className="flex justify-center items-center mb-2">
      <img src={logo} alt="Logo" className="w-16 h-16 mr-4" />
      <div>
        <h1 className="text-lg font-bold">KEMENTERIAN SOSIAL REPUBLIK INDONESIA</h1>
        <h1 className="text-lg font-bold">DIREKTORAT JENDERAL REHABILITASI SOSIAL</h1>
        <h1 className="text-lg font-bold">SENTRA TERPADU "PANGUDI LUHUR" DI BEKASI</h1>
      </div>
    </div>
    <p className="text-sm">JL.H. Moelyadi Djojomartono No.10 Margahayu, Bekasi 17113 telp(021)8801888 https://pangudiluhur.kemensos.go.id</p>
  </div>
);

const PrintTanggapan = forwardRef<HTMLDivElement, PrintTanggapanProps>(
  ({ tanggapan, pengaduan, petugas }, ref) => {
    return (
      <div ref={ref} className="flex flex-col min-h-screen p-8 text-black">
        <div className="flex-grow">
          <Header />

          <h1 className="text-2xl font-bold text-center mb-6">SURAT TANGGAPAN PENGADUAN</h1>

          <div className="grid grid-cols-2 gap-12 mb-8">
            <DetailSection title="Detail Pengaduan">
              <DetailItem label="Nama" value={pengaduan?.nama} />
              <DetailItem label="Alamat" value={pengaduan?.alamat} />
              <DetailItem label="NIK" value={pengaduan?.nik} />
              <DetailItem label="Agama" value={pengaduan?.agama} />
              <DetailItem label="Keperluan" value={pengaduan?.keperluan} />
              <DetailItem label="Telp/Email" value={pengaduan?.telp_email} />
              <DetailItem label="Umur" value={pengaduan?.umur?.toString()} />
              <DetailItem label="Bukti" value={pengaduan?.bukti ?? 'Tidak ada'} />
              <DetailItem label="Status" value={pengaduan?.status} />
              <DetailItem label="Tanggal Pengaduan" value={pengaduan ? formatDate(pengaduan.createdAt) : undefined} />
            </DetailSection>

            <DetailSection title="Detail Tanggapan">
              <DetailItem label="Nama Petugas" value={petugas?.nama} />
              <DetailItem label="Tanggapan" value={tanggapan.tanggapan} />
              <DetailItem label="Tindak Lanjut" value={tanggapan.tindak_lanjut} />
              <DetailItem label="Keterangan" value={tanggapan.keterangan} />
              <DetailItem label="Tanggal Tanggapan" value={formatDate(tanggapan.tanggal)} />
            </DetailSection>
          </div>
        </div>

        <footer className="mt-auto text-center text-sm italic">
          <p>Dokumen ini dicetak oleh sistem pada {formatDate(new Date().toISOString())} pukul {formatTime()}</p>
        </footer>
      </div>
    );
  }
);

PrintTanggapan.displayName = 'PrintTanggapan';

export default PrintTanggapan;
export type { PrintTanggapanProps };