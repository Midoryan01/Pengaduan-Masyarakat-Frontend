// types.ts
export interface Petugas {
  id_petugas: number;
  nama: string;
}

export interface Pengaduan {
  id_pengaduan: number;
  nama: string;
  nik: string;
  keperluan: string;
}

export interface FormData {
  id_pengaduan: string;
  id_petugas: string;
  tanggal: string;
  tanggapan: string;
  tindak_lanjut: string;
  keterangan: string;
}
