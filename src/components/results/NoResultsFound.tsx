
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface NoResultsFoundProps {
  onBackToSearch: () => void;
}

const NoResultsFound = ({ onBackToSearch }: NoResultsFoundProps) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Info className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-2">Nenhum seguro encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Não encontramos resultados com os filtros atuais. Tente ajustar os filtros ou fazer uma nova busca.
        </p>
        <Button onClick={onBackToSearch}>Nova busca</Button>
      </CardContent>
    </Card>
  );
};

export default NoResultsFound;
