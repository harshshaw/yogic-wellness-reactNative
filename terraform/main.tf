terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state — enable once you have an S3 bucket for state
  # backend "s3" {
  #   bucket = "karmana-terraform-state"
  #   key    = "prod/terraform.tfstate"
  #   region = var.aws_region
  # }
}

provider "aws" {
  region = var.aws_region
}

# ── Networking ────────────────────────────────────────────────────────────────
module "networking" {
  source      = "./modules/networking"
  app_name    = var.app_name
  environment = var.environment
}

# ── EC2 / App Server (PostgreSQL runs on same instance) ───────────────────────
module "ec2" {
  source      = "./modules/ec2"
  app_name    = var.app_name
  environment = var.environment

  vpc_id            = module.networking.vpc_id
  public_subnet_id  = module.networking.public_subnet_ids[0]
  key_pair_name     = var.key_pair_name

  db_name     = var.db_name
  db_username = var.db_username
  db_password = var.db_password
  jwt_secret  = var.jwt_secret
}
