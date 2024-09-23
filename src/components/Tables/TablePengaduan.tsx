import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  PrinterIcon,
} from '@heroicons/react/20/solid'; // Import icons
import { Pengaduan } from '../../types/type';
import ModalPengaduan from './Pengaduan/ModalPengaduan';
import exportToExcelPengaduan from './Pengaduan/ExportPengaduan';

const TabelPengaduan: React.FC = () => {
  const [pengaduanData, setPengaduanData] = useState<Pengaduan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPengaduan, setSelectedPengaduan] = useState<Pengaduan | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const fetchPengaduan = async () => {
      try {
        const response = await axios.get<Pengaduan[]>(
          'http://localhost:5000/pengaduan',
        );
        setPengaduanData(response.data);
      } catch (err) {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };
    fetchPengaduan();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset ke halaman 1 ketika mencari
  };

  const handleStatusFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1); // Reset ke halaman 1 ketika filter status berubah
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset ke halaman 1 ketika jumlah item per halaman berubah
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setStartDate(event.target.value);
    setCurrentPage(1); // Reset ke halaman 1 ketika rentang tanggal berubah
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
    setCurrentPage(1); // Reset ke halaman 1 ketika rentang tanggal berubah
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const filteredData = pengaduanData.filter((item) => {
    const isNameMatch = item.nama
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const itemDate = new Date(item.createdAt).setHours(0, 0, 0, 0);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    const isDateMatch =
      (!start || itemDate >= start) && (!end || itemDate <= end);
    const isStatusMatch = statusFilter ? item.status === statusFilter : true;

    return isNameMatch && isDateMatch && isStatusMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const openModal = (pengaduan: Pengaduan) => {
    setSelectedPengaduan(pengaduan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPengaduan(null);
  };

  const handleExport = () => {
    exportToExcelPengaduan(filteredData, indexOfFirstItem);
  };
  

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className=" flex flex-col sm:flex-row sm:justify-between mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-0 font-bold ">
          <input
            type="text"
            placeholder="Cari nama..."
            value={searchTerm}
            onChange={handleSearch}
            className="border p-2 rounded mb-2 sm:mb-0 sm:mr-2 flex-grow  font-bold text-boxdark dark:text-white"
          />
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="border p-2 rounded mb-2 sm:mb-0 sm:mr-2 font-bold text-boxdark"
            />
            <span>-</span>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="border p-2 rounded mb-2 sm:mb-0 font-bold text-boxdark"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <label
            htmlFor="statusFilter"
            className="mr-2 text-sm font-bold text-black dark:text-white"
          >
            Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="border p-2 rounded font-bold text-boxdark"
          >
            <option value="">Semua</option>
            <option value="Selesai">Selesai</option>
            <option value="Proses">Proses</option>
            <option value="Belum Diproses">Belum Diproses</option>
          </select>
        </div>
        <div className="flex items-center">
          <label
            htmlFor="itemsPerPage"
            className="mr-2 text-sm font-bold text-black dark:text-white"
          >
            Tampilkan:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border p-2 rounded font-bold text-boxdark"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Export to Excel
        </button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left dark:bg-gray-700">
              <th className=" py--4 px--4  font-bold text-black dark:text-white xl:pl-11">
                No
              </th>
              <th className="min-w-[200px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11">
                Nama
              </th>
              <th className="min-w-[250px] py-4 px-4 font-bold text-black dark:text-white">
                Keperluan
              </th>
              <th className="py-4 px-4 font-bold text-black dark:text-white">
                Bukti
              </th>
              <th className="py-4 px-4 font-bold text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-bold text-black dark:text-white">
                Tanggal dibuat
              </th>
              <th className="py-4 px-4 font-bold text-black dark:text-white">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-center">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={item.id_pengaduan}>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600 xl:pl-11">
                    <p className="text-black dark:text-white">
                      {indexOfFirstItem + index + 1}
                    </p>
                  </td>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600 xl:pl-11">
                    <h5 className="font-bold text-black dark:text-white">
                      {item.nama}
                    </h5>
                  </td>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600">
                    <p className="font-bold text-black dark:text-white">
                      {item.keperluan}
                    </p>
                  </td>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600">
                    {item.bukti ? (
                      <a
                        href={`http://localhost:5000/images/${item.bukti}`}
                        // href={`http://10.5.92.65:5000/images/${item.bukti}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-500 hover:underline"
                      >
                        Lihat Bukti
                      </a>
                    ) : (
                      <p className="font-bold text-red-500">Tidak ada</p>
                    )}
                  </td>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600">
                    <span
                      className={` inline-flex items-center rounded-full px-3 py-1 text-sm font-bold  ${
                        item.status === 'Selesai'
                          ? 'font-bold bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                          : 'font-bold bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600">
                    <div className="font-bold py-3 px-4">
                      {formatDate(item.createdAt)}
                    </div>
                  </td>

                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600">
                    {/* Kolom Aksi dengan Ikon */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(item)} // Call openModal with the selected pengaduan data
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-yellow-500 hover:text-yellow-700"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-green-500 hover:text-green-700"
                        title="Print"
                      >
                        <PrinterIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {indexOfFirstItem + 1} hingga{' '}
            {Math.min(indexOfLastItem, filteredData.length)} dari{' '}
            {filteredData.length} data pengaduan
          </p>
        </div>
        <div className="flex items-center">
          <button
            className="p-2 bg-gray-200 rounded-md mr-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentPage} / {totalPages}
          </span>
          <button
            className="p-2 bg-gray-200 rounded-md ml-2"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        {/* Modal Pengaduan */}
        {isModalOpen && (
          <ModalPengaduan
            isOpen={isModalOpen}
            onClose={closeModal}
            pengaduan={selectedPengaduan} // Pass the selected pengaduan data to the modal
          />
        )}
      </div>
    </div>
  );
};

export default TabelPengaduan;
