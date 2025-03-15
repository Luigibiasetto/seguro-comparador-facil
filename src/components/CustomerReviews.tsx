
import React from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Review {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatarSrc?: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Carla Mendes",
    location: "Rio de Janeiro",
    text: "Economizei muito tempo e dinheiro comparando seguros aqui! Encontrei a opção perfeita para minha viagem para a Europa.",
    rating: 5,
    avatarSrc: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=150&h=150"
  },
  {
    id: 2,
    name: "Roberto Santos",
    location: "São Paulo",
    text: "Processo super simples! Em menos de 5 minutos encontrei um seguro com ótima cobertura e preço justo para minha família.",
    rating: 5
  },
  {
    id: 3,
    name: "Fernanda Lima",
    location: "Belo Horizonte",
    text: "Já uso o comparador há anos e nunca me decepcionou. A plataforma fica cada vez melhor e as opções são excelentes.",
    rating: 5,
    avatarSrc: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=150&h=150"
  },
  {
    id: 4,
    name: "Marcelo Costa",
    location: "Recife",
    text: "Recomendo para todos que vão viajar! Consegui um seguro completo por um preço muito menor do que encontrei em outros lugares.",
    rating: 4
  },
  {
    id: 5,
    name: "Ana Beatriz",
    location: "Brasília",
    text: "O atendimento foi excelente quando precisei acionar o seguro durante minha viagem. Valeu muito a pena!",
    rating: 5,
    avatarSrc: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=150&h=150"
  }
];

const CustomerReviews = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-indigo-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">O que nossos clientes dizem</h2>
          <p className="text-lg text-gray-600">Milhares de viajantes confiam em nosso comparador para encontrar o seguro ideal</p>
        </motion.div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="py-4">
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mr-4">
                        {review.avatarSrc ? (
                          <img 
                            src={review.avatarSrc} 
                            alt={review.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-green-600 font-bold text-xl">
                            {review.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.name}</h3>
                        <p className="text-sm text-gray-500">{review.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    
                    <div className="relative mb-2 flex-grow">
                      <Quote size={24} className="absolute -left-2 -top-2 text-green-100 rotate-180" />
                      <p className="text-gray-700 relative z-10 pl-2">{review.text}</p>
                    </div>
                    
                    <div className="text-right mt-4">
                      <p className="text-sm text-green-600 font-medium">Viajante verificado</p>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </div>
          </Carousel>
        </div>
        
        <div className="mt-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
              <div className="flex -space-x-1">
                {reviews.slice(0, 3).map((review, i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-white"
                  >
                    {review.avatarSrc ? (
                      <img 
                        src={review.avatarSrc} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-xs">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-700 font-medium">Avaliação média de <span className="text-green-600">4.8/5</span> de mais de 3.420 clientes</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
