import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface UniversalAssistanceFormProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  baseUrl: string;
  setBaseUrl: (value: string) => void;
}

const UniversalAssistanceForm = ({
  username,
  setUsername,
  password,
  setPassword,
  baseUrl,
  setBaseUrl,
}: UniversalAssistanceFormProps) => {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus(null);
    try {
      const response = await fetch(`${baseUrl}/v1/Emissor/Setup`, {
        method: "GET",
        headers: {
          "Login": username,
          "Senha": password,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }
      const data = await response.json();
      console.log("Resposta do setup:", data);
      setConnectionStatus("Conexão bem-sucedida!");
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      setConnectionStatus("Falha na conexão. Verifique as credenciais, a URL base e as permissões de CORS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="baseUrl">URL Base da API</Label>
        <Input
          id="baseUrl"
          placeholder="https://api-br.universal-assistance.com/v1"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          URL base para a API da Universal Assistance. Use:
          <br />• https://api-br.universal-assistance.com/v1
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Credencial de Login</Label>
        <Input
          id="username"
          placeholder="Credencial de Login fornecida pela Universal Assistance"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Deve ser enviado no header como <strong>"Login"</strong>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Credencial de Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Credencial de Senha fornecida pela Universal Assistance"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Deve ser enviado no header como <strong>"Senha"</strong>
        </p>
      </div>

      <div className="mt-4">
        <Button onClick={testConnection} disabled={loading}>
          {loading ? "Testando Conexão..." : "Testar Conexão"}
        </Button>
      </div>

      {connectionStatus && (
        <Alert className="mt-3 border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            {connectionStatus}
          </AlertDescription>
        </Alert>
      )}

      <Alert className="mt-3 border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Para resolução de problemas de conexão e mapeamento:
          <ul className="mt-1 list-disc pl-4">
            <li>Confirme que a URL base está correta e que o domínio está na lista de permissões da API.</li>
            <li>Verifique se as credenciais (Login e Senha) estão corretas e sendo enviadas nos headers.</li>
            <li>
              Alinhe o mapeamento dos endpoints:
              <ul className="pl-4 list-disc">
                <li>Utilize <strong>POST /v1/Cotacao</strong> com payload adequado para cotação e mapeie o valor <strong>"valorBrutoBrl"</strong> conforme documentado.</li>
                <li>Utilize <strong>GET /v1/Agencia/Vendas</strong> para consulta de vendas com parâmetros “inicio”, “fim” e “apenasTitular”.</li>
                <li>Garanta que os endpoints auxiliares (benefícios, tipoviagem, operadoras, etc.) retornem dados que sejam mapeados sem conversões indevidas no frontend.</li>
              </ul>
            </li>
            <li>Utilize o botão "Testar Conexão" para confirmar que a API responde conforme esperado.</li>
          </ul>
        </AlertDescription>
      </Alert>
    </>
  );
};

export default UniversalAssistanceForm;
