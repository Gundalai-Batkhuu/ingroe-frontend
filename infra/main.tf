provider "aws" {
  region = var.region
}

################################################################################
# S3 bucket
################################################################################

resource "aws_s3_bucket" "this" {
  bucket_prefix = var.name
}

resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "AllowIAMUserAccess",
        Effect = "Allow",
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/${var.iam_username}"
        },
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ],
        Resource = [
          aws_s3_bucket.this.arn,
          "${aws_s3_bucket.this.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

################################################################################
# RDS Module
################################################################################

resource "random_password" "db_password" {
  length  = 16
  special = false
}

resource "aws_db_instance" "this" {
  identifier_prefix       = var.name
  engine                  = "postgres"
  instance_class          = var.db_instance_class
  allocated_storage       = var.db_allocated_storage
  db_name                 = replace(var.name, "-", "_")
  username                = var.db_username
  password                = random_password.db_password.result
  port                    = 5432
  publicly_accessible     = true
  vpc_security_group_ids  = [aws_security_group.postgres.id]

  skip_final_snapshot     = true

  deletion_protection     = false
}

################################################################################
# Supporting Resources
################################################################################

data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "postgres" {
  name        = "${var.name}-allow-postgres"
  description = "Allow PostgreSQL inbound traffic"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "PostgreSQL from anywhere"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow from anywhere
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_caller_identity" "current" {}
