import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pengaduan, Petugas, Tanggapan } from './type';

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
    keterangan: ''
  });

  useEffect(() => {
    // Fetch pengaduan details
    fetch(`http://localhost:5000/pengaduan/${id_pengaduan}`)
      .then(response => response.json())
      .then(data => setPengaduan(data))
      .catch(error => console.error('Error fetching pengaduan:', error));

    // Fetch petugas list
    fetch('http://localhost:5000/petugas')
      .then(response => response.json())
      .then(data => setPetugas(data))
      .catch(error => console.error('Error fetching petugas:', error));
  }, [id_pengaduan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTanggapan({ ...tanggapan, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:5000/tanggapan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tanggapan)
    })
      .then(response => response.json())
      .then(() => {
        alert('Tanggapan berhasil ditambahkan');
        navigate(-1); // Go back to previous page
      })
      .catch(error => console.error('Error adding tanggapan:', error));
  };

  if (!pengaduan) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Tanggapan</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Pengaduan Details:</h2>
        <p>Nama: {pengaduan.nama}</p>
        <p>Keperluan: {pengaduan.keperluan}</p>
        <p>Status: {pengaduan.status}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Petugas:</label>
          <select 
            name="id_petugas" 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded text-bold text-black-2"
          >
            <option value="">Select Petugas</option>
            {petugas.map(p => (
              <option key={p.id_petugas} value={p.id_petugas}>{p.nama}</option>
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
            className="w-full p-2 border rounded text-black-2"
          />
        </div>
        <div>
          <label className="block ">Tindak Lanjut:</label>
          <input 
            type="text" 
            name="tindak_lanjut" 
            value={tanggapan.tindak_lanjut} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded text-bold text-black-2"
          />
        </div>
        <div>
          <label className="block">Keterangan:</label>
          <input 
            type="text" 
            name="keterangan" 
            value={tanggapan.keterangan} 
            onChange={handleChange} 
            className="w-full p-2 border rounded text-black-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Tanggapan
        </button>
      </form>
    </div>
  );
};

export default AddTanggapan;