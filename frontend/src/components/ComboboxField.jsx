/* =================================
   COMBOBOX FIELD
================================= */

import { useState } from "react";

export default function ComboboxField({
  label,
  name,
  value,
  onChange,
  options = [],
  loading = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find(
    (option) => String(option.id) === String(value),
  );

  const filteredOptions = options.filter((option) => {
    const searchText = search.toLowerCase();

    return (
      String(option.id).includes(searchText) ||
      option.code?.toLowerCase().includes(searchText) ||
      option.description?.toLowerCase().includes(searchText)
    );
  });

  function handleSelect(option) {
    onChange({
      target: {
        name,
        value: String(option.id),
      },
    });

    setSearch("");
    setOpen(false);
  }

  return (
    <div className="relative">
      <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
        {label}
      </label>

      {/* Selected value */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex w-full items-center justify-between
          rounded-lg border border-slate-200
          bg-white px-3 py-2
          text-left text-[12px]
          text-slate-700
          outline-none transition
          hover:border-slate-300
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-500/10
        "
      >
        <span className={selectedOption ? "text-slate-700" : "text-slate-400"}>
          {selectedOption
            ? `${selectedOption.code} - ${selectedOption.description}`
            : loading
              ? "Loading departments..."
              : `Select ${label}`}
        </span>

        <span className="text-[10px] text-slate-400">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute z-50 mt-1 w-full
            overflow-hidden rounded-lg
            border border-slate-200
            bg-white shadow-lg
          "
        >
          {/* Search */}
          <div className="border-b border-slate-100 p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search department..."
              autoFocus
              className="
                w-full rounded-md
                border border-slate-200
                px-3 py-2
                text-[12px] text-slate-700
                outline-none
                placeholder:text-slate-400
                focus:border-blue-500
              "
            />
          </div>

          {/* Options */}
          <div className="max-h-52 overflow-y-auto py-1">
            {loading ? (
              <div className="px-3 py-2 text-[11px] text-slate-400">
                Loading departments...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-[11px] text-slate-400">
                No departments found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="
                    block w-full
                    px-3 py-2
                    text-left
                    text-[12px]
                    text-slate-600
                    transition
                    hover:bg-slate-50
                  "
                >
                  <div className="font-medium text-slate-700">
                    {option.code}
                  </div>

                  <div className="text-[10px] text-slate-400">
                    {option.description}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
