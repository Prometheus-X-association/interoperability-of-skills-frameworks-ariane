resource "kubernetes_deployment" "api_deployment" {
  metadata {
    name      = "api"
    namespace = var.namespace
    labels = {
      App = "api"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        App = "api"
      }
    }
    template {
      metadata {
        labels = {
          App = "api"
        }
      }
      spec {
        container {
          name  = "api"
          image             = "ariane-api:latest"
          image_pull_policy = "Never"
          port {
            container_port = 8000
          }

          env {
            name  = "API_ENVIRONMENT"
            value = "dev"
          }
          env {
            name  = "ES_CONNECTION_STRING"
            value = "http://elasticsearch-service:9200"
          }
          env {
            name  = "ES_API_KEY_1"
            value = "apikeyId"
          }
          env {
            name  = "ES_API_KEY_2"
            value = "apikeySecret"
          }
          env {
            name  = "API_INDICE_MAPPING"
            value = "edge_mappings"
          }
          env {
            name  = "API_SECRET_KEY"
            value = "a7f54409ca562f0cd342202cbd2f717df78bfb5105a08036fd998adcd6385e32"
          }
          env {
            name  = "API_ALGORITHM"
            value = "HS256"
          }
          env {
            name  = "API_ACCESS_TOKEN_EXPIRE_MINUTES"
            value = 30
          }
          env {
            name  = "API_DATABASE_URL"
            value = "postgresql://app_user:!ChangeMe!@database-service:5432/app_db"
          }
          env {
            name  = "API_ESCO_HELPER_URL"
            value = "http://esco-helper-service:8080"
          }
          
        }
      }
    }
  }
}


resource "kubernetes_service" "api_service" {
  metadata {
    name      = "api-service"
    namespace = var.namespace
  }

  spec {
    selector = {
      App = "api"
    }
    port {
      port        = 8000
      target_port = 8000
    }
    # Minikube often works best with NodePort or LoadBalancer (which Minikube emulates)
    # Using NodePort allows you to access the service via `minikube service`
    type = "NodePort"
  }
}

# 3. Output the connection information
output "minikube_api_access" {
  description = "Use this command to get the external IP and port for the service."
  value       = "minikube service ${kubernetes_service.api_service.metadata[0].name}"
}