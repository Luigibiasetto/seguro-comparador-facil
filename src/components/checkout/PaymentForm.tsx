
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, QrCode } from 'lucide-react';
import { InsuranceOffer } from '@/services/api/types';

interface PaymentFormProps {
  offer: InsuranceOffer;
  formatPrice: (price: number) => string;
  onSubmit: (paymentMethod: 'pix' | 'creditCard', creditCardInfo?: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ offer, formatPrice, onSubmit }) => {
  const [paymentMethod, setPaymentMethod] = React.useState<'pix' | 'creditCard'>('pix');

  // Schema for credit card validation
  const creditCardSchema = z.object({
    number: z.string().min(13, "Número de cartão inválido").max(19, "Número de cartão inválido"),
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Formato inválido (MM/AA)"),
    cvv: z.string().length(3, "CVV deve ter 3 dígitos"),
  });

  // Create form
  const form = useForm<z.infer<typeof creditCardSchema>>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      number: "",
      name: "",
      expiry: "",
      cvv: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof creditCardSchema>) => {
    if (paymentMethod === 'creditCard') {
      onSubmit('creditCard', values);
    } else {
      onSubmit('pix');
    }
  };

  return (
    <CardContent>
      <div className="mb-6">
        <div className="text-lg font-medium mb-2">Método de Pagamento</div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={paymentMethod === 'pix' ? 'default' : 'outline'}
            className="flex items-center justify-center gap-2"
            onClick={() => setPaymentMethod('pix')}
          >
            <QrCode className="h-4 w-4" />
            PIX
          </Button>
          <Button
            type="button"
            variant={paymentMethod === 'creditCard' ? 'default' : 'outline'}
            className="flex items-center justify-center gap-2"
            onClick={() => setPaymentMethod('creditCard')}
          >
            <CreditCard className="h-4 w-4" />
            Cartão de crédito
          </Button>
        </div>
      </div>

      {paymentMethod === 'pix' ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-6 flex flex-col items-center justify-center">
            <QrCode className="h-32 w-32 mb-4" />
            <p className="text-center text-sm text-muted-foreground mb-2">
              Escaneie o QR Code com o aplicativo do seu banco para pagar com PIX
            </p>
            <p className="font-medium text-center">Valor: {formatPrice(offer.price)}</p>
          </div>
          <Button 
            className="w-full" 
            onClick={() => onSubmit('pix')}
          >
            Finalizar Compra
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Cartão</FormLabel>
                  <FormControl>
                    <Input placeholder="0000 0000 0000 0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome no Cartão</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome como está no cartão" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validade</FormLabel>
                    <FormControl>
                      <Input placeholder="MM/AA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <span>Valor total:</span>
                <span className="font-medium text-xl">{formatPrice(offer.price)}</span>
              </div>
              <Button type="submit" className="w-full">Finalizar Compra</Button>
            </div>
          </form>
        </Form>
      )}
    </CardContent>
  );
};

export default PaymentForm;
