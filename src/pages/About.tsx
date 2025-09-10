import React from 'react';
import { Shield, Users, TrendingUp, Award, Clock, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Proteção de nível militar com criptografia de ponta a ponta e autenticação multifator.'
    },
    {
      icon: TrendingUp,
      title: 'IA Avançada',
      description: 'Algoritmos de inteligência artificial que analisam o mercado 24/7 para maximizar seus retornos.'
    },
    {
      icon: Users,
      title: 'Comunidade Global',
      description: 'Mais de 5.000 investidores ativos em nossa plataforma ao redor do mundo.'
    },
    {
      icon: Award,
      title: 'Resultados Comprovados',
      description: 'ROI médio de 15.2% com histórico transparente de performance.'
    },
    {
      icon: Clock,
      title: 'Suporte 24/7',
      description: 'Equipe de suporte especializada disponível 24 horas por dia, 7 dias por semana.'
    },
    {
      icon: Lock,
      title: 'Fundos Seguros',
      description: 'Seus investimentos são protegidos por seguros e armazenados em carteiras frias.'
    }
  ];

  const teamMembers = [
    {
      name: 'Alex Rodriguez',
      role: 'CEO & Fundador',
      experience: '15 anos em mercados financeiros',
      image: '/avatars/john.jpg'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      experience: 'Ex-Goldman Sachs, especialista em blockchain',
      image: '/avatars/sabrina.jpg'
    },
    {
      name: 'Marcus Johnson',
      role: 'Head of AI',
      experience: 'PhD em Machine Learning, ex-Google',
      image: '/avatars/austin.jpg'
    },
    {
      name: 'Elena Volkov',
      role: 'Head of Security',
      experience: 'Ex-NSA, especialista em cibersegurança',
      image: '/avatars/anne.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sobre a CryptoVault Pro
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Somos a principal plataforma de investimento em criptomoedas, utilizando inteligência artificial 
            avançada para maximizar os retornos dos nossos investidores desde 2020.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">$2.5M+</div>
              <div className="text-muted-foreground">Total Investido</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5,000+</div>
              <div className="text-muted-foreground">Investidores Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">15.2%</div>
              <div className="text-muted-foreground">ROI Médio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Nossa Missão</CardTitle>
              <CardDescription className="text-lg">
                Democratizar o acesso aos investimentos em criptomoedas através da tecnologia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Na CryptoVault Pro, acreditamos que todos devem ter acesso a oportunidades de investimento 
                de alta qualidade em criptomoedas. Nossa plataforma combina anos de experiência em mercados 
                financeiros com as mais avançadas tecnologias de inteligência artificial.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nosso objetivo é eliminar a complexidade e o risco dos investimentos em crypto, oferecendo 
                estratégias automatizadas e transparentes que geram retornos consistentes para nossos investidores.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Por Que Escolher a CryptoVault Pro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nossa Equipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Segurança em Primeiro Lugar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
                <CardTitle>Proteção de Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  95% dos fundos são armazenados em carteiras frias offline, 
                  protegidas contra ataques cibernéticos.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Lock className="w-8 h-8 text-primary mx-auto mb-4" />
                <CardTitle>Criptografia Avançada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Utilizamos criptografia AES-256 e autenticação multifator 
                  para proteger suas informações pessoais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para Começar?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de investidores que já estão maximizando seus retornos conosco.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/register'}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Criar Conta Grátis
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              Ver Planos de Investimento
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;