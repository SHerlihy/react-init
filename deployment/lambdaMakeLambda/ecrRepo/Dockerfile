ARG ACCESS_KEY
ARG SECRET_KEY

FROM public.ecr.aws/lambda/nodejs:18

# Copy function code
COPY ./index.js ${LAMBDA_TASK_ROOT}

# Install tf
RUN <<EOF
yum install -y yum-utils
yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
yum -y install terraform
EOF

# Copy create provisioning
COPY ./createLayer/* ./usr/src/create

RUN <<EOF
export AWS_ACCESS_KEY_ID=${ACCESS_KEY}
export AWS_SECRET_ACCESS_KEY=${SECRET_KEY}
export TF_DATA_DIR=/tmp
mkdir /usr/src/create
terraform -chdir=/usr/src/create init
EOF

CMD ["index.handler"]
