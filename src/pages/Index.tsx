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
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const typeOrder = ["Propuesta", "Observación", "Reflexión", "Nuestra Sugerencia"];

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("/bites_supa.json");
        const data = await response.json();
        
        // Group cards by category
        const categories = Array.from(new Set(data.map((card: InsightCard) => card.Category)));
        
        // Get first category's first "Propuesta" card
        const firstCategoryCards = data.filter((card: InsightCard) => 
          card.Category === categories[0] && card.Type === "Propuesta"
        );
        
        setCards(data);
        setVisibleCards(firstCategoryCards.length > 0 ? [firstCategoryCards[0]] : []);
        setCurrentCategoryIndex(0);
        setCurrentTypeIndex(0);
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
    const currentCategory = categories[currentCategoryIndex];
    const currentType = typeOrder[currentTypeIndex];
    
    // Get all cards of current category and type
    const categoryTypeCards = cards.filter(card => 
      card.Category === currentCategory && 
      card.Type === currentType
    );

    // If there are more cards of current type in current category
    if (visibleCards.length < categoryTypeCards.length) {
      const nextCard = categoryTypeCards[visibleCards.length];
      setVisibleCards(prev => [...prev, nextCard]);
    } 
    // If we need to move to next type
    else if (currentTypeIndex < typeOrder.length - 1) {
      const nextType = typeOrder[currentTypeIndex + 1];
      const nextTypeCards = cards.filter(card => 
        card.Category === currentCategory && 
        card.Type === nextType
      );
      
      if (nextTypeCards.length > 0) {
        setVisibleCards(prev => [...prev, nextTypeCards[0]]);
        setCurrentTypeIndex(prev => prev + 1);
      }
    }
    // If we need to move to next category
    else if (currentCategoryIndex < categories.length - 1) {
      const nextCategory = categories[currentCategoryIndex + 1];
      const nextCategoryCards = cards.filter(card => 
        card.Category === nextCategory && 
        card.Type === typeOrder[0]
      );
      
      if (nextCategoryCards.length > 0) {
        setVisibleCards(prev => [...prev, nextCategoryCards[0]]);
        setCurrentCategoryIndex(prev => prev + 1);
        setCurrentTypeIndex(0);
      }
    }
  }, [currentCategoryIndex, currentTypeIndex, cards]);

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
          {(currentCategoryIndex < Array.from(new Set(cards.map(card => card.Category))).length - 1 || 
           currentTypeIndex < typeOrder.length) && (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;