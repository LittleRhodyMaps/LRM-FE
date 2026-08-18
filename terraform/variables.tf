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

variable "domain_name" {
  description = "Apex domain to serve the site on, DNS hosted at Cloudflare"
  type        = string
  default     = "littlerhodymaps.com"
}

variable "subject_alternative_names" {
  description = "Additional hostnames (besides domain_name) covered by the ACM cert and CloudFront aliases"
  type        = list(string)
  default     = ["www.littlerhodymaps.com"]
}
