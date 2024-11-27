import { useEffect, useState, useRef, useCallback } from "react";
import { InsightCard } from "@/lib/types";
import Card from "@/components/Card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [cards, setCards] = useState<InsightCard[]>([]);
  const [visibleCards, setVisibleCards] = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("/bites_supa.json");
        const data = await response.json();
        
        // Group cards by category
        const categories = Array.from(new Set(data.map((card: InsightCard) => card.Category)));
        const firstCategoryCards = data.filter((card: InsightCard) => card.Category === categories[0]);
        
        setCards(data);
        setVisibleCards(firstCategoryCards);
        setCurrentCategoryIndex(1);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Por favor, intente nuevamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [toast]);

  const loadMoreCards = useCallback(() => {
    const categories = Array.from(new Set(cards.map(card => card.Category)));
    
    if (currentCategoryIndex >= categories.length) return;

    const nextCategoryCards = cards.filter(
      card => card.Category === categories[currentCategoryIndex]
    );

    setVisibleCards(prev => [...prev, ...nextCategoryCards]);
    setCurrentCategoryIndex(prev => prev + 1);
  }, [currentCategoryIndex, cards]);

  useEffect(() => {
    if (loading) return;

    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreCards();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, loadMoreCards]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary text-center mb-8">
          IA para el Gobierno Peruano
        </h1>
        <div className="space-y-4">
          {visibleCards.map((card, index) => (
            <Card key={index} card={card} index={index} />
          ))}
        </div>
        <div ref={loadingRef} className="mt-4">
          {currentCategoryIndex < Array.from(new Set(cards.map(card => card.Category))).length && (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;