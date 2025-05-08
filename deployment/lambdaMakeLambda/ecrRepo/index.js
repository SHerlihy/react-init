exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
//
// const { execSync } = require('child_process')
//
//
// //const inBudgetTopicArn=
// //const outBudgetTopicArn=
//
// exports.handler = async (event) => {
//     execSync("terraform apply -chdir=/usr/src/create --auto-approve")
//     // for (const record of event.Records) {
//     //     if (record.topic !== inBudgetTopicArn) {
//     //         continue
//     //     }
//     //
//     //     execSync("terraform apply --auto-approve")
//     //     const tfState = execSync("cat ./terraform.tfstate")
//     //
//     //     return {
//     //         statusCode: 200,
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //         },
//     //         body: {
//     //             massage: tfState.toString()
//     //         },
//     //     }
//     // }
//     //
//     // execSync("terraform destroy --auto-approve")
//     //
//     // return {
//     //     statusCode: 200,
//     //     headers: {
//     //         'Content-Type': 'application/json',
//     //     },
//     //     body: {
//     //         massage: "destroy called"
//     //     },
//     // }
// }
