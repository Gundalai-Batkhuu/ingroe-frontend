variable "name" {
  description = "The name prefix for all resources"
  type        = string
  default     = "ai-chat-app-"
}

variable "region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-2"
}

variable "db_username" {
  description = "Username for the RDS instance"
  type        = string
  default     = "gundalai"
}

variable "db_instance_class" {
  description = "The instance class for the RDS instance"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "The allocated storage for the RDS instance in gigabytes"
  type        = number
  default     = 5
}

variable "iam_username" {
  description = "IAM username for S3 access"
  type        = string
  default     = "gdbt-developer"
}

variable "allowed_ip" {
  description = "IP address allowed to access the RDS instance"
  type        = string
  default     = "120.18.98.102"
}

output "db_password" {
  description = "The database password"
  value       = random_password.db_password.result
  sensitive   = true
}