output "app_public_ip" {
  description = "Public IP of the EC2 app server"
  value       = module.ec2.public_ip
}

output "api_url" {
  description = "Base API URL"
  value       = "http://${module.ec2.public_ip}:8080/api"
}

output "db_host" {
  description = "PostgreSQL runs locally on EC2"
  value       = "localhost"
}
