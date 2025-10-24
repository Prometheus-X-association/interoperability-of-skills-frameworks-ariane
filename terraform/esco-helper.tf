resource "kubernetes_deployment" "esco-helper_deployment" {
  metadata {
    name      = "esco-helper"
    namespace = var.namespace
    labels = {
      App = "esco-helper"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        App = "esco-helper"
      }
    }
    template {
      metadata {
        labels = {
          App = "esco-helper"
        }
      }
      spec {
        container {
          name  = "esco-helper"
          image             = "ariane-esco-helper:latest"
          image_pull_policy = "Never"
          port {
            container_port = 8080
          }

          env {
            name  = "PORT"
            value = 8080
          }
          env {
            name  = "IP"
            value = "0.0.0.0"
          }
          env {
            name  = "ESCO_FILES_LOCATION"
            value = "https://storage.googleapis.com/esco-tables-headai"
          }
          env {
            name  = "ESCO_FILES_PREFIX"
            value = "esco_labels_expanded"
          }
        }
      }
    }
  }
}


resource "kubernetes_service" "esco-helper_service" {
  metadata {
    name      = "esco-helper-service"
    namespace = var.namespace
  }

  spec {
    selector = {
      App = "esco-helper"
    }
    port {
      port        = 8080
      target_port = 8080
    }
    # Minikube often works best with NodePort or LoadBalancer (which Minikube emulates)
    # Using NodePort allows you to access the service via `minikube service`
    type = "NodePort"
  }
}

# 3. Output the connection information
output "minikube_esco-helper_access" {
  description = "Use this command to get the external IP and port for the service."
  value       = "minikube service ${kubernetes_service.esco-helper_service.metadata[0].name}"
}