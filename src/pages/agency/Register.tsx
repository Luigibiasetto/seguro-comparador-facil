
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Building2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

// Validação do CNPJ
const validateCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14) return false;
  
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  // Validação completa do CNPJ
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(0))) return false;
  
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  return result === parseInt(digits.charAt(1));
};

// Formatação do CNPJ
const formatCNPJ = (value: string) => {
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/, '$1.$2');
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
  value = value.replace(/(\d{4})(\d)/, '$1-$2');
  return value;
};

// Schema de validação
const registerSchema = z.object({
  agencyName: z.string().min(3, { message: "Nome da agência deve ter pelo menos 3 caracteres" }),
  cnpj: z.string().refine(validateCNPJ, { message: "CNPJ inválido" }),
  responsibleName: z.string().min(3, { message: "Nome do responsável deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
  commission: z.string().transform(val => Number(val)),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
}).refine(data => {
  const commission = Number(data.commission);
  return commission >= 0 && commission <= 60;
}, {
  message: "A comissão deve estar entre 0% e 60%",
  path: ["commission"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const AgencyRegister = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agencyName: "",
      cnpj: "",
      responsibleName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      commission: "10",
    },
  });

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      setNetworkError(false);
      
      // Registro do usuário no Supabase Auth
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.responsibleName,
            user_type: 'agency',
          }
        }
      });
      
      if (userError) throw userError;
      
      // Inserir dados da agência na tabela 'agencies'
      const { error: agencyError } = await supabase
        .from('agencies')
        .insert({
          user_id: userData.user!.id,
          name: values.agencyName,
          cnpj: values.cnpj.replace(/\D/g, ''),
          responsible_name: values.responsibleName,
          email: values.email,
          phone: values.phone,
          commission_rate: values.commission,
          status: 'pending', // Pendente de aprovação
        });
      
      if (agencyError) {
        // Reverter o registro do usuário se houver erro
        throw agencyError;
      }
      
      await supabase.auth.signOut(); // Deslogar o usuário após o registro
      
      toast.success('Registro realizado com sucesso!', {
        description: 'Aguarde a aprovação do seu cadastro para acessar o portal.',
      });
      
      navigate('/agency/login');
    } catch (error: any) {
      console.error('Erro ao registrar agência:', error);
      
      if (error.message === 'Failed to fetch' || error.code === 'network_error') {
        setNetworkError(true);
        toast.error('Erro de conexão', {
          description: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
        });
      } else {
        toast.error('Erro ao registrar', {
          description: error.message || 'Verifique os dados e tente novamente',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const formattedValue = formatCNPJ(e.target.value);
    onChange(formattedValue);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container max-w-2xl px-4 mx-auto">
          <Button 
            variant="ghost" 
            className="items-center gap-1 mb-4" 
            onClick={() => navigate('/agency/login')}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para login
          </Button>
          
          {networkError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Problema de conexão detectado. Verifique sua internet e tente novamente.
              </AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Cadastro de Agência
              </CardTitle>
              <CardDescription className="text-center">
                Preencha as informações para se tornar uma agência parceira
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center">
                <Building2 className="text-blue-500 mr-3 h-5 w-5" />
                <p className="text-sm text-blue-700">
                  Após o cadastro, nossa equipe analisará suas informações para aprovação.
                </p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="agencyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Agência</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da sua agência" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CNPJ</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="00.000.000/0000-00" 
                              maxLength={18}
                              onChange={(e) => handleCNPJChange(e, field.onChange)}
                              value={field.value}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="responsibleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Responsável</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="agencia@exemplo.com" 
                              type="email"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="commission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comissão Desejada (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="60"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500">
                            Defina sua margem de comissão (0-60%)
                          </p>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="••••••••" 
                              type="password"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Senha</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="••••••••" 
                              type="password"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Cadastro'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgencyRegister;
