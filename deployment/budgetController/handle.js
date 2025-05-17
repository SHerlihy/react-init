const { execSync } = require('child_process')

const efsPath = "/mnt/efs"
const createPath = `${efsPath}/create`

exports.handler = async (event) => {
    const efsFiles = execSync(`ls ${createPath}`)

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
