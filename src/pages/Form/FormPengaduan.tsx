import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import ReligionDropdown from './Pengaduan/ReligionDropdown';

const FormPengaduan: React.FC = () => {

  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nik, setNik] = useState("");
  const [agama, setAgama] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [telpEmail, setTelpEmail] = useState("");
  const [umur, setUmur] = useState("");
  const [bukti, setBukti] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBukti(e.target.files ? e.target.files[0] : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nama || !alamat || !nik || !agama || !keperluan || !telpEmail || !umur) {
      toast.error('Semua field harus diisi!');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('nama', nama);
    formDataToSend.append('alamat', alamat);
    formDataToSend.append('nik', nik);
    formDataToSend.append('agama', agama);
    formDataToSend.append('keperluan', keperluan);
    formDataToSend.append('telp_email', telpEmail);
    formDataToSend.append('umur', umur);
    if (bukti) {
    formDataToSend.append('bukti', bukti);
    }

    try {
      const response = await axios.post('http://localhost:5000/pengaduan', formDataToSend);
      if (response.status === 201) {
        toast.success('Pengaduan berhasil dikirim!');
        // Reset form setelah berhasil
        setNama('');
        setAlamat('');
        setNik('');
        setAgama('');
        setKeperluan('');
        setTelpEmail('');
        setUmur('');
        setBukti(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data.message || error.message}`);
      } else {
        toast.error('Terjadi kesalahan yang tidak terduga');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5] dark:bg-gray-900 py-10">
      <div className="flex flex-col gap-9">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Form Pengaduan Masyarakat
          </h1>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Pengaduan Form
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              {/* Field Nama */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Nama <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukan Nama Anda"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Field Alamat */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Alamat <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="alamat"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Masukan Alamat Anda"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Field NIK */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  NIK <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="nik"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  maxLength={16}
                  placeholder="Masukan NIK Anda"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Field Umur */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Umur <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="umur"
                  value={umur}
                  onChange={(e) => setUmur(e.target.value)}
                  maxLength={3}
                  placeholder="Masukan umur Anda"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Field Telepon */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Telepon <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="telp_email"
                  value={telpEmail}
                  onChange={(e) => setTelpEmail(e.target.value)}
                  placeholder="Masukan Telepon Anda"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Field Keperluan */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Keperluan <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="keperluan"
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  placeholder="Masukan Keperluan Anda"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Field Agama */}
              <ReligionDropdown
                value={agama}
                onChange={(value) => setAgama(value)}
              />

              {/* Field Bukti */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Bukti (optional)
                </label>
                <input
                  type="file"
                  name="bukti"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded bg-primary py-3 text-center text-white transition hover:bg-opacity-90"
              >
                Kirim Pengaduan
              </button>
            </div>
          </form>
        </div>

        {/* Toast Notification Container */}
        <Toaster />
      </div>
    </div>
  );
};

export default FormPengaduan;
