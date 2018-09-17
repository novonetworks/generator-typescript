'use strict'
const chalk = require('chalk').default
const dargs = require('dargs')

function isNotEmpty(message) {
    return message !== ''
}

function npmInstallPromise(pkgs, options, spawnOptions) {
    return scheduleInstallTaskPromise.call(
        this,
        'npm',
        pkgs,
        options,
        spawnOptions
    )
}

function scheduleInstallTaskPromise(installer, paths, options, spawnOptions) {
    return new Promise((resolve, reject) => {
        options = options || {}
        spawnOptions = spawnOptions || {}
        paths = Array.isArray(paths) ? paths : (paths && paths.split(' ')) || []

        let args = ['install'].concat(paths).concat(dargs(options))

        // Yarn uses the `add` command to specifically add a package to a project
        if (installer === 'yarn' && paths.length > 0) {
            // noinspection JSValidateTypes
            args[0] = 'add'
        }

        // Only for npm, use a minimum cache of one day
        if (installer === 'npm') {
            args = args.concat(['--cache-min', 24 * 60 * 60])
        }

        // Return early if we're skipping installation
        if (this.options.skipInstall || this.options['skip-install']) {
            this.log(
                'Skipping install command: ' +
                    chalk.yellow(installer + ' ' + args.join(' '))
            )
            return
        }

        // noinspection JSUnresolvedVariable
        this.env.runLoop.add(
            'install',
            done => {
                this.emit(`${installer}Install`, paths)
                this.spawnCommand(installer, args, spawnOptions)
                    .on('error', error => {
                        this.log(
                            chalk.red('Could not finish installation. \n') +
                                'Please install ' +
                                installer +
                                ' with ' +
                                chalk.yellow('npm install -g ' + installer) +
                                ' and try again. \n' +
                                'If ' +
                                installer +
                                ' is already installed, try running the following command manually: ' +
                                chalk.yellow(installer + ' ' + args.join(' '))
                        )
                        if (
                            this.options.forceInstall ||
                            this.options['force-install']
                        ) {
                            this.emit('error', error)
                        }
                        reject(error)
                        done()
                    })
                    .on('exit', (code, signal) => {
                        this.emit(`${installer}Install:end`, paths)
                        if (
                            (code || signal) &&
                            (this.options.forceInstall ||
                                this.options['force-install'])
                        ) {
                            // noinspection JSValidateTypes
                            const error = new Error(
                                `Installation of ${installer} failed with code ${code ||
                                    signal}`
                            )
                            reject(error)
                            this.emit('error', error)
                        } else {
                            resolve()
                        }
                        done()
                    })
            },
            {
                once: installer + ' ' + args.join(' '),
                run: false
            }
        )
    })
}

module.exports = { isNotEmpty, npmInstallPromise }
