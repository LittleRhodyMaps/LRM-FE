output "s3_bucket_name" {
  description = "Name of the S3 bucket to upload the build output to"
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (useful for cache invalidations)"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "Default *.cloudfront.net domain the site is served from"
  value       = aws_cloudfront_distribution.site.domain_name
}
