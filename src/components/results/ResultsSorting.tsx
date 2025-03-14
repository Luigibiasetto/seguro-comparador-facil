
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type SortType = "price" | "coverage" | "rating";
type SortDirection = "asc" | "desc";

interface ResultsSortingProps {
  sortBy: SortType;
  sortDirection: SortDirection;
  handleSortChange: (type: SortType) => void;
}

const ResultsSorting = ({ 
  sortBy, 
  sortDirection, 
  handleSortChange 
}: ResultsSortingProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Ordenar por:</span>
      <div className="flex gap-1">
        <Button 
          variant={sortBy === "price" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleSortChange("price")}
          className="text-xs h-8"
        >
          Preço {sortBy === "price" && (
            sortDirection === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
          )}
        </Button>
        <Button 
          variant={sortBy === "coverage" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleSortChange("coverage")}
          className="text-xs h-8"
        >
          Cobertura {sortBy === "coverage" && (
            sortDirection === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
          )}
        </Button>
        <Button 
          variant={sortBy === "rating" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleSortChange("rating")}
          className="text-xs h-8"
        >
          Avaliação {sortBy === "rating" && (
            sortDirection === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ResultsSorting;
