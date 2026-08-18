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

output "acm_validation_records" {
  description = "DNS validation records to add in Cloudflare (Type CNAME, Proxy status DNS-only) before the ACM cert can validate"
  value = {
    for dvo in aws_acm_certificate.site.domain_validation_options : dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  }
}

output "cloudflare_dns_records_needed" {
  description = "DNS records to add in Cloudflare (Proxy status: DNS only / grey cloud) pointing the domain at CloudFront"
  value = merge(
    {
      (var.domain_name) = {
        type  = "CNAME"
        value = aws_cloudfront_distribution.site.domain_name
        note  = "Cloudflare flattens CNAMEs at the apex automatically, so this works even at the root domain."
      }
    },
    {
      for sub in var.subject_alternative_names :
      sub => {
        type  = "CNAME"
        value = aws_cloudfront_distribution.site.domain_name
        note  = ""
      }
    }
  )
}
