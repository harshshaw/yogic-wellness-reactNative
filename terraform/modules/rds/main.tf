resource "aws_db_subnet_group" "main" {
  name       = "${var.app_name}-${var.environment}-db-subnet"
  subnet_ids = var.private_subnet_ids
  tags       = { Name = "${var.app_name}-db-subnet-group" }
}

resource "aws_security_group" "rds" {
  name        = "${var.app_name}-${var.environment}-rds-sg"
  description = "Allow Postgres from app server only"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.app_sg_id]
  }

  tags = { Name = "${var.app_name}-rds-sg" }
}

resource "aws_db_instance" "main" {
  identifier        = "${var.app_name}-${var.environment}-db"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = "db.t3.micro"
  allocated_storage = 20

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  skip_final_snapshot     = false
  final_snapshot_identifier = "${var.app_name}-final-snapshot"
  backup_retention_period = 7
  deletion_protection     = true
  publicly_accessible     = false

  tags = { Name = "${var.app_name}-${var.environment}-db" }
}
