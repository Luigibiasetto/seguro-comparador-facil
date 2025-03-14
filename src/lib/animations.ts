
import { useEffect } from 'react';

// Função para criar animações de entrada para elementos com atraso
export const useStaggeredAnimation = (
  selector: string,
  options = {
    threshold: 0.1,
    baseDelay: 0.1,
    staggerDelay: 0.1,
    duration: 0.6,
    distance: 20
  }
) => {
  useEffect(() => {
    const elementsToAnimate = document.querySelectorAll(selector);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const delay = options.baseDelay + index * options.staggerDelay;
            
            element.style.opacity = '0';
            element.style.transform = `translateY(${options.distance}px)`;
            element.style.transition = `opacity ${options.duration}s ease, transform ${options.duration}s ease`;
            element.style.transitionDelay = `${delay}s`;
            
            // Pequeno atraso para garantir que o estilo inicial seja aplicado
            setTimeout(() => {
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
            }, 50);
            
            observer.unobserve(element);
          }
        });
      },
      { threshold: options.threshold }
    );
    
    elementsToAnimate.forEach(element => {
      observer.observe(element);
    });
    
    return () => {
      elementsToAnimate.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, [selector, options]);
};

// Animação para transição entre páginas
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};
