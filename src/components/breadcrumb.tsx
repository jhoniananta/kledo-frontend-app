type BreadcrumbProps = {
  items: string[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="breadcrumb border-b border-[#d6dae2] px-6 py-5 lg:px-12"
    >
      <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9ca6b7] lg:text-[0.95rem]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li className="flex items-center gap-2" key={`${item}-${index}`}>
              <span className={isLast ? 'text-[#2f70d3]' : undefined}>{item}</span>
              {!isLast && <span className="text-[#bec5d1]">{'>'}</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
