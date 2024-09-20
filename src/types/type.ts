export interface Petugas {
  id_petugas: number;
  nama: string;
}

export interface Pengaduan {
  id_pengaduan: number;
  nama: string;
  alamat: string;
  nik: string;
  agama: string;
  keperluan: string;
  telp_email: string;
  umur: number;
  bukti: string | null;
  status: 'Proses' | 'Selesai';
  createdAt: string;
}

export interface Tanggapan {
  id_tanggapan: number;
  id_pengaduan: number;
  id_petugas: number;
  tanggal: string;
  tanggapan: string;
  tindak_lanjut: string;
  keterangan: string;
}

export interface FormData {
  id_pengaduan: string;
  id_petugas: string;
  tanggal: string;
  tanggapan: string;
  tindak_lanjut: string;
  keterangan: string;
}
