import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, CalendarDays, User, Settings } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { countries } from "@/lib/countries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApiConfigModal from "@/components/ApiConfigModal";

const Index = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  });
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    count: 1,
  });
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);

  const handleSearch = () => {
    if (!origin || !destination || !date?.from || !date?.to || passengers.count === 0) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const departureDate = format(date.from, "yyyy-MM-dd");
    const returnDate = format(date.to, "yyyy-MM-dd");

    navigate(
      `/resultados?origin=${origin}&destination=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&passengers=${JSON.stringify(passengers)}`
    );
  };

  const updatePassengerCount = () => {
    const total = passengers.adults + passengers.children + passengers.infants;
    setPassengers((prev) => ({ ...prev, count: total }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-7xl">
          {/* Hero Header */}
          <div className="text-center mb-8 md:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
            >
              Encontre o Seguro Viagem Ideal para sua Próxima Aventura
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 mb-6 md:mb-8"
            >
              Compare as melhores opções de seguro viagem e viaje com tranquilidade.
            </motion.p>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsApiConfigOpen(true)}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Configurar API
              </Button>
            </div>
          </div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Origin */}
              <div>
                <Label htmlFor="origin" className="text-sm font-medium block mb-2">
                  De onde você vai?
                </Label>
                <Select onValueChange={setOrigin}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o país de origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(countries).map(([key, country]) => (
                      <SelectItem key={key} value={key}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destination */}
              <div>
                <Label htmlFor="destination" className="text-sm font-medium block mb-2">
                  Para onde você vai?
                </Label>
                <Select onValueChange={setDestination}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o país de destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(countries).map(([key, country]) => (
                      <SelectItem key={key} value={key}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div>
                <Label htmlFor="date" className="text-sm font-medium block mb-2">
                  Quando você vai?
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
                        ) : (
                          format(date.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span>Escolha as datas</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      pagedNavigation
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Passengers */}
              <div>
                <Label htmlFor="passengers" className="text-sm font-medium block mb-2">
                  Passageiros
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <User className="mr-2 h-4 w-4" />
                      {passengers.count} Passageiro(s)
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="adults">Adultos</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setPassengers((prev) => ({
                                ...prev,
                                adults: Math.max(0, prev.adults - 1),
                              }))
                            }
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            id="adults"
                            value={passengers.adults}
                            className="w-16 text-center"
                            onChange={(e) =>
                              setPassengers((prev) => ({
                                ...prev,
                                adults: parseInt(e.target.value),
                              }))
                            }
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setPassengers((prev) => ({ ...prev, adults: prev.adults + 1 }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="children">Crianças</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setPassengers((prev) => ({
                                ...prev,
                                children: Math.max(0, prev.children - 1),
                              }))
                            }
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            id="children"
                            value={passengers.children}
                            className="w-16 text-center"
                            onChange={(e) =>
                              setPassengers((prev) => ({
                                ...prev,
                                children: parseInt(e.target.value),
                              }))
                            }
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setPassengers((prev) => ({ ...prev, children: prev.children + 1 }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="infants">Bebês</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setPassengers((prev) => ({
                                ...prev,
                                infants: Math.max(0, prev.infants - 1),
                              }))
                            }
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            id="infants"
                            value={passengers.infants}
                            className="w-16 text-center"
                            onChange={(e) =>
                              setPassengers((prev) => ({
                                ...prev,
                                infants: parseInt(e.target.value),
                              }))
                            }
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setPassengers((prev) => ({ ...prev, infants: prev.infants + 1 }))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <Button className="w-full" onClick={updatePassengerCount}>
                        Atualizar
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Search Button */}
            <Button
              className="w-full mt-6 md:mt-8"
              onClick={handleSearch}
            >
              <Search className="mr-2 h-4 w-4" />
              Buscar Seguros
            </Button>
          </motion.div>

          {/* Why Choose Us Section */}
          <section className="mt-12 md:mt-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-3xl font-semibold text-gray-900 mb-6 text-center"
            >
              Por que Escolher Nosso Comparador de Seguros?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center"
              >
                <MapPin className="mx-auto h-10 w-10 text-brand-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Ampla Cobertura Geográfica
                </h3>
                <p className="text-gray-600">
                  Encontre seguros que cobrem você em qualquer lugar do mundo.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center"
              >
                <CalendarDays className="mx-auto h-10 w-10 text-brand-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Flexibilidade de Datas
                </h3>
                <p className="text-gray-600">
                  Selecione as datas exatas da sua viagem para uma cobertura precisa.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-center"
              >
                <User className="mx-auto h-10 w-10 text-brand-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Opções para Todos os Viajantes
                </h3>
                <p className="text-gray-600">
                  Seguros personalizados para viajantes individuais, famílias e grupos.
                </p>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
      
      <ApiConfigModal 
        open={isApiConfigOpen} 
        onOpenChange={setIsApiConfigOpen} 
      />
    </div>
  );
};

export default Index;
