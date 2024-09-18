  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import {
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
    PencilIcon,
    PrinterIcon,
  } from '@heroicons/react/20/solid';
  import * as XLSX from 'xlsx';
  import { Petugas, Pengaduan, Tanggapan } from './type';
  import EditTanggapanModal from './EditModalTanggapan';

  const TabelTanggapan: React.FC = () => {
    const [tanggapanData, setTanggapanData] = useState<Tanggapan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTanggapan, setEditingTanggapan] = useState<Tanggapan | null>(null,);
    const [petugasList, setPetugasList] = useState<Petugas[]>([]);
    const [pengaduanList, setPengaduanList] = useState<Pengaduan[]>([]);

    // Fetch data petugas dan pengaduan menggunakan Promise.all
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [petugasResponse, pengaduanResponse, tanggapanResponse] =
            await Promise.all([
              axios.get<Petugas[]>('http://localhost:5000/petugas'),
              axios.get<Pengaduan[]>('http://localhost:5000/pengaduan'),
              axios.get<Tanggapan[]>('http://localhost:5000/tanggapan'),
            ]);
          setPetugasList(petugasResponse.data);
          setPengaduanList(pengaduanResponse.data);
          setTanggapanData(tanggapanResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    // Modal Tanggapan
    const openEditModal = (tanggapan: Tanggapan) => {
      setEditingTanggapan(tanggapan);
      setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
      setIsEditModalOpen(false);
      setEditingTanggapan(null);
    };

    const handleEditSubmit = async (editedTanggapan: Tanggapan) => {
      try {
        await axios.put(
          `http://localhost:5000/tanggapan/${editedTanggapan.id_tanggapan}`,
          editedTanggapan,
        );
        // Refresh data after successful edit
        const response = await axios.get<Tanggapan[]>(
          'http://localhost:5000/tanggapan',
        );
        setTanggapanData(response.data);
        closeEditModal();
      } catch (error) {
        console.error('Error updating tanggapan:', error);
      }
    };

    const getNamaPengaduan = (id_pengaduan: number) => {
      const pengaduan = pengaduanList.find(
        (p) => p.id_pengaduan === id_pengaduan,
      );
      return pengaduan ? pengaduan.nama : 'Tidak ditemukan';
    };

    const getNamaPetugas = (id_petugas: number) => {
      const petugas = petugasList.find((p) => p.id_petugas === id_petugas);
      return petugas ? petugas.nama : 'Tidak ditemukan';
    };
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setCurrentPage(1);
    };

    const handleItemsPerPageChange = (
      event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
      setItemsPerPage(Number(event.target.value));
      setCurrentPage(1);
    };

    const handleStartDateChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setStartDate(event.target.value);
      setCurrentPage(1);
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEndDate(event.target.value);
      setCurrentPage(1);
    };

    const formatDate = (date: string) => {
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${d.getFullYear()}`;
    };

    const filteredData = tanggapanData.filter((item) => {
      const isTanggapanMatch = item.tanggapan
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const itemDate = new Date(item.tanggal).setHours(0, 0, 0, 0);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

      const isDateMatch =
        (!start || itemDate >= start) && (!end || itemDate <= end);

      return isTanggapanMatch && isDateMatch;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const exportToExcel = () => {
      // Generate the data to be exported
      const dataToExport = filteredData.map((item, index) => {
        const pengaduan = pengaduanList.find(p => p.id_pengaduan === item.id_pengaduan);
        const petugas = petugasList.find(p => p.id_petugas === item.id_petugas);
    
        return {
          No: indexOfFirstItem + index + 1,
          Nama_Pengaduan: pengaduan?.nama ?? 'Tidak ditemukan',
          Alamat: pengaduan?.alamat ?? 'Tidak ditemukan',
          NIK: pengaduan?.nik ?? 'Tidak ditemukan',
          Agama: pengaduan?.agama ?? 'Tidak ditemukan',
          Keperluan: pengaduan?.keperluan ?? 'Tidak ditemukan',
          'Telp/Email': pengaduan?.telp_email ?? 'Tidak ditemukan',
          Umur: pengaduan?.umur ?? 0,
          Bukti: pengaduan?.bukti ?? 'Tidak ada',
          Status: pengaduan?.status ?? 'Tidak ditemukan',
          'Tanggal Pengaduan': pengaduan ? formatDate(pengaduan.createdAt) : 'Tidak ditemukan',
          'Tanggal Tanggapan': formatDate(item.tanggal),
          Tanggapan: item.tanggapan,
          'Tindak Lanjut': item.tindak_lanjut,
          Keterangan: item.keterangan,
          
        };
      });

      // Create a new workbook and add the worksheet with the data
      const ws = XLSX.utils.json_to_sheet(dataToExport, {
        header: [
          'No',
          'Nama',
          'Alamat',
          'NIK',
          'Agama',
          'Keperluan',
          'Telp/Email',
          'Umur',
          'Bukti',
          'Status',
          'Tanggal Pengaduan',
          'Tanggal Tanggapan',
          'Tanggapan',
          'Tindak Lanjut',
          'Keterangan',
          
        ],
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'TanggapanData');

      // Generate a timestamp for the filename
      const timestamp = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const filename = `tanggapan_data_${timestamp}.xlsx`;

      // Write the workbook to a file with timestamp
      XLSX.writeFile(wb, filename);
    };

    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Cari tanggapan..."
              value={searchTerm}
              onChange={handleSearch}
              className="border p-2 rounded mb-2 sm:mb-0 sm:mr-2 flex-grow"
            />
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="border p-2 rounded mb-2 sm:mb-0 sm:mr-2"
              />
              <span>-</span>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="border p-2 rounded mb-2 sm:mb-0"
              />
            </div>
          </div>
          <div className="flex items-center">
            <label
              htmlFor="itemsPerPage"
              className="mr-2 text-sm font-medium text-gray-700"
            >
              Tampilkan:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border p-2 rounded"
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
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Export to Excel
          </button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left dark:bg-gray-700">
                <th className=" py--4 px--4  font-medium text-black dark:text-white xl:pl-11">
                  No
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Nama Pengaduan
                </th>
                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Tanggapan
                </th>
                <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">
                  Tindak Lanjut
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Keterangan
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Tanggal
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Nama Petugas
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id_tanggapan}>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600 xl:pl-11">
                    <p className="text-black dark:text-white">
                      {indexOfFirstItem + index + 1}
                    </p>
                  </td>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600">
                    <p className="text-black dark:text-white">
                      {getNamaPengaduan(item.id_pengaduan)}
                    </p>
                  </td>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600 xl:pl-11">
                    <p className="text-black dark:text-white">{item.tanggapan}</p>
                  </td>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600">
                    <p className="text-black dark:text-white">
                      {item.tindak_lanjut}
                    </p>
                  </td>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600">
                    <p className="text-black dark:text-white">
                      {item.keterangan}
                    </p>
                  </td>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600">
                    <p className="text-black dark:text-white">
                      {formatDate(item.tanggal)}
                    </p>
                  </td>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600">
                    <p className="text-black dark:text-white">
                      {getNamaPetugas(item.id_petugas)}
                    </p>
                  </td>
                  <td className="border-b border-gray-200 py-5 px-4 dark:border-gray-600">
                    {/* Button Action */}
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        title="Show"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-yellow-500 hover:text-yellow-700"
                        title="Edit"
                        onClick={() => openEditModal(item)}
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
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
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
        </div>
        {/* Edit Modal */}
        <EditTanggapanModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          tanggapan={editingTanggapan}
          pengaduanList={pengaduanList}
          onSubmit={handleEditSubmit}
        />
      </div>
    );
  };

  export default TabelTanggapan;
