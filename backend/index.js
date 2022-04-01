const hdWallet = require("./function/hdWallet");
const tokenListFunc = require("./function/tokenListFunc.js");
const express = require("express");
let cors = require("cors");

const tokenList = new tokenListFunc();

const router = express.Router();
const app = express();
const PORT = process.env.PORT || 8000;

var phrase;
var wallet;

router.get("/", function (req, res) {
  res.send("Hello world!");
});

router.get("/hdWallet/createPhrase", async (req, res) => {
  phrase = hdWallet.createPhrase();
  res.send(phrase);
});

router.get("/hdWallet/confirmPhrase", function (req, res) {
  if (hdWallet.confirmPhrase(phrase, req.query.phrase)) {
    res.send("true");
  } else {
    res.send("false");
  }
});

router.get("/hdWallet/createWallet", async (req, res) => {
  const addr = hdWallet.createWallet(req.query.phrase);
  res.send(addr);
});

router.get("/hdWallet/recoverWallet", async (req, res) => {
  const addr = hdWallet.recoverWallet(req.query.phrase);
  res.send(addr);
});

router.get("/token/getBlockNumber", async (req, res) => {
  let bn = await tokenList.getBlockNumber();
  res.send(bn.toString());
});

router.get("/token/getTokenName", async (req, res) => {
  let tokenName = await tokenList.getTokenName(req.query.address);
  res.send(tokenName);
});

router.get("/token/getTokenSymbol", async (req, res) => {
  let tokenSymbol = await tokenList.getTokenSymbol(req.query.address);
  res.send(tokenSymbol);
});

router.get("/token/getPriceETHV2", async (req, res) => {
  let price = await tokenList.getPriceETHV2(req.query.address);
  res.send(price.toString());
});

router.get("/token/getPriceUSDV2", async (req, res) => {
  let price = await tokenList.getPriceUSDV2(req.query.address);
  res.send(price.toString());
});

router.get("/token/getPriceETHV3", async (req, res) => {
  let price = await tokenList.getPriceETHV3(req.query.address);
  res.send(price.toString());
});

router.get("/token/getPriceUSDV3", async (req, res) => {
  let price = await tokenList.getPriceUSDV3(req.query.address);
  res.send(price.toString());
});

app.use(cors());
app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
