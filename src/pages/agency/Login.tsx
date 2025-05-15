
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2, ArrowLeft, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { AgencyTableData } from "@/services/api/types/agency";

// Esquema de validação do formulário
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AgencyLogin = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  // Verificar se já está autenticado como agência
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Usamos SQL RAW para evitar problemas de tipagem
          const { data: agencyData, error } = await supabase
            .from('agencies')
            .select('*')
            .eq('user_id', data.session.user.id)
            .maybeSingle();
            
          if (agencyData) {
            navigate('/agency/dashboard');
          }
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      }
    };
    
    checkSession();
  }, [navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setNetworkError(false);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) throw error;
      
      // Verificar se o usuário é uma agência usando SQL raw
      const { data: agencyData, error: agencyError } = await supabase
        .from('agencies')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle();
      
      if (agencyError || !agencyData) {
        await supabase.auth.signOut();
        toast.error('Acesso negado', { 
          description: 'Esta conta não está registrada como agência de viagens.' 
        });
        return;
      }
      
      toast.success('Login realizado com sucesso!');
      navigate('/agency/dashboard');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      if (error.message === 'Failed to fetch' || error.code === 'network_error') {
        setNetworkError(true);
        toast.error('Erro de conexão', {
          description: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
        });
      } else {
        toast.error('Erro ao fazer login', {
          description: error.message || 'Verifique suas credenciais e tente novamente',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 flex items-center justify-center">
        <div className="container max-w-md px-4">
          <Button 
            variant="ghost" 
            className="items-center gap-1 mb-4" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a página inicial
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
                Portal de Agências
              </CardTitle>
              <CardDescription className="text-center">
                Acesse sua conta para gerenciar vendas de seguros
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center">
                <Building2 className="text-blue-500 mr-3 h-5 w-5" />
                <p className="text-sm text-blue-700">
                  Área exclusiva para agências de viagens credenciadas.
                </p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
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
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Não tem uma conta? Entre em contato para se credenciar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgencyLogin;
