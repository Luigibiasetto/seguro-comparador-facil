
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, UserPlus, Copy, Key, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createTestAgencyUser } from "@/services/testUserService";

const TestAgencyLogin = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [testCredentials, setTestCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTestUser = async () => {
    try {
      setIsCreating(true);
      setError(null);
      
      const result = await createTestAgencyUser();
      
      if (result.success && result.email && result.password) {
        setTestCredentials({
          email: result.email,
          password: result.password
        });
        toast({
          title: "Usuário de teste criado",
          description: "Credenciais geradas com sucesso",
          variant: "default",
        });
      } else {
        setError("Não foi possível criar o usuário de teste. Tente novamente.");
        toast({
          title: "Erro",
          description: "Falha ao criar usuário de teste",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Erro ao criar usuário de teste:", err);
      setError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string, type: 'email' | 'password') => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type === 'email' ? 'Email' : 'Senha'} copiado para a área de transferência`,
      variant: "default",
    });
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
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Usuário de Teste para Agências</CardTitle>
              <CardDescription>
                Crie um usuário de teste para acessar o portal de agências
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {testCredentials ? (
                <div className="space-y-4">
                  <Alert variant="default" className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>Usuário criado com sucesso</AlertTitle>
                    <AlertDescription>
                      Use as credenciais abaixo para fazer login no portal de agências
                    </AlertDescription>
                  </Alert>
                  
                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Email:</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">{testCredentials.email}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyToClipboard(testCredentials.email, 'email')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Senha:</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">{testCredentials.password}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyToClipboard(testCredentials.password, 'password')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/agency/login')}
                  >
                    Ir para o login
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-sm text-gray-500">
                    Ao clicar no botão abaixo, um usuário de teste será criado para que você possa acessar o portal de agências imediatamente.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <p className="font-medium mb-1">Importante:</p>
                    <p>Este usuário é apenas para fins de teste e demonstração.</p>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleCreateTestUser}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      "Criando usuário..."
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-5 w-5" />
                        Criar Usuário de Teste
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestAgencyLogin;
