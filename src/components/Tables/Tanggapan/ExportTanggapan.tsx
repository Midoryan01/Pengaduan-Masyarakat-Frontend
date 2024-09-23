import * as XLSX from 'xlsx';
import { Petugas, Pengaduan, Tanggapan } from '../../../types/type';

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

  // Define default cell style
  const defaultStyle = {
    alignment: { vertical: 'center', wrapText: true },
  };

  // Apply styles to all cells and set column widths
  const range = XLSX.utils.decode_range(ws['!ref'] as string);
  const colWidths = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 10; // Default minimum width
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;
      
      // Apply style
      if (R === 0) {
        ws[cellAddress].s = headerStyle;
      } else {
        ws[cellAddress].s = defaultStyle;
      }
      
      // Calculate max width
      const cellValue = ws[cellAddress].v;
      if (typeof cellValue === 'string') {
        maxWidth = Math.max(maxWidth, cellValue.length);
      }
    }
    colWidths.push({ wch: Math.min(maxWidth + 2, 50) }); // Cap at 50
  }
  ws['!cols'] = colWidths;

  // Set row heights
  const rowHeights = Array(range.e.r - range.s.r + 1).fill({ hpx: 65 });
  rowHeights[0] = { hpx: 25 }; // Set header row height to 25
  ws['!rows'] = rowHeights;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data Tanggapan');

  // Set print area
  ws['!printHeader'] = ['A1:P1']; // Adjust if your columns are different

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `data_tanggapan_${timestamp}.xlsx`;

  XLSX.writeFile(wb, filename);
};

export default exportToExcelTanggapan;