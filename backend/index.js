const hdWallet = require("./function/hdWallet");
const httpStatus = require("http-status");
const tokenListFunc = require("./function/tokenListFunc.js");
const ApiError = require("./utils/ApiError");
const express = require("express");
const catchAsync = require("./utils/catchAsync");
const morgan = require("./config/morgan");
const { errorConverter, errorHandler } = require("./middlewares/error");

let cors = require("cors");

const tokenList = new tokenListFunc();

const router = express.Router();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
var phrase;
var wallet;

router.get("/", function (req, res) {
  res.send("Hello world!");
});

router.get(
  "/hdWallet/createPhrase",
  catchAsync(async (req, res) => {
    phrase = hdWallet.createPhrase();
    if (phrase) {
      res.status(httpStatus.CREATED).send(phrase);
    } else {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "We are facing some error, Please try again"
      );
    }
  })
);

router.get("/hdWallet/confirmPhrase", function (req, res) {
  if (hdWallet.confirmPhrase(phrase, req.query.phrase)) {
    res.status(httpStatus.OK).send("true");
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid mnemonic");
  }
});

router.get("/hdWallet/createWallet", (req, res) => {
  const addr = hdWallet.createWallet(req.query.phrase);
  if (addr) {
    res.status(httpStatus.CREATED).send(addr);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid mnemonic");
  }
});

router.get("/hdWallet/recoverWallet", async (req, res) => {
  const addr = hdWallet.recoverWallet(req.query.phrase);
  if (addr) {
    res.status(httpStatus.CREATED).send(addr);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid mnemonic");
  }
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
