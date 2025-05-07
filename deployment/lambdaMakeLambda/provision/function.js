const {execSync} = require('child_process')

module.exports.handler = async (event) => {
    const wd = execSync("terraform -v")
      return {
        statusCode: 404,
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            massage: wd.toString()
        },
    }
}
