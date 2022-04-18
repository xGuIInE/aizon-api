if [ -f .env ]
then
  export $(cat .env | xargs)
fi
echo "Generating secret hash..."
SECRET=$(python3 buildSecretHash.py $AWS_ADMIN_USER $AWS_COGNITO_APP_CLIENT $AWS_COGNITO_APP_SECRET)
echo "Secret hash:" $SECRET
aws cognito-idp sign-up --region $AWS_REGION --client-id $AWS_COGNITO_APP_CLIENT --username $AWS_ADMIN_USER --password $AWS_ADMIN_PASSWD --secret-hash $SECRET
echo "User $AWS_ADMIN_USER created."
aws cognito-idp admin-confirm-sign-up --region $AWS_REGION --user-pool-id $AWS_COGNITO_POOL_ID --username $AWS_ADMIN_USER
echo "User $AWS_ADMIN_USER confirmed."
