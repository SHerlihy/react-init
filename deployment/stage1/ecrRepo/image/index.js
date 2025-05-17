const { execSync } = require('child_process')
const fs = require('fs');

const efsPath = "/mnt/efs"
const createPath = `${efsPath}/create`

//const inBudgetTopicArn=
//const outBudgetTopicArn=

exports.handler = async (event) => {
    execSync(`rm -rf ${createPath}`)
    execSync(`mkdir -p ${createPath}`)
    execSync(`cp -a ./create/. ${createPath}`)

    execSync(`terraform -chdir=${createPath} init`)
    execSync(`chmod +x ${createPath}/.terraform/providers/registry.terraform.io/hashicorp/*`)
    execSync(`terraform -chdir=${createPath} apply --auto-approve`)
    // for (const record of event.Records) {
    //     if (record.topic !== inBudgetTopicArn) {
    //         continue
    //     }
    //
    //     execSync("terraform apply --auto-approve")
    //     const tfState = execSync("cat ./terraform.tfstate")
    //
    //     return {
    //         statusCode: 200,
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: {
    //             massage: tfState.toString()
    //         },
    //     }
    // }
    //
    // execSync("terraform destroy --auto-approve")
    //
    // return {
    //     statusCode: 200,
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: {
    //         massage: "destroy called"
    //     },
    // }
}
