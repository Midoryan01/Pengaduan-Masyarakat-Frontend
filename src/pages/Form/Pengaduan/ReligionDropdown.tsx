import React from 'react';

interface ReligionDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const religions = [
  'Islam',
  'Kristen',
  'Katolik',
  'Hindu',
  'Buddha',
  'Konghucu'
];

const ReligionDropdown: React.FC<ReligionDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="mb-4.5">
      <label htmlFor="agama" className="mb-2.5 block text-black dark:text-white">
        Agama <span className="text-meta-1">*</span>
      </label>
      <select
        id="agama"
        name="agama"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      >
        <option value="" disabled>Pilih Agama Anda</option>
        {religions.map((religion) => (
          <option key={religion} value={religion}>
            {religion}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReligionDropdown;