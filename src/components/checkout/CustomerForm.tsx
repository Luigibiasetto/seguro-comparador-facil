
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomerInfo } from "@/services/api/types";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import CountrySelect from "../CountrySelect";

interface CustomerFormProps {
  isBrazilianOrigin: boolean;
  onSubmit: (data: CustomerInfo) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ isBrazilianOrigin, onSubmit }) => {
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
  // Schema for form validation
  const formSchema = z.object({
    documentType: z.enum(["cpf", "passport"]),
    documentNumber: z.string().min(1, "Número do documento é obrigatório"),
    fullName: z.string().min(3, "Nome completo deve ter pelo menos 3 caracteres"),
    birthDate: z.string()
      .min(1, "Data de nascimento é obrigatória")
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data deve estar no formato DD/MM/AAAA"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().min(8, "Telefone inválido"),
    emergencyContact: z.object({
      name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
      phone: z.string().min(8, "Telefone inválido"),
    }),
    address: z.object({
      zipCode: z.string().min(8, "CEP é obrigatório"),
      street: z.string().min(1, "Rua é obrigatória"),
      number: z.string().min(1, "Número é obrigatório"),
      complement: z.string().optional(),
      city: z.string().min(1, "Cidade é obrigatória"),
      state: z.string().min(1, "Estado é obrigatório"),
      country: z.string().min(1, "País é obrigatório"),
    }),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: "Você precisa aceitar os termos e condições para continuar",
    }),
  });

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "cpf", // Always set CPF as default
      documentNumber: "",
      fullName: "",
      birthDate: "",
      email: "",
      phone: "",
      emergencyContact: {
        name: "",
        phone: "",
      },
      address: {
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        city: "",
        state: "",
        country: "BR", // Default country set to Brazil
      },
      acceptTerms: false,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Remove the acceptTerms field before submitting
    const { acceptTerms, ...customerData } = values;
    
    // Convert birthDate from DD/MM/YYYY to YYYY-MM-DD for API
    const [day, month, year] = values.birthDate.split('/');
    const formattedBirthDate = `${year}-${month}-${day}`;
    
    const formattedData = {
      ...customerData,
      birthDate: formattedBirthDate,
    };
    
    onSubmit(formattedData as CustomerInfo);
  };

  const fetchAddressByCep = async (cep: string) => {
    // Skip if CEP is not complete yet
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    try {
      setIsLoadingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }
      
      // Update form with address data
      form.setValue('address.street', data.logradouro);
      form.setValue('address.city', data.localidade);
      form.setValue('address.state', data.uf);
      form.setValue('address.complement', data.complemento || '');
      
      // Focus on the number field after filling the address
      setTimeout(() => {
        const numberInput = document.querySelector('[name="address.number"]') as HTMLInputElement;
        if (numberInput) numberInput.focus();
      }, 100);
      
      toast.success("Endereço preenchido automaticamente");
    } catch (error) {
      toast.error("Erro ao buscar CEP");
      console.error("Error fetching address by CEP:", error);
    } finally {
      setIsLoadingCep(false);
    }
  };
  
  // Format birth date input (DD/MM/YYYY)
  const formatBirthDate = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    
    // Format with slashes (DD/MM/YYYY)
    if (digits.length > 0) {
      formatted += digits.substring(0, Math.min(2, digits.length));
    }
    
    if (digits.length > 2) {
      formatted += '/' + digits.substring(2, Math.min(4, digits.length));
    }
    
    if (digits.length > 4) {
      formatted += '/' + digits.substring(4, Math.min(8, digits.length));
    }
    
    return formatted;
  };
  
  // Format phone with DDD in parentheses
  const formatPhone = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    
    // Format: (XX) XXXXX-XXXX
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 7) {
      return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    } else {
      return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, Math.min(11, digits.length))}`;
    }
  };

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Type */}
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="passport">Passaporte (apenas estrangeiros vindo ao Brasil)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Document Number */}
            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o número do documento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Birth Date with auto-formatting */}
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="DD/MM/AAAA" 
                      value={field.value}
                      onChange={(e) => {
                        const formatted = formatBirthDate(e.target.value);
                        field.onChange(formatted);
                      }}
                      maxLength={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone with autoformatting */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(DDD) XXXXX-XXXX" 
                      value={field.value}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        field.onChange(formatted);
                      }}
                      maxLength={15}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Emergency Contact */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-medium mb-4">Contato de Emergência</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emergencyContact.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do contato de emergência" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Emergency Phone with autoformatting */}
              <FormField
                control={form.control}
                name="emergencyContact.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(DDD) XXXXX-XXXX" 
                        value={field.value}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          field.onChange(formatted);
                        }}
                        maxLength={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Address */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-medium mb-4">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CEP (positioned first) */}
              <FormField
                control={form.control}
                name="address.zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o CEP" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          fetchAddressByCep(e.target.value);
                        }}
                        disabled={isLoadingCep}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o nome da rua" 
                        {...field} 
                        disabled={isLoadingCep}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o número" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Apartamento, bloco, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite a cidade" 
                        {...field} 
                        disabled={isLoadingCep}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o estado" 
                        {...field} 
                        disabled={isLoadingCep}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country selection using CountrySelect component */}
              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <CountrySelect
                        value={field.value}
                        onChange={field.onChange}
                        label=""
                        placeholder="Selecione o país"
                        className="p-0 m-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Eu aceito os termos e condições do serviço
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Continuar para pagamento</Button>
        </form>
      </Form>
    </CardContent>
  );
};

export default CustomerForm;
