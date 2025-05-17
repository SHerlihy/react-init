#!/bin/bash

ACCESS_KEY="$1"
SECRET_KEY="$2"

cd ./stage1

terraform apply --auto-approve
terraform output > output.tfvars

cd ..

./stage1/ecrRepo/ecrUpload ${ACCESS_KEY} ${SECRET_KEY} $(terraform -chdir=./stage1 output -raw ecr_uri)

cd ./budgetController

terraform apply -var-file="../stage1/output.tfvars" --auto-approve
