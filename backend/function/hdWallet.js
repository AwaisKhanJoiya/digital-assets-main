const ethers = require('ethers')
const bip39 = require('bip39')
const HDkey = require('hdkey')
const createHash = require('create-hash')
const bs58check = require('bs58check')
const { json } = require('express/lib/response')
var Mnemonic = require('bitcore-mnemonic')

module.exports.createPhrase = function() {
    const mnemonic = bip39.generateMnemonic()
    console.log(mnemonic)
    return mnemonic
}

// module.exports.confirmPhrase = function(phrase, cPhrase) {
//     if(phrase === cPhrase) {
//         return true
//     }
//     return false
// }

module.exports.createWallet = function(phrase) {
    // console.log("seed = " + bip39.mnemonicToSeed(phrase).toString())
    var valid = Mnemonic.isValid(phrase)
    if(valid == false) {
        return "Invalid mnemonic"
    }
    const hdkey = HDkey.fromMasterSeed(phrase)
    const addrnode = hdkey.derive("m/44'/0'/0'/0")
    // const masterPrivateKey = hdkey.privateExtendedKey
    const masterPrivateKey = hdkey.privateKey.toString('hex')
    console.log(masterPrivateKey)
    const step1 = addrnode._publicKey;
    const step2 = createHash('sha256').update(step1).digest();
    const step3 = createHash('rmd160').update(step2).digest();

    var step4 = Buffer.allocUnsafe(21);
    step4.writeUInt8(0x00, 0);
    step3.copy(step4, 1); //step4 now holds the extended RIPMD-160 result
    const step9 = bs58check.encode(step4);
    console.log('Base58Check: ' + step9);

    return step9
}

module.exports.recoverWallet = function(rPhrase) {
    var valid = Mnemonic.isValid(phrase)
    if(valid == false) {
        return "Invalid mnemonic"
    }
    const hdkey = HDkey.fromMasterSeed(bip39.mnemonicToSeed(rPhrase).toString())
    const addrnode = hdkey.derive("m/44'/0'/0'/0")
    const masterPrivateKey = hdkey.privateKey.toString('hex')
    console.log(masterPrivateKey)
    const step1 = addrnode._publicKey;
    const step2 = createHash('sha256').update(step1).digest();
    const step3 = createHash('rmd160').update(step2).digest();

    var step4 = Buffer.allocUnsafe(21);
    step4.writeUInt8(0x00, 0);
    step3.copy(step4, 1);
    const step9 = bs58check.encode(step4);
    console.log('Base58Check: ' + step9);

    return step9
}