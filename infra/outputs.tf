output "s3_bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.this.id
}

################################################################################
# .env file creation/update
################################################################################

resource "local_file" "dotenv" {
  filename = "${path.module}/.env"
  content  = <<-EOT
S3_BUCKET_NAME=${aws_s3_bucket.this.id}
DB_HOST=${split(":", aws_db_instance.this.endpoint)[0]}
DB_NAME=${aws_db_instance.this.db_name}
DB_USER=${aws_db_instance.this.username}
DB_PORT=${aws_db_instance.this.port}
DB_PASSWORD=${random_password.db_password.result}
  EOT
}