import React from "react";
import { ContractService } from '../../service/contract.service';
// import { ContractUtils } from '../../utils/contract.utils';
import { EncryptionUtils } from '../../encryption/encrypt.service';
import { IPFSDatabase } from '../../db/ipfs.db';
import {
  encodeBase64
} from 'tweetnacl-util';

import { If, Else } from 'rc-if-else';
import './generateKeys.component.css';

class GenerateKeys extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ethereumAccountId: props.ethereumAccountId,
            alias: "",
            contractAddress: "",
            creatingAlias: false,
        };
    }

    componentDidMount = async () => {
        // const web3 = await getWeb3();
        // this.setState({web3});
        console.log('selected account ' + this.props.ethereumAccountId);
    }

    generateKeys = async() => {
        console.log('generating key pairs');
        const pairA = await EncryptionUtils.generateKeyPair();
        let publicKey = pairA.publicKey;
        let secretKey = pairA.secretKey;
        console.log('keys generated!')

        console.log('deploying contract for account: ' + this.props.ethereumAccountId);
        this.setState({ keysGenerated: true });
        const publicKeyAsString = encodeBase64(publicKey);
        const privateKeyAsString = encodeBase64(secretKey);
        const instance = await ContractService.deployContract(10000, this.props.web3, publicKeyAsString, 
            privateKeyAsString, this.props.ethereumAccountId);
        const contractAddress = instance.address;
        console.log('deployed contract successfully ' + contractAddress);
        this.props.action(contractAddress);
        this.setState({ contractAddress });
        // create ipfs file and upload
        const directory = '/content/' + this.props.ethereumAccountId;
        // IPFSDatabase.deleteDirectory('/content/' + this.props.ethereumAccountId);
        // create directories
        IPFSDatabase.createDirectory(directory);
        IPFSDatabase.createDirectory(directory + '/contract');
        IPFSDatabase.createDirectory(directory + '/inbox');
        console.log('Creating contract file');
        await IPFSDatabase.addFile(directory + '/contract/', 
            Buffer.from(contractAddress), 'contract.txt', (err, res) => {
            console.log(JSON.stringify(res)); 
        });
    }
    render() {
        return (
            <div className="generate-keys-container">
                <If condition={this.props.ethereumAccountId !== ""}>
                    <If condition={this.state.contractAddress === ""}>
                            <div className="keys-container">
                                <p>
                                    Generate encryption keys to allow you to send encrypted files.
                                    This will cost ethereum.
                                </p>
                                <button className="btn generate-keys-btn" onClick={this.generateKeys.bind(this)}>
                                    Generate Keys
                                </button>
                            </div>
                    </If>
                </If>
            </div>
        );
    }
}

export default GenerateKeys;
