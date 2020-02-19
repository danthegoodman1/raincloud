const fs = require("fs")
const path = require("path")

/**
 * @function
 * @returns {Boolean} True/False if config exists
 * @description Checks if config has required information
 */
module.exports.checkConfig = () => {
    return fs.existsSync(path.join(__dirname, "./c.json"))
}

/**
 * @function
 * @returns {Promise}
 * @description Sets the API key for DigitalOcean
 * @param {String} apiKey API Key
 */
module.exports.setAPIKey = (apiKey) => {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFileSync(path.join(__dirname, "./c.json"), JSON.stringify({apiKey: Buffer.from(apiKey).toString("base64")}), {
                flag: "w"
            })
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

module.exports.purgeAPIKey = () => {
    return new Promise((resovle, reject) => {
        try {
            fs.unlinkSync(path.join(__dirname, "./c.json"))
            resolve()
        } catch (error) {
            reject("No API Key stored")
        }
    })
}

/**
 * @function
 * @returns {Promise} Containing API Key
 * @description Reads the API Key
 */
module.exports.readAPIKey = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve(Buffer.from(JSON.parse(fs.readFileSync(path.join(__dirname, "./c.json"), {encoding: "utf-8"})).apiKey, "base64").toString())
        } catch (error) {
            reject(error)
        }
    })
}
