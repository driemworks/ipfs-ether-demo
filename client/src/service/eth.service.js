import { localStorageConstants, HD_PATH_STRING, irisResources } from "../constants";
import passworder from 'browser-passworder';
import lightwallet from 'eth-lightwallet';

import store from '../state/store/index';
import { setVaultVars } from '../state/actions/index';
import { uploadDirectory } from '../constants';
import { IPFSDatabase } from '../db/ipfs.db';

export const EthService = {

    async initVault(password, alias) {
        // get encrypted seedphrase
        // const encryptedSeedPhrase = localStorage.getItem(localStorageConstants.MNEMONIC);
        // const seedPhrase = await passworder.decrypt(password, encryptedSeedPhrase);
        const seedPhrase = await getSeedPhrase(password);
        console.log(seedPhrase);
        // decrypt with password
        lightwallet.keystore.createVault({ 
            password: password, hdPathString: HD_PATH_STRING, seedPhrase: seedPhrase
          }, async (err, ks) => {
            if (err) throw err;
            ks.keyFromPassword(password, async (err, pwDerivedKey) => {
              if (!ks.isDerivedKeyCorrect(pwDerivedKey)) {
                throw new Error('Incorrect derived key!');
              }

              ks.generateNewAddress(pwDerivedKey, 1);
              const address = ks.getAddresses()[0];

              // create uploads directory
              const uploadsDir = uploadDirectory(address);
              await IPFSDatabase.createDirectory(uploadsDir);
              // create aliases file

              // add to master aliases file
              updateMasterAliasList(alias, address);

              store.dispatch(setVaultVars(
                {
                  ks           : ks,
                  pwDerivedKey : pwDerivedKey,
                  address      : address,
                  alias        : alias
                }
              ));
            });
          });
    }

}

async function getSeedPhrase(password) {
    const safeSeedPhrase = localStorage.getItem(localStorageConstants.MNEMONIC);
    let seedPhrase = '';
    if (safeSeedPhrase) {
      // decrypt and use it with password to create vault
      seedPhrase = await passworder.decrypt(password, safeSeedPhrase);
    } else {
      // generete mnemonic
      const bip39 = require('bip39');
      seedPhrase = bip39.generateMnemonic();
      // browser-passworder to encrypt it
      const safeSeedPhrase = await passworder.encrypt(password, seedPhrase);
      // add seed to local storage
      localStorage.setItem(localStorageConstants.MNEMONIC, safeSeedPhrase);
    }
    return seedPhrase;
}

async function updateMasterAliasList(alias, address) {
  // try to read file
  const aliasDir = irisResources();
  const newLine = alias + '|' + address + '\n';
  try {
      let aliasMasterFile = await IPFSDatabase.readFile(aliasDir + 'aliases.txt');
      aliasMasterFile += newLine;
      await IPFSDatabase.deleteFile(aliasDir + 'aliases.txt');
      await IPFSDatabase.addFile(aliasDir, Buffer.from(aliasMasterFile), 'aliases.txt');
  } catch (e) {
      await IPFSDatabase.addFile(aliasDir, Buffer.from(newLine), 'aliases.txt');
  }
}

export default EthService;