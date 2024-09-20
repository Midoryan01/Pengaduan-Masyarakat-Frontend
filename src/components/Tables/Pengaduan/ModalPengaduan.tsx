import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Pengaduan } from '../../../types/type';

interface ModalPengaduanProps {
  isOpen: boolean;
  onClose: () => void;
  pengaduan: Pengaduan | null;
}

const ModalPengaduan: React.FC<ModalPengaduanProps> = ({
  isOpen,
  onClose,
  pengaduan,
}) => {
  const navigate = useNavigate();
  const [tanggapanExists, setTanggapanExists] = useState(false);

  useEffect(() => {
    const checkTanggapan = async () => {
      if (pengaduan) {
        try {
          const response = await fetch(`http://localhost:5000/tanggapan/check/${pengaduan.id_pengaduan}`);
          const data = await response.json();
          setTanggapanExists(data.exists);
        } catch (error) {
          console.error('Error checking tanggapan:', error);
        }
      }
    };

    if (isOpen && pengaduan) {
      checkTanggapan();
    }
  }, [isOpen, pengaduan]);

  if (!isOpen || !pengaduan) return null;

  const handleTanggapan = () => {
    if (tanggapanExists) {
      toast.error('Tanggapan untuk pengaduan ini sudah ada.');
    } else {
      navigate(`/add-tanggapan/${pengaduan.id_pengaduan}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <Toaster position="top-right" />
      <div className="bg-white dark:bg-boxdark rounded-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Detail Pengaduan
          </h2>
        </div>
        
        <div className="flex-grow overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-lg">
            <p className="text-black dark:text-white"><strong>Nama</strong></p>
            <p className="text-black dark:text-white">: {pengaduan.nama}</p>
            <p className="text-black dark:text-white"><strong>Alamat</strong></p>
            <p className="text-black dark:text-white">: {pengaduan.alamat}</p>
            <p className="text-black dark:text-white"><strong>NIK</strong></p>
            <p className="text-black dark:text-white">: {pengaduan.nik}</p>
            <p className="text-black dark:text-white"><strong>Agama</strong></p>
            <p className="text-black dark:text-white">: {pengaduan.agama}</p>
            <p className="text-black dark:text-white"><strong>Keperluan</strong></p>
            <p className="text-black dark:text-white">: {pengaduan.keperluan}</p>
            <p className="text-black dark:text-white"><strong>Telepon/Email</strong></p>
            <p className="text-black dark:text-white">: {pengaduan.telp_email}</p>
            <p className="text-black dark:text-white"><strong>Umur</strong></p>
            <p className="text-black dark:text-white">: {pengaduan.umur} tahun</p>
            <p className="text-black dark:text-white"><strong>Status</strong></p>
            <p className="text-black dark:text-white">: {pengaduan.status}</p>
            <p className="text-black dark:text-white"><strong>Bukti</strong></p>
            <p className="text-black dark:text-white">
              : {pengaduan.bukti ? pengaduan.bukti : 'Tidak ada bukti'}
            </p>
            <p className="text-black dark:text-white"><strong>Tanggal Dibuat</strong></p>
            <p className="text-black dark:text-white">
              : {new Date(pengaduan.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
          <button
            onClick={handleTanggapan}
            className={`${
              tanggapanExists
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white px-6 py-3 rounded transition duration-300 ease-in-out`}
          >
            {tanggapanExists ? 'Tanggapan Sudah Ada' : 'Tanggapan'}
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded transition duration-300 ease-in-out"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPengaduan;