const Do = require("do-wrapper").default
const configUtils = require("./config")
const table = require("table").table

module.exports.start = (dropletSize, nowait, image, name) => {
    return new Promise((resolve, reject) => {
        if (!configUtils.checkConfig()) {
            reject("Config not set")
            return
        }
        configUtils.readAPIKey()
        .then(async (apiKey) => {
            const api = new Do(apiKey)
            const sshKeys = await module.exports.listSSHKeys()
            api.dropletsCreate({
                "name": name,
                "region": "nyc3",
                "size": dropletSize,
                "image": image, // "ubuntu-18-04-x64"
                "ssh_keys": sshKeys,
                "backups": false,
                "ipv6": false,
                "user_data": null,
                "private_networking": null,
                "volumes": null,
                "tags": [

                ]
            })
            .then((res) => {
                console.log(`Started droplet with id: ${res.body.droplet.id} and name: ${name}`)
                resolve()
            })
            .catch(err => {
                console.error(err)
            })
        })
        .catch((error) => {
            reject(error)
        })
    })
}

module.exports.listSSHKeys = () => {
    return new Promise((resolve, reject) => {
        configUtils.readAPIKey()
        .then((apiKey) => {
            const api = new Do(apiKey)
            api.accountGetKeys()
            .then(async (res) => {
                const keyList = res.body.ssh_keys.map((ele, ind) => {
                    return ele.id
                })
                resolve(keyList)
            })
            .catch((error) => {
                reject(error)
            })
        })
        .catch((error) => {
            reject(error)
        })
    })
}

module.exports.listDroplets = () => {
    return new Promise((resolve, reject) => {
        configUtils.readAPIKey()
        .then((apiKey) => {
            const api = new Do(apiKey)
            api.dropletsGetAll()
            .then(async (res) => {
                const dropletList = [["Name", "ID", "Size", "vCPUs", "Disk (GB)", "Memory (MB)", "IP (v4)"]]
                for (const ele of res.body.droplets) {
                    dropletList.push([
                        ele.name,
                        ele.id,
                        ele.size_slug,
                        ele.vcpus,
                        ele.disk,
                        ele.memory,
                        ele.networks.v4[0].ip_address
                    ])
                }
                resolve(table(dropletList))
            })
            .catch((error) => {
                reject(error)
            })
        })
        .catch((error) => {
            reject(error)
        })
    })
}

module.exports.evaporate = (id) => {
    return new Promise((resolve, reject) => {
        configUtils.readAPIKey()
        .then((apiKey) => {
            const api = new Do(apiKey)
            api.dropletsDelete(id)
            .then(() => {
                resolve()
            })
            .catch((error) => {
                reject(error)
            })
        })
        .catch((error) => {
            reject(error)
        })
    })
}

// configUtils.readAPIKey()
// .then((apiKey) => {
//     const api = new Do(apiKey)
//     api.imagesGetAll({type: "distribution"})
//     .then(async (res) => {
//         console.log(res.body)
//     })
//     .catch((error) => {
//         reject(error)
//     })
// })
// .catch((error) => {
//     reject(error)
// })
