import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Download, Code, FileText } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  language: string;
  content: string;
}

export function IndustrializationTemplates() {
  const templates: Template[] = [
    {
      id: "dockerfile",
      name: "Dockerfile optimisé",
      description: "Dockerfile multi-stage pour l'application React",
      category: "Déploiement",
      language: "dockerfile",
      content: `# Multi-stage build pour optimiser la taille
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`
    },
    {
      id: "docker-compose",
      name: "Docker Compose",
      description: "Configuration complète avec base de données",
      category: "Déploiement",
      language: "yaml",
      content: `version: '3.8'
services:
  chapfoody-app:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
    
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=chapfoody
      - POSTGRES_USER=chapfoody
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:`
    },
    {
      id: "kubernetes-deployment",
      name: "Kubernetes Deployment",
      description: "Manifests Kubernetes pour la production",
      category: "Orchestration",
      language: "yaml",
      content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: chapfoody-app
  labels:
    app: chapfoody
spec:
  replicas: 3
  selector:
    matchLabels:
      app: chapfoody
  template:
    metadata:
      labels:
        app: chapfoody
    spec:
      containers:
      - name: chapfoody
        image: chapfoody:latest
        ports:
        - containerPort: 80
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10`
    },
    {
      id: "github-actions",
      name: "GitHub Actions CI/CD",
      description: "Pipeline automatisé de déploiement",
      category: "DevOps",
      language: "yaml",
      content: `name: CHAPFOODY CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Build application
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and push Docker image
      run: |
        docker build -t chapfoody:\${{ github.sha }} .
        docker tag chapfoody:\${{ github.sha }} chapfoody:latest
        # Push to your registry here
    
    - name: Deploy to production
      run: |
        # Add your deployment commands here
        echo "Deploying to production..."`
    },
    {
      id: "nginx-conf",
      name: "Configuration Nginx",
      description: "Configuration optimisée pour la production",
      category: "Infrastructure",
      language: "nginx",
      content: `user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;
    
    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    server {
        listen 80;
        server_name chapfoody.com www.chapfoody.com;
        root /usr/share/nginx/html;
        index index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        
        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}`
    },
    {
      id: "prometheus-config",
      name: "Configuration Prometheus",
      description: "Monitoring et métriques applicatives",
      category: "Monitoring",
      language: "yaml",
      content: `global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "chapfoody_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'chapfoody-app'
    static_configs:
      - targets: ['chapfoody-app:3000']
    metrics_path: '/metrics'
    scrape_interval: 30s
    
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
    
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
    
  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']`
    },
    {
      id: "security-config",
      name: "Configuration Sécurité",
      description: "Headers de sécurité et configuration HTTPS",
      category: "Sécurité",
      language: "json",
      content: `{
  "security": {
    "cors": {
      "origin": ["https://chapfoody.com", "https://www.chapfoody.com"],
      "credentials": true,
      "optionsSuccessStatus": 200
    },
    "helmet": {
      "contentSecurityPolicy": {
        "directives": {
          "defaultSrc": ["'self'"],
          "styleSrc": ["'self'", "'unsafe-inline'"],
          "scriptSrc": ["'self'"],
          "imgSrc": ["'self'", "data:", "https:"],
          "connectSrc": ["'self'", "https://api.chapfoody.com"]
        }
      },
      "hsts": {
        "maxAge": 31536000,
        "includeSubDomains": true,
        "preload": true
      }
    },
    "rateLimit": {
      "windowMs": 900000,
      "max": 100,
      "message": "Trop de requêtes, réessayez plus tard"
    },
    "jwt": {
      "secret": "\${JWT_SECRET}",
      "expiresIn": "1h",
      "refreshTokenExpiry": "7d"
    },
    "bcrypt": {
      "saltRounds": 12
    }
  }
}`
    }
  ];

  const downloadTemplate = (template: Template) => {
    const getFileExtension = (language: string) => {
      switch (language) {
        case 'dockerfile': return '';
        case 'yaml': return '.yml';
        case 'nginx': return '.conf';
        case 'json': return '.json';
        default: return '.txt';
      }
    };

    const fileName = template.id === 'dockerfile' 
      ? 'Dockerfile' 
      : `${template.id}${getFileExtension(template.language)}`;
    
    const blob = new Blob([template.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Déploiement': return 'bg-blue-500';
      case 'Orchestration': return 'bg-purple-500';
      case 'DevOps': return 'bg-green-500';
      case 'Infrastructure': return 'bg-orange-500';
      case 'Monitoring': return 'bg-yellow-500';
      case 'Sécurité': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Templates d'Industrialisation</h2>
        <p className="text-gray-600">
          Fichiers de configuration prêts à utiliser pour déployer CHAPFOODY en production
        </p>
      </div>

      {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
            {category}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="w-5 h-5 text-gray-600" />
                        {template.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    </div>
                    <Badge className={`${getCategoryColor(template.category)} text-white`}>
                      {template.language}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <pre className="text-xs text-gray-700 overflow-x-auto">
                      <code>{template.content.split('\n').slice(0, 8).join('\n')}
                        {template.content.split('\n').length > 8 && '\n...'}
                      </code>
                    </pre>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {template.content.split('\n').length} lignes
                    </div>
                    <Button
                      onClick={() => downloadTemplate(template)}
                      size="sm"
                      className="bg-[#b70f23] hover:bg-[#70070e] text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <FileText className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Instructions d'utilisation
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Téléchargez les templates correspondant à votre infrastructure</li>
                <li>• Adaptez les configurations selon vos besoins spécifiques</li>
                <li>• Remplacez les variables d'environnement par vos valeurs réelles</li>
                <li>• Testez en environnement de développement avant la production</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}