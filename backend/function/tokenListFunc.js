const fs = require("fs");
const path = require("path");

const API_KEY = "g1xbWZ0Rq2sKRL7wXWpHxfgP9o1Mk9kj";
const uri = `https://eth-mainnet.alchemyapi.io/v2/${API_KEY}`;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(uri);

module.exports = function() {

    this.getBlockNumber = async function() {
        let blockNumber = await web3.eth.getBlockNumber();
        return blockNumber;
    }
        
    this.getTokenName = async function(address) {
        const tokenABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../abi/tokenABI.json")));
        let tokenContract = new web3.eth.Contract(tokenABI, address);
        let tokenName = await tokenContract.methods.name().call();
        return tokenName;
    }
        
    this.getTokenSymbol = async function(address) {
        const tokenABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../abi/tokenABI.json")));
        let tokenContract = new web3.eth.Contract(tokenABI, address);
        let tokenSymbol = await tokenContract.methods.symbol().call();
        return tokenSymbol;
    }
        
    this.getTotalSupply = async function(address) {
        const tokenABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../abi/tokenABI.json")));
        let tokenContract = new web3.eth.Contract(tokenABI, address);
        let totalSupply = await tokenContract.methods.totalSupply().call();
        return totalSupply;
    }
        
    this.getPriceETHV2 = async function(address) {
        // liquidity pools
        // create tokenA, 100, 2    1/50 0.05
        
        // Wrapper ETHER, WETH
        
        let addressWETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
        
        const uniswapV2FactoryABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../abi/uniswapV2FactoryABI.json")));
        let uniswapV2FactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
        let uniswapV2Factory = new web3.eth.Contract(uniswapV2FactoryABI, uniswapV2FactoryAddress); 
        
        let pool = await uniswapV2Factory.methods.getPair(address, addressWETH).call();
        const tokenABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../abi/tokenABI.json")));
        let contractToken = new web3.eth.Contract(tokenABI, address);
        let contractWETH = new web3.eth.Contract(tokenABI, addressWETH);
        
        let balanceToken = await contractToken.methods.balanceOf(pool).call();
        let balanceWETH = await contractWETH.methods.balanceOf(pool).call();
        
        let tokenDecimal = await contractToken.methods.decimals().call();
        let wethDecimal = 18;
        balanceToken = balanceToken / Math.pow(10, tokenDecimal);
        balanceWETH = balanceWETH / Math.pow(10, wethDecimal);
        let price = 1 / (balanceToken / balanceWETH);
        return price;
    }
        
    this.getPriceUSDV2 = async function(address) {    
        // pool = USDC, weth
        let addressUSDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
        let priceETH = await this.getPriceETHV2(addressUSDC);
        let priceToken = await this.getPriceETHV2(address);
        priceETH = 1 / priceETH;
        
        let price = priceToken * priceETH;
        return price;
    }

    this.getPriceETHV3 = async function(address) {
        
        const uniswapV3FactoryABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../abi/uniswapV3FactoryABI.json")));
        const uniswapV3PoolABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../abi/uniswapV3PoolABI.json")));
        const uniswapV3FactoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
        const tokenABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../abi/tokenABI.json")));
        const tokenContract = new web3.eth.Contract(tokenABI, address);
    
        let uniswapV3Factory = new web3.eth.Contract(uniswapV3FactoryABI, uniswapV3FactoryAddress); 
    
        let addressWETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
        let pool = await uniswapV3Factory.methods.getPool(address, addressWETH, 3000).call();
        
        let poolContract = new web3.eth.Contract(uniswapV3PoolABI, pool);
        
        let n = await poolContract.methods.slot0().call();
        
        // (sqrtPrice96 ^2 / 2 ^ 192) / 10^ (tokenDecimal1 - tokenDecimal2)
        let sqrtPriceX96 = n.sqrtPriceX96;
        let tokenDecimal = await tokenContract.methods.decimals().call();
    
        let price = ((Math.pow(sqrtPriceX96, 2)) / (Math.pow(2, 192))) / Math.pow(10, (18 - tokenDecimal));
        
        return price;  
    }
    
    this.getPriceUSDV3 = async function(address) {
        let addressUSDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
        let priceETH = await this.getPriceETHV3(addressUSDC);

        priceETH = 1 / priceETH;

        let priceToken = await this.getPriceETHV3(address);

        let price = priceToken * priceETH;
        return price;
    }

}