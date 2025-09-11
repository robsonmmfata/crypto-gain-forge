import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save, Eye, EyeOff } from 'lucide-react';

interface SettingsData {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyLogo: string;
  siteTitle: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
}

const Settings: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    companyName: 'CryptoGain',
    companyEmail: 'admin@cryptogain.com',
    companyPhone: '+55 11 99999-9999',
    companyAddress: 'São Paulo, SP',
    companyLogo: '',
    siteTitle: 'CryptoGain - Plataforma de Investimento',
    siteDescription: 'Plataforma completa para investimento em criptomoedas',
    maintenanceMode: false,
    registrationEnabled: true
  });

  const [previewLogo, setPreviewLogo] = useState<string>('');

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Erro no upload",
        description: "Apenas arquivos de imagem são permitidos (JPG, PNG, GIF)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast({
        title: "Erro no upload",
        description: "O arquivo deve ter no máximo 2MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewLogo(result);
    };
    reader.readAsDataURL(file);

    // Here you would typically upload to your backend
    // For now, we'll just store the file name
    setSettings(prev => ({
      ...prev,
      companyLogo: file.name
    }));

    toast({
      title: "Logo carregado",
      description: "O logo foi carregado com sucesso. Clique em Salvar para confirmar.",
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Here you would make an API call to save settings
      // For now, we'll simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Configurações salvas",
        description: "Todas as configurações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SettingsData, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Configurações do Sistema</h1>
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Salvando...' : 'Salvar Configurações'}</span>
          </Button>
        </div>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Digite o nome da empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                  placeholder="email@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Telefone</Label>
                <Input
                  id="companyPhone"
                  value={settings.companyPhone}
                  onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                  placeholder="+55 11 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Endereço</Label>
                <Input
                  id="companyAddress"
                  value={settings.companyAddress}
                  onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  placeholder="Endereço completo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Logo da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="logoUpload">Upload do Logo</Label>
                <div className="mt-2">
                  <Input
                    ref={fileInputRef}
                    id="logoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Escolher Arquivo</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 2MB
                </p>
              </div>
              <div className="flex-shrink-0">
                {previewLogo ? (
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={previewLogo}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            {settings.companyLogo && (
              <div className="text-sm text-muted-foreground">
                Arquivo atual: {settings.companyLogo}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Site Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Site</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Título do Site</Label>
              <Input
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                placeholder="Título que aparece na aba do navegador"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Descrição do Site</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                placeholder="Descrição breve do site"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="maintenanceMode">Modo de Manutenção</Label>
                <p className="text-sm text-muted-foreground">
                  Ative para colocar o site em manutenção
                </p>
              </div>
              <Button
                type="button"
                variant={settings.maintenanceMode ? "destructive" : "outline"}
                onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                className="flex items-center space-x-2"
              >
                {settings.maintenanceMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{settings.maintenanceMode ? 'Ativado' : 'Desativado'}</span>
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="registrationEnabled">Registro de Usuários</Label>
                <p className="text-sm text-muted-foreground">
                  Permite novos usuários se registrarem
                </p>
              </div>
              <Button
                type="button"
                variant={settings.registrationEnabled ? "default" : "outline"}
                onClick={() => handleInputChange('registrationEnabled', !settings.registrationEnabled)}
                className="flex items-center space-x-2"
              >
                {settings.registrationEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{settings.registrationEnabled ? 'Habilitado' : 'Desabilitado'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            size="lg"
            className="flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{isLoading ? 'Salvando...' : 'Salvar Todas as Configurações'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
