import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { FiCheck, FiChevronDown } from 'react-icons/fi'

type RegionOption = {
  id: number
  name: string
}

type RegionSelectProps = {
  label: string
  name: 'province' | 'regency' | 'district'
  placeholder: string
  value: number | null
  options: RegionOption[]
  icon: ReactNode
  disabled?: boolean
  onChange: (value: string) => void
}

export default function RegionSelect({
  label,
  name,
  placeholder,
  value,
  options,
  icon,
  disabled = false,
  onChange,
}: RegionSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const triggerId = `${name}-trigger`

  const selectedOption = useMemo(
    () => options.find((option) => option.id === value) ?? null,
    [options, value],
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  useEffect(() => {
    if (disabled) {
      setIsOpen(false)
    }
  }, [disabled])

  const handleSelect = (nextValue: string) => {
    onChange(nextValue)
    setIsOpen(false)
  }

  const toggleOpen = () => {
    if (disabled) {
      return
    }

    setIsOpen((current) => !current)
  }

  const selectedLabel = selectedOption?.name ?? placeholder

  return (
    <div className="space-y-2.5">
      <label
        className="block text-xs font-bold uppercase tracking-[0.18em] text-[#647285]"
        htmlFor={triggerId}
      >
        {label}
      </label>
      <div className="relative" ref={wrapperRef}>
        <input name={name} type="hidden" value={value ?? ''} />

        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#97a4b7]">
          {icon}
        </div>

        <button
          aria-controls={listId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="h-14 w-full rounded-2xl border border-[#9099a8] bg-[#f1f3f7] px-12 pr-11 text-left text-base font-semibold text-[#1d2433] outline-none transition hover:border-[#7f8a9d] focus:border-[#2f70d3] disabled:cursor-not-allowed disabled:opacity-55"
          id={triggerId}
          onClick={toggleOpen}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsOpen(false)
            }
          }}
          role="combobox"
          type="button"
          disabled={disabled}
        >
          {selectedLabel}
        </button>

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6f7787]">
          <FiChevronDown
            aria-hidden="true"
            className={`size-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.45rem)] z-20 overflow-hidden rounded-2xl border border-[#9099a8] bg-[#f1f3f7] shadow-[0_12px_26px_rgba(15,23,42,0.12)]">
            <ul className="max-h-72 overflow-auto py-1" id={listId} role="listbox">
              <li>
                <button
                  aria-selected={value === null}
                  className={`flex w-full items-center justify-between px-12 py-2.5 text-left text-base transition ${
                    value === null
                      ? 'bg-[#2f70d3] text-white'
                      : 'text-[#1d2433] hover:bg-[#e5eaf2]'
                  }`}
                  onClick={() => handleSelect('')}
                  role="option"
                  type="button"
                >
                  <span>{placeholder}</span>
                  {value === null && <FiCheck aria-hidden="true" className="size-4" />}
                </button>
              </li>
              {options.map((option) => {
                const isSelected = option.id === value

                return (
                  <li key={option.id}>
                    <button
                      aria-selected={isSelected}
                      className={`flex w-full items-center justify-between px-12 py-2.5 text-left text-base transition ${
                        isSelected
                          ? 'bg-[#2f70d3] text-white'
                          : 'text-[#1d2433] hover:bg-[#e5eaf2]'
                      }`}
                      onClick={() => handleSelect(String(option.id))}
                      role="option"
                      type="button"
                    >
                      <span>{option.name}</span>
                      {isSelected && <FiCheck aria-hidden="true" className="size-4" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
