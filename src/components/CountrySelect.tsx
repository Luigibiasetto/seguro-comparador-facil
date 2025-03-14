
import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { countries, Country } from "@/lib/countries";
import { cn } from "@/lib/utils";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  excludedCountry?: string;
}

const CountrySelect = ({
  value,
  onChange,
  label,
  disabled = false,
  className = "",
  placeholder = "Selecione um país",
  excludedCountry
}: CountrySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtra os países excluindo o país especificado
  const filteredCountries = countries
    .filter(country => excludedCountry ? country.code !== excludedCountry : true)
    .filter(country => 
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Encontra o país selecionado
  const selectedCountry = countries.find(country => country.code === value);

  // Efeito para fechar o menu quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Efeito para focar no input de pesquisa quando o menu abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Manipuladores
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm("");
    }
  };

  const handleSelectCountry = (countryCode: string) => {
    onChange(countryCode);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div
        className={cn(
          "input-glass w-full px-3 py-2.5 flex items-center justify-between rounded-lg cursor-pointer",
          disabled && "opacity-60 cursor-not-allowed",
          isOpen && "ring-1 ring-brand-400"
        )}
        onClick={toggleDropdown}
      >
        <div className="flex items-center truncate">
          {selectedCountry ? (
            <span className="truncate">{selectedCountry.name}</span>
          ) : (
            <span className="text-gray-400 truncate">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center">
          {selectedCountry && (
            <button 
              onClick={handleClearSelection}
              className="mr-1 text-gray-400 hover:text-gray-600 rounded-full p-0.5 hover:bg-gray-100"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown 
            size={18} 
            className={cn(
              "text-gray-500 transition-transform duration-200",
              isOpen && "transform rotate-180"
            )} 
          />
        </div>
      </div>

      {isOpen && (
        <div className="glass absolute z-50 mt-1 w-full rounded-lg shadow-lg py-1 max-h-60 overflow-auto">
          <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-3 py-2 border-b border-gray-100">
            <div className="relative">
              <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                className="input-glass w-full pl-8 pr-3 py-2 text-sm rounded-md"
                placeholder="Buscar país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="pt-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className={cn(
                    "px-3 py-2 flex items-center text-sm cursor-pointer transition-colors",
                    country.code === value ? "bg-brand-50 text-brand-700" : "hover:bg-gray-50"
                  )}
                  onClick={() => handleSelectCountry(country.code)}
                >
                  <div className="flex-1">{country.name}</div>
                  {country.code === value && <Check size={16} className="text-brand-600" />}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                Nenhum país encontrado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
