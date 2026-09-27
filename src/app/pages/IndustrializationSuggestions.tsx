import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { IndustrializationTemplates } from "../components/IndustrializationTemplates";
import {
  ArrowLeft,
  Server,
  Shield,
  Zap,
  BarChart3,
  GitBranch,
  Database,
  Users,
  Globe,
  Lock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  Network,
  Settings,
  Rocket,
  CloudCog,
  FileText,
  Code,
  MonitorSpeaker,
  TrendingUp,
  Wrench
} from "lucide-react";

interface IndustrializationSuggestionsProps {
  onBack: () => void;
}

export function IndustrializationSuggestions({ onBack }: IndustrializationSuggestionsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const deploymentSuggestions = [
    {
      id: "docker",
      title: "Conteneurisation Docker",
      description: "Création d'images Docker pour l'application CHAPFOODY",
      priority: "Haute",
      status: "Recommandé",
      category: "Déploiement",
      implementation: [
        "Créer un Dockerfile optimisé avec build multi-stage",
        "Configurer docker-compose pour l'environnement local",
        "Optimiser la taille des images (Alpine Linux)",
        "Implémenter health checks pour les conteneurs"
      ]
    },
    {
      id: "kubernetes",
      title: "Orchestration Kubernetes",
      description: "Déploiement sur cluster Kubernetes pour la scalabilité",
      priority: "Moyenne",
      status: "Future",
      category: "Orchestration",
      implementation: [
        "Configurer les manifests Kubernetes (Deployment, Service, Ingress)",
        "Mettre en place l'auto-scaling horizontal",
        "Configurer les persistent volumes pour la base de données",
        "Implémenter les rolling updates"
      ]
    },
    {
      id: "cicd",
      title: "Pipeline CI/CD",
      description: "Automatisation des déploiements avec GitLab/GitHub Actions",
      priority: "Haute",
      status: "Essentiel",
      category: "DevOps",
      implementation: [
        "Configurer les tests automatisés (unit, integration, e2e)",
        "Mettre en place la validation de code (ESLint, Prettier)",
        "Automatiser les builds et déploiements",
        "Implémenter les environnements staging/production"
      ]
    }
  ];

  const securitySuggestions = [
    {
      id: "auth",
      title: "Authentification Avancée",
      description: "Mise en place d'OAuth2/OIDC et 2FA",
      priority: "Critique",
      status: "Urgent",
      category: "Sécurité",
      implementation: [
        "Intégrer OAuth2 avec providers (Google, Microsoft, Apple)",
        "Implémenter l'authentification à deux facteurs (2FA)",
        "Mettre en place JWT avec refresh tokens",
        "Configurer les sessions sécurisées"
      ]
    },
    {
      id: "encryption",
      title: "Chiffrement des Données",
      description: "Chiffrement end-to-end pour les données sensibles",
      priority: "Haute",
      status: "Recommandé",
      category: "Données",
      implementation: [
        "Chiffrer les données en transit (TLS 1.3)",
        "Chiffrer les données au repos (AES-256)",
        "Implémenter la gestion des clés (AWS KMS, Azure Key Vault)",
        "Configurer les certificats SSL/TLS"
      ]
    },
    {
      id: "compliance",
      title: "Conformité RGPD",
      description: "Mise en conformité avec les réglementations européennes",
      priority: "Critique",
      status: "Légal",
      category: "Conformité",
      implementation: [
        "Implémenter le consentement des cookies",
        "Créer les mécanismes de droit à l'oubli",
        "Mettre en place l'export des données personnelles",
        "Configurer l'anonymisation des données"
      ]
    }
  ];

  const performanceSuggestions = [
    {
      id: "caching",
      title: "Système de Cache",
      description: "Redis/Memcached pour l'amélioration des performances",
      priority: "Haute",
      status: "Performance",
      category: "Cache",
      implementation: [
        "Implémenter Redis pour le cache applicatif",
        "Configurer le cache des sessions utilisateur",
        "Mettre en place le cache des requêtes API",
        "Optimiser les stratégies d'invalidation"
      ]
    },
    {
      id: "cdn",
      title: "Content Delivery Network",
      description: "CDN pour la distribution globale des assets",
      priority: "Moyenne",
      status: "Optimisation",
      category: "Distribution",
      implementation: [
        "Configurer CloudFlare ou AWS CloudFront",
        "Optimiser la compression des images (WebP, AVIF)",
        "Mettre en place le lazy loading",
        "Implémenter la mise en cache progressive"
      ]
    },
    {
      id: "database",
      title: "Optimisation Base de Données",
      description: "Optimisation des requêtes et index PostgreSQL/MongoDB",
      priority: "Haute",
      status: "Critique",
      category: "Base de Données",
      implementation: [
        "Analyser et optimiser les requêtes lentes",
        "Créer les index appropriés",
        "Implémenter la réplication master-slave",
        "Configurer le partitioning pour les gros volumes"
      ]
    }
  ];

  const monitoringSuggestions = [
    {
      id: "metrics",
      title: "Métriques et Monitoring",
      description: "Prometheus, Grafana pour le monitoring applicatif",
      priority: "Haute",
      status: "Observabilité",
      category: "Monitoring",
      implementation: [
        "Configurer Prometheus pour la collecte de métriques",
        "Créer des dashboards Grafana personnalisés",
        "Implémenter l'alerting automatique (PagerDuty, Slack)",
        "Surveiller les métriques business (commandes, revenus)"
      ]
    },
    {
      id: "logging",
      title: "Centralisation des Logs",
      description: "ELK Stack ou Loki pour l'agrégation des logs",
      priority: "Moyenne",
      status: "Debug",
      category: "Logs",
      implementation: [
        "Configurer Elasticsearch/Loki pour la centralisation",
        "Structurer les logs en JSON",
        "Implémenter la corrélation des traces",
        "Configurer la rétention des logs"
      ]
    },
    {
      id: "uptime",
      title: "Surveillance Uptime",
      description: "Monitoring de disponibilité 24/7",
      priority: "Critique",
      status: "SLA",
      category: "Disponibilité",
      implementation: [
        "Configurer des health checks automatiques",
        "Mettre en place des alertes de downtime",
        "Surveiller les temps de réponse API",
        "Implémenter des tests synthétiques"
      ]
    }
  ];

  const scalabilitySuggestions = [
    {
      id: "microservices",
      title: "Architecture Microservices",
      description: "Décomposition en services autonomes par métier",
      priority: "Moyenne",
      status: "Architecture",
      category: "Scalabilité",
      implementation: [
        "Séparer les services par domaine métier (Restaurant, Livraison, Paiement)",
        "Implémenter API Gateway (Kong, AWS API Gateway)",
        "Configurer la communication inter-services (gRPC, Message Queues)",
        "Mettre en place le service discovery"
      ]
    },
    {
      id: "queues",
      title: "Queues de Messages",
      description: "RabbitMQ/SQS pour le traitement asynchrone",
      priority: "Haute",
      status: "Asynchrone",
      category: "Messages",
      implementation: [
        "Implémenter RabbitMQ ou AWS SQS",
        "Configurer les workers pour le traitement de commandes",
        "Mettre en place les retry policies",
        "Surveiller les queues et dead letter queues"
      ]
    },
    {
      id: "autoscaling",
      title: "Auto-scaling",
      description: "Mise à l'échelle automatique basée sur la charge",
      priority: "Moyenne",
      status: "Cloud",
      category: "Élasticité",
      implementation: [
        "Configurer l'auto-scaling horizontal",
        "Mettre en place les métriques de scaling (CPU, mémoire, requêtes)",
        "Implémenter le load balancing",
        "Optimiser les temps de démarrage des instances"
      ]
    }
  ];

  const getAllSuggestions = () => [
    ...deploymentSuggestions,
    ...securitySuggestions,
    ...performanceSuggestions,
    ...monitoringSuggestions,
    ...scalabilitySuggestions
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critique": return "bg-red-500";
      case "Haute": return "bg-orange-500";
      case "Moyenne": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Urgent": return "text-red-600";
      case "Essentiel": return "text-orange-600";
      case "Recommandé": return "text-blue-600";
      case "Performance": return "text-green-600";
      case "Critique": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const overallProgress = Math.round((completedTasks.length / getAllSuggestions().length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Rocket className="w-7 h-7 text-[#b70f23]" />
                  Industrialisation CHAPFOODY
                </h1>
                <p className="text-gray-600">Suggestions pour le passage en production</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Progression globale</div>
                <div className="text-lg font-semibold text-gray-900">{overallProgress}%</div>
              </div>
              <div className="w-24">
                <Progress value={overallProgress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white border shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center gap-2">
              <CloudCog className="w-4 h-4" />
              Déploiement
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <MonitorSpeaker className="w-4 h-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="scalability" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Scalabilité
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Suggestions</p>
                      <p className="text-3xl font-bold text-gray-900">{getAllSuggestions().length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Priorité Critique</p>
                      <p className="text-3xl font-bold text-red-600">
                        {getAllSuggestions().filter(s => s.priority === "Critique").length}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Complétées</p>
                      <p className="text-3xl font-bold text-green-600">{completedTasks.length}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Progression</p>
                      <p className="text-3xl font-bold text-blue-600">{overallProgress}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Prioritaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getAllSuggestions()
                    .filter(s => s.priority === "Critique" || s.priority === "Haute")
                    .slice(0, 6)
                    .map((suggestion) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                        onClick={() => toggleTaskCompletion(suggestion.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={`${getPriorityColor(suggestion.priority)} text-white text-xs`}>
                            {suggestion.priority}
                          </Badge>
                          {completedTasks.includes(suggestion.id) && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{suggestion.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                        <Badge variant="outline" className={getStatusColor(suggestion.status)}>
                          {suggestion.status}
                        </Badge>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Render suggestion tabs */}
          {[
            { key: "deployment", suggestions: deploymentSuggestions, icon: CloudCog },
            { key: "security", suggestions: securitySuggestions, icon: Shield },
            { key: "performance", suggestions: performanceSuggestions, icon: Zap },
            { key: "monitoring", suggestions: monitoringSuggestions, icon: MonitorSpeaker },
            { key: "scalability", suggestions: scalabilitySuggestions, icon: TrendingUp }
          ].map(({ key, suggestions, icon: Icon }) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {suggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:shadow-lg transition-all">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              <Icon className="w-6 h-6 text-[#b70f23]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="text-xl">{suggestion.title}</CardTitle>
                                <Badge className={`${getPriorityColor(suggestion.priority)} text-white`}>
                                  {suggestion.priority}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(suggestion.status)}>
                                  {suggestion.status}
                                </Badge>
                              </div>
                              <p className="text-gray-600">{suggestion.description}</p>
                              <Badge variant="secondary" className="mt-2">
                                {suggestion.category}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant={completedTasks.includes(suggestion.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleTaskCompletion(suggestion.id)}
                            className={completedTasks.includes(suggestion.id) ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {completedTasks.includes(suggestion.id) ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Complété
                              </>
                            ) : (
                              <>
                                <Wrench className="w-4 h-4 mr-2" />
                                À faire
                              </>
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Étapes d'implémentation :</h4>
                          <ul className="space-y-2">
                            {suggestion.implementation.map((step, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mt-0.5">
                                  {index + 1}
                                </div>
                                <span className="text-gray-700">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}

          {/* Templates Tab */}
          <TabsContent value="templates">
            <IndustrializationTemplates />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}