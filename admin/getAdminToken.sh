if [ -f .env ]
then
    export $(cat .env | xargs)
fi
SECRET=$(python3 buildSecretHash.py $AWS_ADMIN_USER $AWS_COGNITO_APP_CLIENT $AWS_COGNITO_APP_SECRET)

aws cognito-idp admin-initiate-auth --user-pool-id $AWS_COGNITO_POOL_ID --client-id $AWS_COGNITO_APP_CLIENT \
    --auth-flow ADMIN_NO_SRP_AUTH \
    --auth-parameters USERNAME=$AWS_ADMIN_USER,PASSWORD=$AWS_ADMIN_PASSWD,SECRET_HASH=$SECRET \
    > tokenId.json
