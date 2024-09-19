import * as XLSX from 'xlsx';
import { Petugas, Pengaduan, Tanggapan } from '../type';

interface ExportData {
  No: number;
  Nama: string;
  Alamat: string;
  NIK: string;
  Agama: string;
  Keperluan: string;
  'Telp/Email': string;
  Umur: number | string;
  Bukti: string;
  Status: string;
  'Tanggal Pengaduan': string;
  'Tanggal Tanggapan': string;
  Tanggapan: string;
  'Tindak Lanjut': string;
  Keterangan: string;
  'Nama Petugas': string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const exportToExcelTanggapan = (
  filteredData: Tanggapan[],
  pengaduanList: Pengaduan[],
  petugasList: Petugas[],
  indexOfFirstItem: number,
) => {
  const dataToExport: ExportData[] = filteredData.map((item, index) => {
    const pengaduan = pengaduanList.find(
      (p) => p.id_pengaduan === item.id_pengaduan,
    );
    const petugas = petugasList.find((p) => p.id_petugas === item.id_petugas);

    return {
      No: indexOfFirstItem + index + 1,
      Nama: pengaduan?.nama ?? 'Tidak ditemukan',
      Alamat: pengaduan?.alamat ?? 'Tidak ditemukan',
      NIK: pengaduan?.nik ?? 'Tidak ditemukan',
      Agama: pengaduan?.agama ?? 'Tidak ditemukan',
      Keperluan: pengaduan?.keperluan ?? 'Tidak ditemukan',
      'Telp/Email': pengaduan?.telp_email ?? 'Tidak ditemukan',
      Umur: pengaduan?.umur ?? 'Tidak ditemukan',
      Bukti: pengaduan?.bukti ?? 'Tidak ada',
      Status: pengaduan?.status ?? 'Tidak ditemukan',
      'Tanggal Pengaduan': pengaduan
        ? formatDate(pengaduan.createdAt)
        : 'Tidak ditemukan',
      'Tanggal Tanggapan': formatDate(item.tanggal),
      Tanggapan: item.tanggapan,
      'Tindak Lanjut': item.tindak_lanjut,
      Keterangan: item.keterangan,
      'Nama Petugas': petugas?.nama ?? 'Tidak ditemukan',
    };
  });

  const header = [
    'No',
    'Nama',
    'Alamat',
    'NIK',
    'Agama',
    'Keperluan',
    'Telp/Email',
    'Umur',
    'Bukti',
    'Status',
    'Tanggal Pengaduan',
    'Tanggal Tanggapan',
    'Tanggapan',
    'Tindak Lanjut',
    'Keterangan',
    'Nama Petugas',
  ];

  const ws = XLSX.utils.json_to_sheet(dataToExport, { header });

  // Styling the header
  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '4472C4' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  };

  // Apply style to header row
  const range = XLSX.utils.decode_range(ws['!ref'] as string);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!ws[address]) continue;
    ws[address].s = headerStyle;
  }

  // Auto-size columns
  const colWidths = dataToExport.reduce((acc, row) => {
    header.forEach((key, i) => {
      const cellValue = row[key as keyof ExportData]?.toString() ?? '';
      acc[i] = Math.max(acc[i] ?? 0, cellValue.length, key.length);
    });
    return acc;
  }, [] as number[]);

  ws['!cols'] = colWidths.map((width) => ({ width: Math.min(width + 2, 30) }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data Tanggapan');

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `data_tanggapan_${timestamp}.xlsx`;

  XLSX.writeFile(wb, filename);
};

export default exportToExcelTanggapan;
