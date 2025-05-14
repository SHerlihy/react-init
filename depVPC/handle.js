const { execSync } = require('child_process')

const efsPath = "/mnt/efs"
const createPath = `${efsPath}/create`

//const inBudgetTopicArn=
//const outBudgetTopicArn=

exports.handler = async (event) => {
    const efsFiles = execSync("curl -Is http://www.google.com | head -n 1")

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            message: efsFiles.toString()
        },
    }
}
