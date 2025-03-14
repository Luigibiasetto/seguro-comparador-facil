
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Minus, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface PassengerData {
  count: number;
  ages: number[];
}

interface PassengerSelectProps {
  value: PassengerData;
  onChange: (value: PassengerData) => void;
  className?: string;
  label?: string;
  maxPassengers?: number;
}

const PassengerSelect: React.FC<PassengerSelectProps> = ({
  value,
  onChange,
  className,
  label = "Passageiros",
  maxPassengers = 8
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Manipuladores de eventos
  const toggleDropdown = () => setIsOpen(!isOpen);

  const updatePassengerCount = (newCount: number) => {
    if (newCount < 1 || newCount > maxPassengers) return;
    
    // Atualiza o array de idades
    let newAges = [...value.ages];
    
    // Se aumentar, adiciona nova idade no final (padrão: 30 anos)
    if (newCount > value.count) {
      newAges.push(30);
    }
    // Se diminuir, remove a última idade
    else if (newCount < value.count) {
      newAges = newAges.slice(0, newCount);
    }
    
    onChange({ count: newCount, ages: newAges });
  };

  const updateAge = (index: number, age: number) => {
    // Limita a idade entre 0 e 100
    const validAge = Math.max(0, Math.min(100, age));
    
    const newAges = [...value.ages];
    newAges[index] = validAge;
    
    onChange({ ...value, ages: newAges });
  };

  // Fechar o dropdown quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Formata o texto de exibição
  const displayText = value.count === 1 
    ? "1 passageiro" 
    : `${value.count} passageiros`;

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={toggleDropdown}
        className={cn(
          "input-glass w-full px-3 py-2.5 flex items-center justify-between rounded-lg text-left",
          isOpen && "ring-1 ring-brand-400"
        )}
      >
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-500" />
          <span>{displayText}</span>
        </div>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-gray-500 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <div className="glass absolute z-50 mt-1 w-full rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Passageiros</span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => updatePassengerCount(value.count - 1)}
                  disabled={value.count <= 1}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-full",
                    value.count <= 1 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  )}
                >
                  <Minus size={14} />
                </button>
                
                <span className="text-sm font-semibold w-6 text-center">
                  {value.count}
                </span>
                
                <button
                  type="button"
                  onClick={() => updatePassengerCount(value.count + 1)}
                  disabled={value.count >= maxPassengers}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-full",
                    value.count >= maxPassengers 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  )}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Seção para cada passageiro */}
          <div className="p-3 max-h-64 overflow-y-auto">
            {value.ages.map((age, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">
                    Passageiro {index + 1} - Idade
                  </span>
                  <span className="text-xs text-brand-600 font-medium">
                    {age} anos
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={age}
                  onChange={(e) => updateAge(index, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-gray-50 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerSelect;
