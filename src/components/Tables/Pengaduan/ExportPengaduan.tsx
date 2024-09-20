import * as XLSX from 'xlsx';
import { Pengaduan } from '../../../types/type';

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
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const exportToExcelPengaduan = (
  filteredData: Pengaduan[],
  indexOfFirstItem: number,
) => {
  const dataToExport: ExportData[] = filteredData.map((pengaduan, index) => {
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

  // Adjust column widths and set default styles
  const colWidths = [
    { wch: 5 },  // No
    { wch: 20 }, // Nama
    { wch: 50 }, // Alamat (long text, wrap)
    { wch: 20 }, // NIK
    { wch: 10 }, // Agama
    { wch: 50 }, // Keperluan (long text, wrap)
    { wch: 20 }, // Telp/Email
    { wch: 10 }, // Umur
    { wch: 15 }, // Bukti
    { wch: 15 }, // Status
    { wch: 20 }, // Tanggal Pengaduan
  ];
  ws['!cols'] = colWidths;

  // Define default cell style
  const defaultStyle = {
    alignment: { vertical: 'center', horizontal: 'left', wrapText: false },
  };

  // Define wrap text style
  const wrapStyle = {
    alignment: { wrapText: true },
  };

  // Apply styles to all cells and wrap text for specific columns
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;

      // Apply default style to all cells
      ws[cellAddress].s = { ...defaultStyle };

      // Apply wrap style to Alamat and Keperluan columns
      if (C === 2 || C === 5) { // Alamat and Keperluan
        ws[cellAddress].s = { ...wrapStyle };
      }
    }
  }

  // Adjust row heights
  const rowHeights = Array(range.e.r - range.s.r + 1).fill({ hpx: 65 });
  rowHeights[0] = { hpx: 25 }; // Set header row height to 25
  ws['!rows'] = rowHeights;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data Tanggapan');

  // Set print area
  ws['!printHeader'] = ['A1:K1']; // Adjust if your columns are different

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `data_tanggapan_${timestamp}.xlsx`;

  XLSX.writeFile(wb, filename);
};

export default exportToExcelPengaduan;