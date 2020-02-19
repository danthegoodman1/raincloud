#! /usr/bin/env node

const configUtils = require("./utils/config")
const dropletUtils = require("./utils/droplets")
const { uniqueNamesGenerator, adjectives, colors, animals } = require("unique-names-generator")

const dropletSizes = [
    "s-1vcpu-1gb",
    "s-1vcpu-2gb",
    "s-1vcpu-3gb",
    "s-2vcpu-2gb",
    "s-3vcpu-1gb",
    "s-2vcpu-4gb",
    "s-4vcpu-8gb",
    "s-6vcpu-16gb",
    "s-8vcpu-32gb",
    "s-12vcpu-48gb",
    "s-16vcpu-64gb",
    "s-20vcpu-96gb",
    "s-24vcpu-128gb",
    "s-32vcpu-192gb"
  ]

require("yargs")
    .command("config [command]", "start the server", (yargs) => {
        yargs
        .command("set [apiKey]", "set api key", (yargs) => {
            yargs.positional("apiKey", {
                "describe": "Set the API Key",
                "default": ""
            })
        }, (argv) => {
            if (!argv.apiKey) {
                console.log("Please provide a valid API key.")
                return
            }
            configUtils.setAPIKey(argv.apiKey)
            .then(() => {
                console.log("Set API Key")
            })
            .catch((error) => {
                console.error("Failed to set API key!")
                console.error(error)
            })
        })
        .command("purge", "delete api key", (yargs) => {
        })
    }, (argv) => {
        if (argv.verbose) {
            console.info(`start server on :${argv.port}`)
        }
        console.log(argv)
    })
    .command("start [size]", "start the server", (yargs) => {
        yargs
        .positional("size", {
            describe: "size of VM - Default: s-1vcpu-1gb",
            default: "s-1vcpu-1gb"
        })
        .option("image", {
            default: 53893572,
            description: "ID of image - Default: 53893572"
        })
        .option("name", {
            default: uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: "-" }),
            description: "Name of droplet - Default: (randomly generated)"
        })
        .option("nowait", {
            default: false,
            description: "Wait for droplet to finish and report IP"
        })
        .option("funtime", {
            alias: "f"
        })
    }, (argv) => {
        if (argv.verbose) {
            console.info(`start server on :${argv.port}`)
        }
        dropletUtils.start(argv.size, argv.nowait, argv.image, argv.name)
    })
    .command("list", "List all droplets", (yargs) => {
        yargs
        .positional("port", {
            describe: "port to bind on",
            default: 5000
        })
        .option("funtime", {
            alias: "f"
        })
    }, (argv) => {
        if (argv.verbose) {
            console.info(`start server on :${argv.port}`)
        }
        dropletUtils.listDroplets()
        .then((dropletTable) => {
            console.log(dropletTable)
        })
        .catch((error) => {
            console.error("Error generating droplet table")
        })
    })
    .command("evaporate [dropletId]", "kill the droplet", (yargs) => {
        yargs
        .positional("dropletId", {
            describe: "droplet id",
        })
    }, (argv) => {
        if (argv.verbose) {
            console.info(`start server on :${argv.port}`)
        }
        dropletUtils.evaporate(argv.dropletId)
        .then(() => {
            console.log(`Deleted droplet ${argv.dropletId}`)
        })
        .catch((error) => {
            console.error(`Failed to delete droplet ${argv.dropletId}:`)
            console.error(error.message)
        })
    })
    .option("verbose", {
        alias: "v",
    })
    .argv
