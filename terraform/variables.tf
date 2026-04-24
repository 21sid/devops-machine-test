variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "rg-microservices-prod"
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "East US"
}

variable "environment" {
  description = "Environment name (dev/staging/production)"
  type        = string
  default     = "production"
}

variable "aks_cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
  default     = "aks-microservices-prod"
}

variable "aks_node_count" {
  description = "Initial node count for AKS default node pool"
  type        = number
  default     = 3
}

variable "aks_node_vm_size" {
  description = "VM size for AKS nodes"
  type        = string
  default     = "Standard_D2s_v3"
}

variable "acr_name" {
  description = "Name of Azure Container Registry (must be globally unique, 5-50 alphanumeric)"
  type        = string
  default     = "acrmicroservicesprod"
}

variable "key_vault_name" {
  description = "Name of Azure Key Vault (must be globally unique)"
  type        = string
  default     = "kv-microservices-prod"
}

variable "mysql_server_name" {
  description = "Name of Azure MySQL Flexible Server"
  type        = string
  default     = "mysql-microservices-prod"
}

variable "mysql_admin_username" {
  description = "Admin username for MySQL"
  type        = string
  default     = "mysqladmin"
  sensitive   = true
}

variable "mysql_admin_password" {
  description = "Admin password for MySQL"
  type        = string
  sensitive   = true
}

variable "mysql_db_name" {
  description = "Name of the MySQL database"
  type        = string
  default     = "microservices_db"
}

variable "vnet_name" {
  description = "Name of the Virtual Network"
  type        = string
  default     = "vnet-microservices-prod"
}

variable "vnet_address_space" {
  description = "Address space for VNet"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "log_analytics_workspace_name" {
  description = "Name of Log Analytics Workspace"
  type        = string
  default     = "law-microservices-prod"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    project     = "microservices"
    environment = "production"
    managed_by  = "terraform"
  }
}
