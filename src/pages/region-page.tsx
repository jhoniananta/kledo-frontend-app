import { useEffect, useMemo, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import Breadcrumb from '@components/breadcrumb'
import MainContent from '@components/main-content'
import Sidebar from '@components/sidebar'
import type {
  District,
  Province,
  Regency,
  RegionFilters,
  RegionsPayload,
} from '../types/regions'

const STORAGE_KEY = 'region-filters'

const EMPTY_FILTERS: RegionFilters = {
  provinceId: null,
  regencyId: null,
  districtId: null,
}

function toNumber(value: unknown): number | null {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return null
  }

  return value
}

function validateFilters(data: RegionsPayload, filters: RegionFilters): RegionFilters {
  const selectedProvince =
    data.provinces.find((province) => province.id === filters.provinceId) ?? null

  if (!selectedProvince) {
    return EMPTY_FILTERS
  }

  const selectedRegency =
    data.regencies.find(
      (regency) => regency.id === filters.regencyId && regency.province_id === selectedProvince.id,
    ) ?? null

  if (!selectedRegency) {
    return {
      provinceId: selectedProvince.id,
      regencyId: null,
      districtId: null,
    }
  }

  const selectedDistrict =
    data.districts.find(
      (district) => district.id === filters.districtId && district.regency_id === selectedRegency.id,
    ) ?? null

  if (!selectedDistrict) {
    return {
      provinceId: selectedProvince.id,
      regencyId: selectedRegency.id,
      districtId: null,
    }
  }

  return {
    provinceId: selectedProvince.id,
    regencyId: selectedRegency.id,
    districtId: selectedDistrict.id,
  }
}

function getStoredFilters(data: RegionsPayload): RegionFilters {
  if (typeof window === 'undefined') {
    return EMPTY_FILTERS
  }

  const rawFilters = localStorage.getItem(STORAGE_KEY)
  if (!rawFilters) {
    return EMPTY_FILTERS
  }

  try {
    const parsedFilters = JSON.parse(rawFilters) as Partial<RegionFilters>

    return validateFilters(data, {
      provinceId: toNumber(parsedFilters.provinceId),
      regencyId: toNumber(parsedFilters.regencyId),
      districtId: toNumber(parsedFilters.districtId),
    })
  } catch {
    return EMPTY_FILTERS
  }
}

function findSelectedProvince(
  provinces: Province[],
  provinceId: number | null,
): Province | null {
  return provinces.find((province) => province.id === provinceId) ?? null
}

function findSelectedRegency(
  regencies: Regency[],
  regencyId: number | null,
): Regency | null {
  return regencies.find((regency) => regency.id === regencyId) ?? null
}

function findSelectedDistrict(
  districts: District[],
  districtId: number | null,
): District | null {
  return districts.find((district) => district.id === districtId) ?? null
}

function parseFilterValue(value: string): number | null {
  if (value.length === 0) {
    return null
  }

  const numericValue = Number(value)
  return Number.isNaN(numericValue) ? null : numericValue
}

export default function RegionPage() {
  const regions = useLoaderData() as RegionsPayload
  const [filters, setFilters] = useState<RegionFilters>(() => getStoredFilters(regions))

  const filteredRegencies = useMemo(
    () =>
      filters.provinceId === null
        ? []
        : regions.regencies.filter((regency) => regency.province_id === filters.provinceId),
    [filters.provinceId, regions.regencies],
  )

  const filteredDistricts = useMemo(
    () =>
      filters.regencyId === null
        ? []
        : regions.districts.filter((district) => district.regency_id === filters.regencyId),
    [filters.regencyId, regions.districts],
  )

  const selectedProvince = useMemo(
    () => findSelectedProvince(regions.provinces, filters.provinceId),
    [filters.provinceId, regions.provinces],
  )
  const selectedRegency = useMemo(
    () => findSelectedRegency(filteredRegencies, filters.regencyId),
    [filters.regencyId, filteredRegencies],
  )
  const selectedDistrict = useMemo(
    () => findSelectedDistrict(filteredDistricts, filters.districtId),
    [filters.districtId, filteredDistricts],
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (
      filters.provinceId === null &&
      filters.regencyId === null &&
      filters.districtId === null
    ) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
  }, [filters])

  const handleProvinceChange = (value: string) => {
    const selectedProvinceId = parseFilterValue(value)
    const provinceId = regions.provinces.some((province) => province.id === selectedProvinceId)
      ? selectedProvinceId
      : null

    setFilters({
      provinceId,
      regencyId: null,
      districtId: null,
    })
  }

  const handleRegencyChange = (value: string) => {
    const selectedRegencyId = parseFilterValue(value)
    const regencyId = filteredRegencies.some((regency) => regency.id === selectedRegencyId)
      ? selectedRegencyId
      : null

    setFilters((currentFilters) => ({
      provinceId: currentFilters.provinceId,
      regencyId,
      districtId: null,
    }))
  }

  const handleDistrictChange = (value: string) => {
    const selectedDistrictId = parseFilterValue(value)
    const districtId = filteredDistricts.some((district) => district.id === selectedDistrictId)
      ? selectedDistrictId
      : null

    setFilters((currentFilters) => ({
      ...currentFilters,
      districtId,
    }))
  }

  const handleReset = () => {
    setFilters(EMPTY_FILTERS)
  }

  const breadcrumbItems = ['Indonesia']
  if (selectedProvince) {
    breadcrumbItems.push(selectedProvince.name)
  }
  if (selectedRegency) {
    breadcrumbItems.push(selectedRegency.name)
  }
  if (selectedDistrict) {
    breadcrumbItems.push(selectedDistrict.name)
  }

  return (
    <div className="min-h-screen bg-[#edf0f5] p-2 sm:p-3 lg:p-4">
      <div className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-[1820px] flex-col overflow-hidden rounded-2xl border border-[#d6dae2] bg-[#eef1f6] lg:min-h-[calc(100vh-2rem)] lg:flex-row">
        <Sidebar
          provinces={regions.provinces}
          regencies={filteredRegencies}
          districts={filteredDistricts}
          provinceId={filters.provinceId}
          regencyId={filters.regencyId}
          districtId={filters.districtId}
          onProvinceChange={handleProvinceChange}
          onRegencyChange={handleRegencyChange}
          onDistrictChange={handleDistrictChange}
          onReset={handleReset}
        />

        <section className="flex flex-1 flex-col">
          <Breadcrumb items={breadcrumbItems} />
          <MainContent
            provinceName={selectedProvince?.name ?? null}
            regencyName={selectedRegency?.name ?? null}
            districtName={selectedDistrict?.name ?? null}
          />
        </section>
      </div>
    </div>
  )
}
