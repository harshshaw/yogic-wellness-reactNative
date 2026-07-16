variable "app_name"         { type = string }
variable "environment"      { type = string }
variable "vpc_id"           { type = string }
variable "public_subnet_id" { type = string }
variable "key_pair_name"    { type = string }
variable "db_name"          { type = string }
variable "db_username"      { type = string }
variable "db_password" {
  type      = string
  sensitive = true
}
variable "jwt_secret" {
  type      = string
  sensitive = true
}
