variable "aws_region" {
  description = "AWS region for the S3 bucket"
  type        = string
  default     = "us-east-2"
}

variable "project_name" {
  description = "Name used to prefix created resources"
  type        = string
  default     = "lrm-fe"
}

variable "environment" {
  description = "Deployment environment (e.g. production, staging)"
  type        = string
  default     = "production"
}

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}

variable "default_root_object" {
  description = "Object returned when a viewer requests the root URL"
  type        = string
  default     = "index.html"
}
