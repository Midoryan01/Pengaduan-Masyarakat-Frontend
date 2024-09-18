import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Petugas, Pengaduan, FormData } from './type';
import DatePickerTwo from '../../components/Forms/DatePicker/DatePickerTwo';

const FormTanggapan: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    id_pengaduan: '',
    id_petugas: '',
    tanggal: '',
    tanggapan: '',
    tindak_lanjut: '',
    keterangan: '',
  });

  const [petugasList, setPetugasList] = useState<Petugas[]>([]);
  const [pengaduanList, setPengaduanList] = useState<Pengaduan[]>([]);

  // Fetch data petugas dan pengaduan menggunakan Promise.all
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petugasResponse, pengaduanResponse] = await Promise.all([
          axios.get<Petugas[]>('http://localhost:5000/petugas'),
          axios.get<Pengaduan[]>('http://localhost:5000/pengaduan'),
        ]);
        setPetugasList(petugasResponse.data);
        setPengaduanList(pengaduanResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle perubahan input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle perubahan tanggal di DatePicker
  const handleDateChange = (date: string) => {
    setFormData((prevState) => ({
      ...prevState,
      tanggal: date,
    }));
  };

  // Validasi form sebelum submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.id_pengaduan || !formData.id_petugas || !formData.tanggal || !formData.tanggapan || !formData.tindak_lanjut) {
      alert('Semua field yang diperlukan harus diisi!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/tanggapan', formData);
      if (response.status === 200) {
        alert('Tanggapan berhasil dikirim!');
        setFormData({
          id_pengaduan: '',
          id_petugas: '',
          tanggal: '',
          tanggapan: '',
          tindak_lanjut: '',
          keterangan: '',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat mengirim data');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Dropdown untuk id_pengaduan */}
      <div className="mb-4.5">
        <label className="mb-2.5 block text-black dark:text-white">
          Pengaduan <span className="text-meta-1">*</span>
        </label>
        <select
          name="id_pengaduan"
          value={formData.id_pengaduan}
          onChange={handleChange}
          required
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        >
          <option value="">Pilih Pengaduan</option>
          {pengaduanList.map((pengaduan) => (
            <option key={pengaduan.id_pengaduan} value={pengaduan.id_pengaduan}>
              {pengaduan.nama} - {pengaduan.nik} - {pengaduan.keperluan}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown untuk id_petugas */}
      <div className="mb-4.5">
        <label className="mb-2.5 block text-black dark:text-white">
          Petugas <span className="text-meta-1">*</span>
        </label>
        <select
          name="id_petugas"
          value={formData.id_petugas}
          onChange={handleChange}
          required
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        >
          <option value="">Pilih Petugas</option>
          {petugasList.map((petugas) => (
            <option key={petugas.id_petugas} value={petugas.id_petugas}>
              {petugas.nama}
            </option>
          ))}
        </select>
      </div>

      {/* Field Tanggal menggunakan DatePicker */}
      <DatePickerTwo selectedDate={formData.tanggal} onDateChange={handleDateChange} />

      {/* Field Tanggapan */}
      <div className="mb-4.5">
        <label className="mb-2.5 block text-black dark:text-white">
          Tanggapan <span className="text-meta-1">*</span>
        </label>
        <input
          type="text"
          name="tanggapan"
          value={formData.tanggapan}
          onChange={handleChange}
          required
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        />
      </div>

      {/* Field Tindak Lanjut */}
      <div className="mb-4.5">
        <label className="mb-2.5 block text-black dark:text-white">
          Tindak Lanjut <span className="text-meta-1">*</span>
        </label>
        <input
          type="text"
          name="tindak_lanjut"
          value={formData.tindak_lanjut}
          onChange={handleChange}
          required
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        />
      </div>

      {/* Field Keterangan */}
      <div className="mb-4.5">
        <label className="mb-2.5 block text-black dark:text-white">
          Keterangan
        </label>
        <textarea
          name="keterangan"
          value={formData.keterangan}
          onChange={handleChange}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        />
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        className="inline-flex w-full justify-center rounded bg-primary py-3 px-5 text-base font-medium text-white transition hover:bg-primary-dark focus:outline-none"
      >
        Kirim
      </button>
    </form>
  );
};

export default FormTanggapan;
