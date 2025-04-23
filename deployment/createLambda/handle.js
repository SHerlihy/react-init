const fs = require('fs');

const ROOT_PATH = "/serverless_lambda_stage/"

module.exports.handler = async (event) => {
    const filePath = event.path.replace(ROOT_PATH, "")

    if (filePath === "index") {
        const html = fs.readFileSync('index.html', { encoding: 'utf8' })
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html',
            },
            body: html,
        }
    }

    const ext = filePath.substring((filePath.lastIndexOf('.') + 1));
    switch (ext) {
        case "js":
            const js = fs.readFileSync(filePath, { encoding: 'utf8' })
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/javascript',
                },
                body: js,
            }
        case "css":
            const css = fs.readFileSync(filePath, { encoding: 'utf8' })
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/css',
                },
                body: css,
            }
        default:
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    massage: "Not found"
                },
            }
    }
}
