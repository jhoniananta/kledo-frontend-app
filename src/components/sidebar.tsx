import { BsBuildings } from 'react-icons/bs'
import { FiGlobe, FiMapPin, FiRotateCcw } from 'react-icons/fi'
import type { District, Province, Regency } from '../types/regions'
import RegionSelect from './region-select'

type SidebarProps = {
  provinces: Province[]
  regencies: Regency[]
  districts: District[]
  provinceId: number | null
  regencyId: number | null
  districtId: number | null
  onProvinceChange: (value: string) => void
  onRegencyChange: (value: string) => void
  onDistrictChange: (value: string) => void
  onReset: () => void
}

export default function Sidebar({
  provinces,
  regencies,
  districts,
  provinceId,
  regencyId,
  districtId,
  onProvinceChange,
  onRegencyChange,
  onDistrictChange,
  onReset,
}: SidebarProps) {
  const hasFilters = provinceId !== null || regencyId !== null || districtId !== null

  return (
    <aside className="w-full border-b border-[#d6dae2] bg-[#eef1f6] p-7 lg:w-[340px] lg:border-b-0 lg:border-r lg:p-8">
      <div className="mb-12 flex items-center gap-4">
        <div className="w-10">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#dce9fb] text-[#2f70d3]">
            <FiGlobe aria-hidden="true" className="size-5" />
          </div>
        </div>
        <p className="whitespace-normal text-[21px] font-bold text-[#101828]">
          Frontend Assessment
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-[#9aa4b7]">
          Filter Wilayah
        </h2>

        <RegionSelect
          icon={<FiGlobe aria-hidden="true" className="size-[18px]" />}
          label="Provinsi"
          name="province"
          onChange={onProvinceChange}
          options={provinces}
          placeholder="Pilih Provinsi"
          value={provinceId}
        />

        <RegionSelect
          icon={<BsBuildings aria-hidden="true" className="size-[18px]" />}
          label="Kota/Kabupaten"
          name="regency"
          onChange={onRegencyChange}
          options={regencies}
          placeholder="Pilih Kota/Kabupaten"
          value={regencyId}
          disabled={provinceId === null}
        />

        <RegionSelect
          icon={<FiMapPin aria-hidden="true" className="size-[18px]" />}
          label="Kecamatan"
          name="district"
          onChange={onDistrictChange}
          options={districts}
          placeholder="Pilih Kecamatan"
          value={districtId}
          disabled={regencyId === null}
        />
      </div>

      <button
        className="mt-10 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#2f70d3] text-sm font-bold uppercase tracking-[0.2em] text-[#364150] transition hover:bg-[#e5ecfa] disabled:cursor-not-allowed disabled:border-[#b8c0cf] disabled:text-[#8d96a7] disabled:hover:bg-transparent"
        type="button"
        onClick={onReset}
        disabled={!hasFilters}
      >
        <FiRotateCcw aria-hidden="true" className="size-5" />
        Reset
      </button>
    </aside>
  )
}
