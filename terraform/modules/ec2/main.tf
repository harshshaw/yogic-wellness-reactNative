data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

resource "aws_security_group" "app" {
  name        = "${var.app_name}-${var.environment}-app-sg"
  description = "Allow HTTP, HTTPS and SSH"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Restrict to your IP in production
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.app_name}-app-sg" }
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = [aws_security_group.app.id]
  key_name               = var.key_pair_name

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y java-21-amazon-corretto postgresql15-server

    # Init and start PostgreSQL
    postgresql-setup --initdb
    systemctl enable postgresql
    systemctl start postgresql

    # Create DB and user
    sudo -u postgres psql <<SQL
    CREATE USER ${var.db_username} WITH PASSWORD '${var.db_password}';
    CREATE DATABASE ${var.db_name} OWNER ${var.db_username};
    GRANT ALL PRIVILEGES ON DATABASE ${var.db_name} TO ${var.db_username};
    SQL

    # Allow local password auth
    sed -i 's/ident/md5/g' /var/lib/pgsql/data/pg_hba.conf
    systemctl restart postgresql

    # Create app directory and env file
    mkdir -p /opt/karmana
    cat > /opt/karmana/.env <<ENV
DB_HOST=localhost
DB_NAME=${var.db_name}
DB_USERNAME=${var.db_username}
DB_PASSWORD=${var.db_password}
JWT_SECRET=${var.jwt_secret}
ENV

    # Systemd service so app restarts on reboot
    cat > /etc/systemd/system/karmana.service <<SERVICE
[Unit]
Description=Karmana Backend
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=/opt/karmana
EnvironmentFile=/opt/karmana/.env
ExecStart=/usr/bin/java -jar /opt/karmana/app.jar
Restart=on-failure

[Install]
WantedBy=multi-user.target
SERVICE

    systemctl daemon-reload
    systemctl enable karmana
  EOF

  tags = { Name = "${var.app_name}-${var.environment}-server" }
}
