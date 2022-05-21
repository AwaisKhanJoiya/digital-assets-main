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
    try {
      phrase = hdWallet.createPhrase();
      if (phrase) {
        res
          .status(httpStatus.CREATED)
          .json({ status: true, statusCode: httpStatus.CREATED, phrase });
      }
    } catch (err) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err));
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
  if (hdWallet.confirmPhrase(phrase, req.query.phrase)) {
    try {
      const addr = hdWallet.createWallet(req.query.phrase);
      if (addr) {
        res.status(httpStatus.CREATED).json({
          status: true,
          statusCode: httpStatus.CREATED,
          address: addr,
        });
      }
    } catch (err) {
      res
        .status(httpStatus.NOT_FOUND)
        .send(new ApiError(httpStatus.NOT_FOUND, err));
    }
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, "Invalid mnemonic"));
  }
});

router.get("/hdWallet/recoverWallet", async (req, res) => {
  if (hdWallet.confirmPhrase(phrase, req.query.phrase)) {
    try {
      const addr = hdWallet.recoverWallet(req.query.phrase);
      if (addr) {
        res.status(httpStatus.CREATED).json({
          status: true,
          statusCode: httpStatus.CREATED,
          address: addr,
        });
      }
    } catch (err) {
      res
        .status(httpStatus.NOT_FOUND)
        .send(new ApiError(httpStatus.NOT_FOUND, err));
    }
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, "Invalid mnemonic"));
  }
});

router.get("/token/getBlockNumber", async (req, res) => {
  try {
    let bn = await tokenList.getBlockNumber();
    if (bn) {
      res.status(httpStatus.FOUND).json({
        status: true,
        statusCode: httpStatus.FOUND,
        blockNumber: bn.toString(),
      });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, err));
  }
});

router.get("/token/getTokenInfo", async (req, res) => {
  try {
    let tokenName = await tokenList.getTokenName(req.query.address);
    let tokenSymbol = await tokenList.getTokenSymbol(req.query.address);
    let priceETH = await tokenList.getPriceETHV2(req.query.address);
    let priceUSD = await tokenList.getPriceUSDV2(req.query.address);
    if (tokenName) {
      res.status(httpStatus.FOUND).json({
        status: true,
        statusCode: httpStatus.FOUND,
        tokenName,
        tokenSymbol,
        priceETH,
        priceUSD,
      });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, err));
  }
});

router.get("/token/getTokenName", async (req, res) => {
  try {
    let tokenName = await tokenList.getTokenName(req.query.address);
    if (tokenName) {
      res
        .status(httpStatus.FOUND)
        .json({ status: true, statusCode: httpStatus.FOUND, tokenName });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, err));
  }
});

router.get("/token/getTokenSymbol", async (req, res) => {
  try {
    let tokenSymbol = await tokenList.getTokenSymbol(req.query.address);
    if (tokenSymbol) {
      res
        .status(httpStatus.FOUND)
        .json({ status: true, statusCode: httpStatus.FOUND, tokenSymbol });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, err));
  }
});

router.get("/token/getPriceETHV2", async (req, res) => {
  try {
    let price = await tokenList.getPriceETHV2(req.query.address);
    if (price) {
      res.status(httpStatus.FOUND).json({
        status: true,
        statusCode: httpStatus.FOUND,
        price: price.toString(),
      });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, err));
  }
});

router.get("/token/getPriceUSDV2", async (req, res) => {
  try {
    let price = await tokenList.getPriceUSDV2(req.query.address);
    if (price) {
      res.status(httpStatus.FOUND).json({
        status: true,
        statusCode: httpStatus.FOUND,
        price: price.toString(),
      });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, err));
  }
});

router.get("/token/getPriceETHV3", async (req, res) => {
  try {
    let price = await tokenList.getPriceETHV3(req.query.address);
    if (price) {
      res.status(httpStatus.FOUND).json({
        status: true,
        statusCode: httpStatus.FOUND,
        price: price.toString(),
      });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, err));
  }
});

router.get("/token/getPriceUSDV3", async (req, res) => {
  try {
    let price = await tokenList.getPriceUSDV3(req.query.address);
    if (price) {
      res.status(httpStatus.FOUND).json({
        status: true,
        statusCode: httpStatus.FOUND,
        price: price.toString(),
      });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, err));
  }
});

router.get("/action/getBalance", async (req, res) => {
  try {
    let balance = await action.getBalance(req.query.address);
    if (balance) {
      res.status(httpStatus.FOUND).json({
        status: true,
        statusCode: httpStatus.FOUND,
        balance: balance.toString(),
      });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, err));
  }
});

router.get("/action/getTokenBalance", async (req, res) => {
  try {
    let balance = await action.getTokenBalance(
      req.query.walletAddress,
      req.query.tokenAddress
    );
    if (balance) {
      res.status(httpStatus.FOUND).json({
        status: true,
        statusCode: httpStatus.FOUND,
        balance: balance.toString(),
      });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, err));
  }
});

router.get("/action/transferFund", async (req, res) => {
  try {
    let result = await action.transferFund(
      req.query.sender,
      req.query.privateKey,
      req.query.reciever,
      req.query.amount
    );
    if (result) {
      res.status(httpStatus.FOUND).json({
        status: true,
        statusCode: httpStatus.FOUND,
        result: result,
      });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, err));
  }
});

router.get("/action/transferToken", async (req, res) => {
  try {
    let result = await action.transferToken(
      req.query.sender,
      req.query.privateKey,
      req.query.tokenAddress,
      req.query.reciever,
      req.query.amount
    );
    if (result) {
      res.status(httpStatus.FOUND).json({
        status: true,
        statusCode: httpStatus.FOUND,
        result: result,
      });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send(new ApiError(httpStatus.NOT_FOUND, err));
  }
});

app.use(cors());

app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
