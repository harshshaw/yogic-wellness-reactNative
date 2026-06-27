output "public_ip" { value = aws_instance.app.public_ip }
output "app_sg_id" { value = aws_security_group.app.id }
