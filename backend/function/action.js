const Web3 = require("web3");
// const path = require("path");
// const fs = require('fs');
const EthereumTx = require("ethereumjs-tx").Transaction;
const axios = require("axios");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/fa1c02fc32294175860ecd67c027b8d8"
  )
);

var url;

module.exports = function () {
  this.getBalance = async function (address) {
    // let balance = await web3.eth.getBalance(address)
    // console.log(balance)
    // return balance
    try {
      return new Promise((resolve, reject) => {
        web3.eth.getBalance(address, async (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(web3.utils.fromWei(result, "ether"));
        });
      });
    } catch (err) {
      throw err;
    }
  };

  this.transferFund = async function (reciever, amountToSend) {
    return new Promise(async (resolve, reject) => {
      sender = "0xa42818B85F483aF3b451719A1B6CF164e1fC26ba";
      var nonce = await web3.eth.getTransactionCount(sender);
      web3.eth.getBalance(sender, async (err, result) => {
        if (err) {
          return reject();
        }
        let balance = web3.utils.fromWei(result, "ether");
        console.log(balance + " ETH");
        console.log(reciever);
        console.log(amountToSend);
        if (balance < amountToSend) {
          console.log("insufficient funds");
          return reject();
        }

        let gasPrices = await getCurrentGasPrices();
        let details = {
          to: reciever,
          value: web3.utils.toHex(
            web3.utils.toWei(amountToSend.toString(), "ether")
          ),
          gas: 21000,
          gasPrice: gasPrices.low * 1000000000,
          nonce: nonce,
          chainId: 4, // EIP 155 chainId - mainnet: 1, rinkeby: 4
        };

        const transaction = new EthereumTx(details, { chain: "rinkeby" });
        let privateKey =
          "7d94f8d51df5cdc910236b89cd218661f6781fcf2e937abb52e8f7fb45661f36";
        let privKey = Buffer.from(privateKey, "hex");
        transaction.sign(privKey);

        const serializedTransaction = transaction.serialize();

        web3.eth.sendSignedTransaction(
          "0x" + serializedTransaction.toString("hex"),
          (err, id) => {
            if (err) {
              console.log(err);
              return reject();
            }
            url = `https://rinkeby.etherscan.io/tx/${id}`;
            console.log(url);
            resolve({ id: id, link: url });
            return url;
          }
        );
      });
    });
  };

  async function getCurrentGasPrices() {
    let response = await axios.get(
      "https://ethgasstation.info/json/ethgasAPI.json"
    );
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10,
    };
    return prices;
  }
};
