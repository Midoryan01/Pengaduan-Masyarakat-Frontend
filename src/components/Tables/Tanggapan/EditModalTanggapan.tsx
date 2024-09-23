import React from 'react';
import { Pengaduan, Tanggapan } from '../../../types/type';



interface EditTanggapanModalProps {
  isOpen: boolean;
  onClose: () => void;
  tanggapan: Tanggapan | null;
  pengaduanList: Pengaduan[];
  onSubmit: (editedTanggapan: Tanggapan) => void;
}

const EditTanggapanModal: React.FC<EditTanggapanModalProps> = ({
  isOpen,
  onClose,
  tanggapan,
  pengaduanList,
  onSubmit,
}) => {
  const [editedTanggapan, setEditedTanggapan] =
    React.useState<Tanggapan | null>(null);

  React.useEffect(() => {
    setEditedTanggapan(tanggapan);
  }, [tanggapan]);

  if (!isOpen || !editedTanggapan) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditedTanggapan((prev) => ({ ...prev!, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTanggapan) {
      onSubmit(editedTanggapan);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Tanggapan</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ID Pengaduan
            </label>
            <select
              name="id_pengaduan"
              value={editedTanggapan.id_pengaduan}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              disabled
            >
              {pengaduanList.map((pengaduan) => (
                <option
                  key={pengaduan.id_pengaduan}
                  value={pengaduan.id_pengaduan}
                >
                  {pengaduan.id_pengaduan} - {pengaduan.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tanggapan
            </label>
            <textarea
              name="tanggapan"
              value={editedTanggapan.tanggapan}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tindak Lanjut
            </label>
            <input
              type="text"
              name="tindak_lanjut"
              value={editedTanggapan.tindak_lanjut}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Keterangan
            </label>
            <textarea
              name="keterangan"
              value={editedTanggapan.keterangan}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTanggapanModal;
