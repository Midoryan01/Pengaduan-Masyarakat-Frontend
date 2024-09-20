import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Petugas, Pengaduan, Tanggapan } from '../../../types/type';

const AddTanggapan: React.FC = () => {
  const { id_pengaduan } = useParams<{ id_pengaduan: string }>();
  const navigate = useNavigate();
  const [pengaduan, setPengaduan] = useState<Pengaduan | null>(null);
  const [petugas, setPetugas] = useState<Petugas[]>([]);
  const [tanggapan, setTanggapan] = useState<Partial<Tanggapan>>({
    id_pengaduan: Number(id_pengaduan),
    tanggal: new Date().toISOString().split('T')[0],
    tanggapan: '',
    tindak_lanjut: '',
    keterangan: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [tanggapanExists, setTanggapanExists] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch pengaduan details
        const pengaduanResponse = await fetch(`http://localhost:5000/pengaduan/${id_pengaduan}`);
        const pengaduanData = await pengaduanResponse.json();
        setPengaduan(pengaduanData);

        // Fetch petugas list
        const petugasResponse = await fetch('http://localhost:5000/petugas');
        const petugasData = await petugasResponse.json();
        setPetugas(petugasData);

        // Check if tanggapan already exists
        const tanggapanResponse = await fetch(`http://localhost:5000/tanggapan/check/${id_pengaduan}`);
        const tanggapanData = await tanggapanResponse.json();
        setTanggapanExists(tanggapanData.exists);

        if (tanggapanData.exists) {
          toast.error('Tanggapan untuk pengaduan ini sudah ada.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Terjadi kesalahan saat mengambil data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id_pengaduan]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setTanggapan({ ...tanggapan, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tanggapanExists) {
      toast.error('Tanggapan untuk pengaduan ini sudah ada.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/tanggapan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tanggapan),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      toast.success('Tanggapan berhasil ditambahkan');
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error('Error adding tanggapan:', error);
      toast.error('Terjadi kesalahan saat menambahkan tanggapan.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!pengaduan) return <div>Pengaduan tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Add Tanggapan</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Pengaduan Details:</h2>
        <p>Nama: {pengaduan.nama}</p>
        <p>Keperluan: {pengaduan.keperluan}</p>
        <p>Status: {pengaduan.status}</p>
      </div>
      {tanggapanExists ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Perhatian!</p>
          <p>Tanggapan untuk pengaduan ini sudah ada. Anda tidak dapat menambahkan tanggapan baru.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Petugas:</label>
            <select
              name="id_petugas"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-black"
            >
              <option value="">Select Petugas</option>
              {petugas.map((p) => (
                <option key={p.id_petugas} value={p.id_petugas}>
                  {p.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Tanggapan:</label>
            <textarea
              name="tanggapan"
              value={tanggapan.tanggapan}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-black"
            />
          </div>
          <div>
            <label className="block">Tindak Lanjut:</label>
            <input
              type="text"
              name="tindak_lanjut"
              value={tanggapan.tindak_lanjut}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-black"
            />
          </div>
          <div>
            <label className="block">Keterangan:</label>
            <input
              type="text"
              name="keterangan"
              value={tanggapan.keterangan}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Submit Tanggapan
          </button>
        </form>
      )}
    </div>
  );
};

export default AddTanggapan;