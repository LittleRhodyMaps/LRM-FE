#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

export AWS_PROFILE="${AWS_PROFILE:-dev}"

BUCKET=$(terraform -chdir=terraform output -raw s3_bucket_name)
DISTRIBUTION_ID=$(terraform -chdir=terraform output -raw cloudfront_distribution_id)

echo "==> Syncing ./out to s3://$BUCKET (profile: $AWS_PROFILE)"
aws s3 sync out/ "s3://$BUCKET" --delete

echo "==> Invalidating CloudFront distribution $DISTRIBUTION_ID"
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"

echo "==> Done"
