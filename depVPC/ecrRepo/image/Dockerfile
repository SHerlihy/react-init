FROM public.ecr.aws/lambda/nodejs:18

ARG ACCESS_KEY
ARG SECRET_KEY

# Install tf
RUN <<EOF
yum install -y yum-utils
yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
yum -y install terraform
mkdir -p ${LAMBDA_TASK_ROOT}/create
EOF

# Copy function code
COPY ./index.js ${LAMBDA_TASK_ROOT}

# Copy create provisioning
COPY ./create/. ${LAMBDA_TASK_ROOT}/create

RUN <<EOF cat > ${LAMBDA_TASK_ROOT}/create/.aws/credentials
[react_showcase_admin]
aws_access_key_id = ${ACCESS_KEY}
aws_secret_access_key = ${SECRET_KEY}
EOF

CMD ["index.handler"]
