const hdWallet = require("./function/hdWallet");
const httpStatus = require("http-status");
const tokenListFunc = require("./function/tokenListFunc.js");
const actionFunc = require("./function/action.js");
const ApiError = require("./utils/ApiError");
const express = require("express");
const catchAsync = require("./utils/catchAsync");
const morgan = require("./config/morgan");
const { errorConverter, errorHandler } = require("./middlewares/error");

let cors = require("cors");

const tokenList = new tokenListFunc();
const action = new actionFunc();
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
      res
        .status(httpStatus.CREATED)
        .json({ status: true, statusCode: httpStatus.CREATED, phrase });
    } else {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "We are facing some error, Please try again"
          )
        );
    }
  })
);

// router.get("/hdWallet/confirmPhrase", function (req, res) {
//   if (hdWallet.confirmPhrase(phrase, req.query.phrase)) {
//     res.status(httpStatus.OK).json({ status: true, statusCode: httpStatus.OK });
//   } else {
//     res
//       .status(httpStatus.NOT_FOUND)
//       .send(new ApiError(httpStatus.NOT_FOUND, "Invalid mnemonic"));
//   }
// });

router.get("/hdWallet/createWallet", (req, res) => {
  const addr = hdWallet.createWallet(req.query.phrase);
  if (addr) {
    res
      .status(httpStatus.CREATED)
      .json({ status: true, statusCode: httpStatus.CREATED, address: addr });
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, "Invalid mnemonic"));
  }
});

router.get("/hdWallet/recoverWallet", async (req, res) => {
  const addr = hdWallet.recoverWallet(req.query.phrase);
  if (addr) {
    res
      .status(httpStatus.CREATED)
      .json({ status: true, statusCode: httpStatus.CREATED, address: addr });
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, "Invalid mnemonic"));
  }
});

router.get("/token/getBlockNumber", async (req, res) => {
  let bn = await tokenList.getBlockNumber();
  if (bn) {
    res.status(httpStatus.FOUND).json({
      status: true,
      statusCode: httpStatus.FOUND,
      blockNumber: bn.toString(),
    });
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(
        new ApiError(
          httpStatus.NOT_FOUND,
          "We are facing some error, please try again"
        )
      );
  }
});

router.get("/token/getTokenName", async (req, res) => {
  let tokenName = await tokenList.getTokenName(req.query.address);
  if (tokenName) {
    res
      .status(httpStatus.FOUND)
      .json({ status: true, statusCode: httpStatus.FOUND, tokenName });
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(
        new ApiError(
          httpStatus.NOT_FOUND,
          "We are facing some error, please try again"
        )
      );
  }
});

router.get("/token/getTokenSymbol", async (req, res) => {
  let tokenSymbol = await tokenList.getTokenSymbol(req.query.address);
  if (tokenSymbol) {
    res
      .status(httpStatus.FOUND)
      .json({ status: true, statusCode: httpStatus.FOUND, tokenSymbol });
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(
        new ApiError(
          httpStatus.NOT_FOUND,
          "We are facing some error, please try again"
        )
      );
  }
});

router.get("/token/getPriceETHV2", async (req, res) => {
  let price = await tokenList.getPriceETHV2(req.query.address);
  if (price) {
    res.status(httpStatus.FOUND).json({
      status: true,
      statusCode: httpStatus.FOUND,
      price: price.toString(),
    }); 
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(
        new ApiError(
          httpStatus.NOT_FOUND,
          "We are facing some error, please try again"
        )
      );
  }
});

router.get("/token/getPriceUSDV2", async (req, res) => {
  let price = await tokenList.getPriceUSDV2(req.query.address);
  if (price) {
    res.status(httpStatus.FOUND).json({
      status: true,
      statusCode: httpStatus.FOUND,
      price: price.toString(),
    });
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(
        new ApiError(
          httpStatus.NOT_FOUND,
          "We are facing some error, please try again"
        )
      );
  }
});

router.get("/token/getPriceETHV3", async (req, res) => {
  let price = await tokenList.getPriceETHV3(req.query.address);
  if (price) {
    res.status(httpStatus.FOUND).json({
      status: true,
      statusCode: httpStatus.FOUND,
      price: price.toString(),
    });
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(
        new ApiError(
          httpStatus.NOT_FOUND,
          "We are facing some error, please try again"
        )
      );
  }
});

router.get("/token/getPriceUSDV3", async (req, res) => {
  let price = await tokenList.getPriceUSDV3(req.query.address);
  if (price) {
    res.status(httpStatus.FOUND).json({
      status: true,
      statusCode: httpStatus.FOUND,
      price: price.toString(),
    });
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(
        new ApiError(
          httpStatus.NOT_FOUND,
          "We are facing some error, please try again"
        )
      );
  }
});

router.get("/action/getBalance", async (req, res) => {
  let balance = await action.getBalance(req.query.address);
  if (balance) {
    res.status(httpStatus.FOUND).json({
      status: true,
      statusCode: httpStatus.FOUND,
      balance: balance.toString(),
    });
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(
        new ApiError(
          httpStatus.NOT_FOUND,
          "We are facing some error, please try again"
        )
      );
  }
});

router.get("/action/transferFund", async (req, res) => {
  let result = await action.transferFund(req.query.address, req.query.amount);
  if (result) {
    res.status(httpStatus.FOUND).json({
      status: true,
      statusCode: httpStatus.FOUND,
      result: result,
    });
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(
        new ApiError(
          httpStatus.NOT_FOUND,
          "We are facing some error, please try again"
        )
      );
  }
});

app.use(cors());

app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
