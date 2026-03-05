import { FiArrowDown } from 'react-icons/fi'

type MainContentProps = {
  provinceName: string | null
  regencyName: string | null
  districtName: string | null
}

type RegionBlockProps = {
  label: string
  value: string | null
}

function RegionBlock({ label, value }: RegionBlockProps) {
  return (
    <section className="space-y-3 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#6ca3ea]">{label}</p>
      <h2 className="text-4xl font-extrabold text-[#111c38] sm:text-5xl lg:text-[5rem] lg:leading-[1.06]">
        {value ?? '-'}
      </h2>
    </section>
  )
}

function ArrowDivider() {
  return (
    <div className="text-[#c2c9d5]" aria-hidden="true">
      <FiArrowDown className="mx-auto size-9" />
    </div>
  )
}

export default function MainContent({
  provinceName,
  regencyName,
  districtName,
}: MainContentProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-14 sm:px-10 lg:gap-12 lg:px-12">
      <RegionBlock label="Provinsi" value={provinceName} />
      <ArrowDivider />
      <RegionBlock label="Kota / Kabupaten" value={regencyName} />
      <ArrowDivider />
      <RegionBlock label="Kecamatan" value={districtName} />
    </main>
  )
}
