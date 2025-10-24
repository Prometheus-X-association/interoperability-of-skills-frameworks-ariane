resource "kubernetes_deployment" "database_deployment" {
  metadata {
    name      = "database"
    namespace = var.namespace
    labels = {
      App = "database"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        App = "database"
      }
    }
    template {
      metadata {
        labels = {
          App = "database"
        }
      }
      spec {
        container {
          name  = "database"
          image = "postgres:16-alpine"

          env {
            name  = "POSTGRES_DB"
            value = "app_db"
          }
          env {
            name  = "POSTGRES_USER"
            value = "app_user"
          }
          env {
            name  = "POSTGRES_PASSWORD"
            value = "!ChangeMe!"
          }

          port {
            container_port = 5432
          }
        }
      }
    }
  }
}


resource "kubernetes_service" "database_service" {
  metadata {
    name      = "database-service"
    namespace = var.namespace
  }

  spec {
    selector = {
      App = "database"
    }
    port {
      port        = 5432
      target_port = 5432
    }
    # Minikube often works best with NodePort or LoadBalancer (which Minikube emulates)
    # Using NodePort allows you to access the service via `minikube service`
    type = "NodePort"
  }
}

# 3. Output the connection information
output "minikube_database_access" {
  description = "Use this command to get the external IP and port for the service."
  value       = "minikube service ${kubernetes_service.database_service.metadata[0].name}"
}
