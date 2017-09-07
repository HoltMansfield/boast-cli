npm link (in the folder of boast-cli)

npm link boast-cli (in the folder where I want to use boast-cli)





Example of running npm link =>

ErikaWSs-MacBook-Pro:srs-patient-server erikaws$ npm link boast-cli
/Users/erikaws/work/srs-patient-server/node_modules/boast-cli -> /usr/local/lib/node_modules/boast-cli -> /Users/erikaws/work/boast-cli

You can then take that path and run this =>

ErikaWSs-MacBook-Pro:srs-patient-server erikaws$ node /usr/local/lib/node_modules/boast-cli
