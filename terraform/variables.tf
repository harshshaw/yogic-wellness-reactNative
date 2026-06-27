variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ap-south-1" # Mumbai — closest to India
}

variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
  default     = "karmana"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "karmana"
}

variable "db_username" {
  description = "PostgreSQL master username"
  type        = string
  default     = "karmana"
}

variable "db_password" {
  description = "PostgreSQL master password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret (min 32 characters)"
  type        = string
  sensitive   = true
}

variable "key_pair_name" {
  description = "EC2 SSH key pair name (must exist in AWS)"
  type        = string
  default     = "karmana-key"
}
