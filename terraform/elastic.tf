resource "kubernetes_deployment" "elasticsearch_deployment" {
  metadata {
    name   = "elasticsearch"
    labels = { App = "elasticsearch" }
  }
  spec {
    selector { match_labels = { App = "elasticsearch" } }
    replicas = 1
    template {
      metadata { labels = { App = "elasticsearch" } }
      spec {
        container {
          name  = "elasticsearch"
          image = "docker.elastic.co/elasticsearch/elasticsearch:8.6.2"
          port { container_port = 9200 }

          env {
            name  = "discovery.type"
            value = "single-node"
          }
          env {
            name  = "bootstrap.memory_lock"
            value = "true"
          }
          env {
            name  = "xpack.security.enabled"
            value = "false"
          }
          env {
            name  = "ingest.geoip.downloader.enabled"
            value = "false"
          }
          env {
            name  = "ES_JAVA_OPTS"
            value = "-Xms512m -Xmx512m"
          }
          env {
            name  = "logger.level"
            value = "ERROR"
          }

        #   volume_mount {
        #     name       = "elasticsearch-data-volume"
        #     mount_path = "/usr/share/elasticsearch/data"
        #   }

          # Translates Compose Health Check
          readiness_probe {
            http_get {
              path = "/_cluster/health"
              port = 9200
            }
            initial_delay_seconds = 60
          }
        }

        # Ulimits are handled via the Pod's securityContext in K8s, but often 
        # complex; we omit the ulimits for simplicity in Minikube, or rely on 
        # a privileged container setup (out of scope).

        # volume {
        #   name = "elasticsearch-data-volume"
        #   persistent_volume_claim { claim_name = kubernetes_persistent_volume_claim.elasticsearch_data_pvc.metadata[0].name }
        # }
      }
    }
  }
}

resource "kubernetes_service" "elasticsearch_service" {
  metadata { name = "elasticsearch-service" }
  spec {
    selector = { App = "elasticsearch" }
    port {
      port        = 9200
      target_port = 9200
      node_port   = 30200
    }
    type = "NodePort"
  }
}
