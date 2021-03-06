#!/bin/bash
set -eo pipefail
ARTIFACT_BUCKET=$(cat bucket-name.txt)
STACK_NAME=aizon-api-test-stack
aws cloudformation package --template-file template.yml --s3-bucket $ARTIFACT_BUCKET --output-template-file out.yml
aws cloudformation deploy --template-file out.yml --stack-name $STACK_NAME --capabilities CAPABILITY_NAMED_IAM --parameter-overrides Environment=stage solutionsIndex=owner-key screensIndex=solution_id-key widgetsIndex=screen_id-key
