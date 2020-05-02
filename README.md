# IRIS

Powered by
<div>
  <img src="https://github.com/driemworks/ipfs-ether-demo/blob/master/resources/ipfs-logo.png" width="250" height="250" >
  <img src="https://github.com/driemworks/ipfs-ether-demo/blob/master/resources/ethereum.jpg" width="250" height="250" />
</div>

### Try the demo at https://iris-app.de/
<br>
Iris is a decentralized web application providing functionality to store and share encrypted data in IPFS. The ultimate goal is to build a decentralized digital content marketplace. 

## How
* Generates a new ethereum account for each user using eth-lightwallet
* Encrypts data with eth-lightwallet before uploading to IPFS

## Development recomendations

* Development is easiest in a linux based environment (windows presents many issues related to node-gyp).

## Roadmap
* [x] Ethereum based user management
* [x] Upload/Download/Share encrypted files from IPFS
* [-] add funds to ethereum wallet
* [-] apply paywall or other contract to files

## SETUP

### Local Dev setup

* Running the app
  * setup local IPFS node
  * To run iris locally
    * navigate to the `client` directory and execute `npm install` and then `npm start`
  * contracts are stored in the contracts directory

## Local Development

* if you encounter errors.js 183 then run `echo fs.inotify.max_user_watches=524288 | sudo      tee -a /etc/sysctl.conf && sudo sysctl -p`

* to clear ipfs files uploaded locally, run:

  * ``` bash
      ipfs pin ls --type recursive | cut -d' ' -f1 | xargs -n1 ipfs pin rm
      ipfs repo gc
    ```

* From the root directory, run `npm install`
  * NOTE: for now, having the nested client dir is NOT needed, so this may change in the future
* navigate to the client directory and run `npm start`

## Testing

* Todo

* Contract tests
  * run `ganache cli`
  * After migrating contract to the blockchain with `truffle deploy` test contracts with `truffle test`
