resource "kubernetes_deployment" "ui_deployment" {
  metadata {
    name      = "ui"
    namespace = var.namespace
    labels = {
      App = "ui"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        App = "ui"
      }
    }
    template {
      metadata {
        labels = {
          App = "ui"
        }
      }
      spec {
        container {
          name              = "ui"
          image             = "ariane-ui:latest"
          image_pull_policy = "Never"
          port {
            container_port = 8501
          }

          env {
            name  = "ES_CLOUD_ID"
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
            name  = "TRANSLATOR_API_URL"
            value = "http://api-service:8000"
          }

        }
      }
    }
  }
}


resource "kubernetes_service" "ui_service" {
  metadata {
    name      = "ui-service"
    namespace = var.namespace
  }

  spec {
    selector = {
      App = "ui"
    }
    port {
      port        = 8501
      target_port = 8501
    }
    # Minikube often works best with NodePort or LoadBalancer (which Minikube emulates)
    # Using NodePort allows you to access the service via `minikube service`
    type = "NodePort"
  }
}

# 3. Output the connection information
output "minikube_ui_access" {
  description = "Use this command to get the external IP and port for the service."
  value       = "minikube service ${kubernetes_service.ui_service.metadata[0].name}"
}
