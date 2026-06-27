output "app_public_ip" {
  description = "Public IP of the EC2 app server"
  value       = module.ec2.public_ip
}

output "api_url" {
  description = "Base API URL"
  value       = "http://${module.ec2.public_ip}:8080/api"
}

output "db_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds.db_endpoint
  sensitive   = true
}
