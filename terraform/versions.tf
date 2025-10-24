terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.6.2"
    }
  }

  required_version = ">= 1.0.0"
}

# The Kubernetes provider reads the context from your local Kubeconfig file
# (usually ~/.kube/config), which should be pointing to your running Minikube cluster.
provider "kubernetes" {
    config_path = "~/.kube/config"
    config_context = "minikube"
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}