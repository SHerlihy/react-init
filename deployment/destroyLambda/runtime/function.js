const {exec} = require('child_process')

module.exports.handler = async (event) => {
    exec("cd destroy")
    exec("terraform destroy --auto-approve")
}
