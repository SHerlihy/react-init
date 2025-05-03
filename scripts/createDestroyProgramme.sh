#!/bin/sh

cp $1/main.tf $2
cp $1/terraform.tfstate $2
cp -r $1/dist $2
