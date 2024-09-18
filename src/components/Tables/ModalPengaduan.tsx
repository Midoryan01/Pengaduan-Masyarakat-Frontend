import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pengaduan } from './type'; // Import the Pengaduan type
interface ModalPengaduanProps {
  isOpen: boolean;
  onClose: () => void;
  pengaduan: Pengaduan | null; // Pengaduan type or null
}

const ModalPengaduan: React.FC<ModalPengaduanProps> = ({ isOpen, onClose, pengaduan }) => {
  const navigate = useNavigate();

  if (!isOpen || !pengaduan) return null;

  const handleTanggapan = () => {
    navigate(`/add-tanggapan/${pengaduan.id_pengaduan}`);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-boxdark px-5 pt-6 pb-2.5 shadow-default rounded-lg w-1/2 border-2 border-dark dark:border-white">
        <h2 className="text-2xl font-bold mb- text-black dark:text-white">Detail Pengaduan</h2>
        
        <div className="grid grid-cols-2 gap-y-4 text-lg"> {/* Menggunakan grid untuk merapikan teks */}
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
          <p className="text-black dark:text-white">: {pengaduan.bukti ? pengaduan.bukti : 'Tidak ada bukti'}</p>
          
          <p className="text-black dark:text-white"><strong>Tanggal Dibuat</strong></p>
          <p className="text-black dark:text-white">: {new Date(pengaduan.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex justify-end mt-6 space-x-4">
          <button 
            onClick={handleTanggapan}
            className="bg-blue-500 text-white px-6 py-3 rounded dark:bg-blue-700"
          >
            Tanggapan
          </button>
          <button 
            onClick={onClose} 
            className="bg-red-500 text-white px-6 py-3 rounded dark:bg-red-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPengaduan;