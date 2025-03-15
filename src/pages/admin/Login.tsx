
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Shield, ArrowLeft } from "lucide-react";
import { secureStore, secureRetrieve } from "@/services/security/dataSecurity";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Esquema de validação do formulário
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Credenciais mockadas para demonstração
const DEMO_ADMIN = {
  email: "admin@exemplo.com",
  password: "senha123",
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Verificar se já está autenticado
  useEffect(() => {
    const adminAuth = secureRetrieve<{ authenticated: boolean }>("admin-auth");
    if (adminAuth?.authenticated) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    // Simulação de autenticação com credenciais mockadas
    // Em um ambiente real, isso seria feito com uma API
    if (values.email === DEMO_ADMIN.email && values.password === DEMO_ADMIN.password) {
      secureStore("admin-auth", { 
        authenticated: true, 
        user: values.email,
        role: "admin",
        lastLogin: new Date().toISOString()
      });
      navigate("/admin/dashboard");
    } else {
      setError("Credenciais inválidas. Tente novamente.");
      setLoginAttempts(prev => prev + 1);
      
      // Após 3 tentativas, mostrar dica
      if (loginAttempts >= 2) {
        setError("Dica: Use email 'admin@exemplo.com' e senha 'senha123' para demonstração.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-8 w-full max-w-md"
        >
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Área Administrativa</h1>
              <p className="text-gray-500 mt-1">Acesso restrito a funcionários</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-gray-500"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg mb-6 flex items-center">
            <Shield className="text-indigo-500 mr-3 h-5 w-5" />
            <p className="text-sm text-indigo-700">
              Esta área é protegida e requer autenticação.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu.email@empresa.com" 
                        {...field} 
                        autoComplete="email"
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
                        type="password" 
                        placeholder="Sua senha" 
                        {...field} 
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-6">
                Entrar
              </Button>
            </form>
          </Form>

          <div className="mt-8 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Demonstração de painel administrativo. Use as credenciais fornecidas para acesso.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
