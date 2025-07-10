export const ERC20ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function transferFrom(address sender, address recipient, uint256 amount) returns (bool)',
  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]

export const RouterABI = [
  'constructor(address _factory, address _WETH)',
  'function WETH() view returns (address)',
  'function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB, uint256 liquidity)',
  'function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)',
  'function factory() view returns (address)',
  'function getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut) pure returns (uint256 amountIn)',
  'function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) pure returns (uint256 amountOut)',
  'function getAmountsIn(uint256 amountOut, address[] path) view returns (uint256[] amounts)',
  'function getAmountsOut(uint256 amountIn, address[] path) view returns (uint256[] amounts)',
  'function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) pure returns (uint256 amountB)',
  'function removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB)',
  'function removeLiquidityETH(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) returns (uint256 amountToken, uint256 amountETH)',
  'function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) returns (uint256 amountETH)',
  'function removeLiquidityETHWithPermit(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) returns (uint256 amountToken, uint256 amountETH)',
  'function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) returns (uint256 amountETH)',
  'function removeLiquidityWithPermit(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) returns (uint256 amountA, uint256 amountB)',
  'function swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)',
  'function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)',
  'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable',
  'function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)',
  'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)',
  'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  'function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)',
  'function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)'
]

export const QuoteABI = [
  'function batchAmountsIn(tuple(tuple(address pair, address tokenIn, address tokenOut, address router)[] path, uint256 amount)[] quoterList) returns (uint256[][] amountsList)',
  'function batchAmountsOut(tuple(tuple(address pair, address tokenIn, address tokenOut, address router)[] path, uint256 amount)[] quoterList) returns (uint256[][] amountsList)',
  'function getAmountsIn(tuple(address pair, address tokenIn, address tokenOut, address router)[] path, uint256 amountOut) returns (uint256[] amounts)',
  'function getAmountsOut(tuple(address pair, address tokenIn, address tokenOut, address router)[] path, uint256 amountIn) returns (uint256[] amounts)'
]


export const QuoteV4ABI = [
  'function batchAmountsIn(tuple(tuple(address pair, address tokenIn, address tokenOut, address router, bytes32 poolId)[] path, uint256 amount)[] quoterList) returns (uint256[][] amountsList)',
  'function batchAmountsOut(tuple(tuple(address pair, address tokenIn, address tokenOut, address router, bytes32 poolId)[] path, uint256 amount)[] quoterList) returns (uint256[][] amountsList)',
  'function getAmountsIn(tuple(address pair, address tokenIn, address tokenOut, address router, bytes32 poolId)[] path, uint256 amountOut) returns (uint256[] amounts)',
  'function getAmountsOut(tuple(address pair, address tokenIn, address tokenOut, address router, bytes32 poolId)[] path, uint256 amountIn) returns (uint256[] amounts)',
]

// feeIn 0 前收费 1 后收费
// flag
// 0 swapExactTokensForTokensSupportingFeeOnTransferTokens
// 1 swapExactETHForTokensSupportingFeeOnTransferTokens
// 2 swapExactTokensForETHSupportingFeeOnTransferTokens
// 3 swapExactTokensForTokens
// 4 swapTokensForExactTokens
// 5 swapExactETHForTokens
// 6 swapTokensForExactETH
// 7 swapExactTokensForETH
// 8 swapETHForExactTokens
export const SwapABI = [
  'function exactOutput(tuple(address srcToken, address dstToken, address srcReceiver, address dstReceiver, uint256 amount, uint256 minReturnAmount, uint256 feeIn, uint256 feeRate, address feeTo, uint256 receiveRate, address referrer, tuple(address pair, address tokenIn, address tokenOut, address router)[] path, tuple(address router, bytes path, uint256 routerType)[] routerPath) d) payable returns (uint256)',

  'function swapPlus(tuple(address srcToken, address dstToken, address srcReceiver, address dstReceiver, uint256 amount, uint256 minReturnAmount, uint256 feeIn, uint256 feeRate, address feeTo, uint256 receiveRate, address referrer, tuple(address pair, address tokenIn, address tokenOut, address router)[] path, tuple(address router, bytes path, uint256 routerType)[] routerPath) d) payable returns (uint256)',

  'function swapRefer(tuple(address srcToken, address dstToken, address srcReceiver, address dstReceiver, uint256 amount, uint256 minReturnAmount, uint256 feeIn, uint256 feeRate, address feeTo, uint256 minLiquidity, uint256 maxLiquidity, uint256[] referRates, address[] referrers, tuple(address pair, address tokenIn, address tokenOut, address router)[] path) d) payable returns (uint256)',

  'function swapSniper(tuple(address srcToken, address dstToken, address srcReceiver, address dstReceiver, uint256 amount, uint256 minReturnAmount, uint256 feeIn, uint256 feeRate, address feeTo, uint256 minLiquidity, uint256 maxLiquidity, uint256[] referRates, address[] referrers, tuple(address pair, address tokenIn, address tokenOut, address router)[] path) d, bool isSelfTransfer, uint256 slippage) payable returns (uint256 amountOut)',

  'function swapV4(tuple(address srcToken, address dstToken, uint256 amount, uint256 minReturnAmount, uint256 feeIndex, uint256 feeRate, address feeTo, uint256 minLiquidity, uint256 maxLiquidity, uint256[] referRates, address[] referrers, tuple(address pair, address tokenIn, address tokenOut, address router, bytes32 poolId)[] paths) d) payable returns (uint256)'
]

export const WETHABI = [
  'function name() view returns (string)',
  'function approve(address guy, uint256 wad) returns (bool)',
  'function totalSupply() view returns (uint256)',
  'function transferFrom(address src, address dst, uint256 wad) returns (bool)',
  'function withdraw(uint256 wad)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  'function symbol() view returns (string)',
  'function transfer(address dst, uint256 wad) returns (bool)',
  'function deposit() payable',
  'function allowance(address, address) view returns (uint256)',
  'event Approval(address indexed src, address indexed guy, uint256 wad)',
  'event Transfer(address indexed src, address indexed dst, uint256 wad)',
  'event Deposit(address indexed dst, uint256 wad)',
  'event Withdrawal(address indexed src, uint256 wad)'
]

export const LimitABI = [
  'function cancelOrder(address fromToken, uint256 fromAmount, address toToken, uint256 minReturn, uint256 salt)',
  'function depositEth(address toToken, uint256 minReturn, uint256 salt) payable'
]


export const FactoryABI = [
  'constructor(address _feeToSetter)',
  'event PairCreated(address indexed token0, address indexed token1, address pair, uint256)',
  'function INIT_CODE_PAIR_HASH() view returns (bytes32)',
  'function allPairs(uint256) view returns (address)',
  'function allPairsLength() view returns (uint256)',
  'function createPair(address tokenA, address tokenB) returns (address pair)',
  'function feeTo() view returns (address)',
  'function feeToSetter() view returns (address)',
  'function getPair(address, address) view returns (address)',
  'function setFeeTo(address _feeTo)',
  'function setFeeToSetter(address _feeToSetter)'
]

export const PairABI = [
  'constructor()',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed to)',
  'event Mint(address indexed sender, uint256 amount0, uint256 amount1)',
  'event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to)',
  'event Sync(uint112 reserve0, uint112 reserve1)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function DOMAIN_SEPARATOR() view returns (bytes32)',
  'function MINIMUM_LIQUIDITY() view returns (uint256)',
  'function PERMIT_TYPEHASH() view returns (bytes32)',
  'function allowance(address, address) view returns (uint256)',
  'function approve(address spender, uint256 value) returns (bool)',
  'function balanceOf(address) view returns (uint256)',
  'function burn(address to) returns (uint256 amount0, uint256 amount1)',
  'function decimals() view returns (uint8)',
  'function factory() view returns (address)',
  'function getReserves() view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)',
  'function initialize(address _token0, address _token1)',
  'function kLast() view returns (uint256)',
  'function mint(address to) returns (uint256 liquidity)',
  'function name() view returns (string)',
  'function nonces(address) view returns (uint256)',
  'function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)',
  'function price0CumulativeLast() view returns (uint256)',
  'function price1CumulativeLast() view returns (uint256)',
  'function skim(address to)',
  'function swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)',
  'function symbol() view returns (string)',
  'function sync()',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function totalSupply() view returns (uint256)',
  'function transfer(address to, uint256 value) returns (bool)',
  'function transferFrom(address from, address to, uint256 value) returns (bool)'
]

export const UniswapV3FactoryABI = [
  'constructor()',
  'event FeeAmountEnabled(uint24 indexed fee, int24 indexed tickSpacing)',
  'event OwnerChanged(address indexed oldOwner, address indexed newOwner)',
  'event PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)',
  'function createPool(address tokenA, address tokenB, uint24 fee) returns (address pool)',
  'function enableFeeAmount(uint24 fee, int24 tickSpacing)',
  'function feeAmountTickSpacing(uint24) view returns (int24)',
  'function getPool(address, address, uint24) view returns (address)',
  'function owner() view returns (address)',
  'function parameters() view returns (address factory, address token0, address token1, uint24 fee, int24 tickSpacing)',
  'function setOwner(address _owner)'
]

export const UniswapV3PoolABI = [
  'constructor()',
  'event Burn(address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  'event Collect(address indexed owner, address recipient, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount0, uint128 amount1)',
  'event CollectProtocol(address indexed sender, address indexed recipient, uint128 amount0, uint128 amount1)',
  'event Flash(address indexed sender, address indexed recipient, uint256 amount0, uint256 amount1, uint256 paid0, uint256 paid1)',
  'event IncreaseObservationCardinalityNext(uint16 observationCardinalityNextOld, uint16 observationCardinalityNextNew)',
  'event Initialize(uint160 sqrtPriceX96, int24 tick)',
  'event Mint(address sender, address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  'event SetFeeProtocol(uint8 feeProtocol0Old, uint8 feeProtocol1Old, uint8 feeProtocol0New, uint8 feeProtocol1New)',
  'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
  'function burn(int24 tickLower, int24 tickUpper, uint128 amount) returns (uint256 amount0, uint256 amount1)',
  'function collect(address recipient, int24 tickLower, int24 tickUpper, uint128 amount0Requested, uint128 amount1Requested) returns (uint128 amount0, uint128 amount1)',
  'function collectProtocol(address recipient, uint128 amount0Requested, uint128 amount1Requested) returns (uint128 amount0, uint128 amount1)',
  'function factory() view returns (address)',
  'function fee() view returns (uint24)',
  'function feeGrowthGlobal0X128() view returns (uint256)',
  'function feeGrowthGlobal1X128() view returns (uint256)',
  'function flash(address recipient, uint256 amount0, uint256 amount1, bytes data)',
  'function increaseObservationCardinalityNext(uint16 observationCardinalityNext)',
  'function initialize(uint160 sqrtPriceX96)',
  'function liquidity() view returns (uint128)',
  'function maxLiquidityPerTick() view returns (uint128)',
  'function mint(address recipient, int24 tickLower, int24 tickUpper, uint128 amount, bytes data) returns (uint256 amount0, uint256 amount1)',
  'function observations(uint256) view returns (uint32 blockTimestamp, int56 tickCumulative, uint160 secondsPerLiquidityCumulativeX128, bool initialized)',
  'function observe(uint32[] secondsAgos) view returns (int56[] tickCumulatives, uint160[] secondsPerLiquidityCumulativeX128s)',
  'function positions(bytes32) view returns (uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
  'function protocolFees() view returns (uint128 token0, uint128 token1)',
  'function setFeeProtocol(uint8 feeProtocol0, uint8 feeProtocol1)',
  'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function snapshotCumulativesInside(int24 tickLower, int24 tickUpper) view returns (int56 tickCumulativeInside, uint160 secondsPerLiquidityInsideX128, uint32 secondsInside)',
  'function swap(address recipient, bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96, bytes data) returns (int256 amount0, int256 amount1)',
  'function tickBitmap(int16) view returns (uint256)',
  'function tickSpacing() view returns (int24)',
  'function ticks(int24) view returns (uint128 liquidityGross, int128 liquidityNet, uint256 feeGrowthOutside0X128, uint256 feeGrowthOutside1X128, int56 tickCumulativeOutside, uint160 secondsPerLiquidityOutsideX128, uint32 secondsOutside, bool initialized)',
  'function token0() view returns (address)',
  'function token1() view returns (address)'
]

export const NonfungiblePositionManagerABI = [
  'constructor(address _factory, address _WETH9, address _tokenDescriptor_)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
  'event Collect(uint256 indexed tokenId, address recipient, uint256 amount0, uint256 amount1)',
  'event DecreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)',
  'event IncreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'function DOMAIN_SEPARATOR() view returns (bytes32)',
  'function PERMIT_TYPEHASH() view returns (bytes32)',
  'function WETH9() view returns (address)',
  'function approve(address to, uint256 tokenId)',
  'function balanceOf(address owner) view returns (uint256)',
  'function baseURI() pure returns (string)',
  'function burn(uint256 tokenId) payable',
  'function collect(tuple(uint256 tokenId, address recipient, uint128 amount0Max, uint128 amount1Max) params) payable returns (uint256 amount0, uint256 amount1)',
  'function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96) payable returns (address pool)',
  'function decreaseLiquidity(tuple(uint256 tokenId, uint128 liquidity, uint256 amount0Min, uint256 amount1Min, uint256 deadline) params) payable returns (uint256 amount0, uint256 amount1)',
  'function factory() view returns (address)',
  'function getApproved(uint256 tokenId) view returns (address)',
  'function increaseLiquidity(tuple(uint256 tokenId, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, uint256 deadline) params) payable returns (uint128 liquidity, uint256 amount0, uint256 amount1)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function mint(tuple(address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline) params) payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)',
  'function multicall(bytes[] data) payable returns (bytes[] results)',
  'function name() view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function permit(address spender, uint256 tokenId, uint256 deadline, uint8 v, bytes32 r, bytes32 s) payable',
  'function positions(uint256 tokenId) view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
  'function refundETH() payable',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data)',
  'function selfPermit(address token, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) payable',
  'function selfPermitAllowed(address token, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) payable',
  'function selfPermitAllowedIfNecessary(address token, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) payable',
  'function selfPermitIfNecessary(address token, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) payable',
  'function setApprovalForAll(address operator, bool approved)',
  'function supportsInterface(bytes4 interfaceId) view returns (bool)',
  'function sweepToken(address token, uint256 amountMinimum, address recipient) payable',
  'function symbol() view returns (string)',
  'function tokenByIndex(uint256 index) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function uniswapV3MintCallback(uint256 amount0Owed, uint256 amount1Owed, bytes data)',
  'function unwrapWETH9(uint256 amountMinimum, address recipient) payable'
]

// PancakeSwap:Nonfungible Position Manager V3
// 0x46a15b0b27311cedf172ab29e4f4766fbe7f4364

export const ERC314ABI = [
  'constructor()',
  'event AddLiquidity(uint32 _blockToUnlockLiquidity, uint256 value)',
  'event RemoveLiquidity(uint256 value)',
  'event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function _maxWallet() view returns (uint256)',
  'function addLiquidity(uint32 _blockToUnlockLiquidity) payable',
  'function balanceOf(address account) view returns (uint256)',
  'function blockToUnlockLiquidity() view returns (uint32)',
  'function decimals() view returns (uint8)',
  'function enableMaxWallet(bool _maxWalletEnable)',
  'function enableTrading(bool _tradingEnable)',
  'function extendLiquidityLock(uint32 _blockToUnlockLiquidity)',
  'function getAmountOut(uint256 value, bool _buy) view returns (uint256)',
  'function getReserves() view returns (uint256, uint256)',
  'function liquidityAdded() view returns (bool)',
  'function liquidityProvider() view returns (address)',
  'function maxWalletEnable() view returns (bool)',
  'function name() view returns (string)',
  'function owner() view returns (address)',
  'function presale(address[] _investors)',
  'function presaleEnable() view returns (bool)',
  'function removeLiquidity()',
  'function renounceOwnership()',
  'function setMaxWallet(uint256 _maxWallet_)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function tradingEnable() view returns (bool)',
  'function transfer(address to, uint256 value) returns (bool)'
]

export const Four_TokenManager_V1_ABI = [
  'event TokenCreate(address creator, address token, uint256 requestId, string name, string symbol, uint256 totalSupply, uint256 launchTime, uint256 launchFee)',
  'event TokenPurchase(address token, address account, uint256 tokenAmount, uint256 etherAmount, uint256 fee)',
  'event TokenSale(address token, address account, uint256 tokenAmount, uint256 etherAmount, uint256 fee)',
  'event TradeStop(address token)',
  'function purchaseToken(address tokenAddress, uint256 amount, uint256 maxFunds) payable',
  'function purchaseTokenAMAP(address tokenAddress, uint256 funds, uint256 minAmount) payable',
  'function saleToken(address tokenAddress, uint256 amount)'
]

export const Four_TokenManager_V2_ABI = [
  'event LiquidityAdded(address base, uint256 offers, address quote, uint256 funds)',
  'event TokenCreate(address creator, address token, uint256 requestId, string name, string symbol, uint256 totalSupply, uint256 launchTime, uint256 launchFee)',
  'event TokenPurchase(address token, address account, uint256 price, uint256 amount, uint256 cost, uint256 fee, uint256 offers, uint256 funds)',
  'event TokenSale(address token, address account, uint256 price, uint256 amount, uint256 cost, uint256 fee, uint256 offers, uint256 funds)',
  'event TradeStop(address token)',
  'function buyToken(address token, address to, uint256 amount, uint256 maxFunds) payable',
  'function buyToken(address token, uint256 amount, uint256 maxFunds) payable',
  'function buyTokenAMAP(address token, address to, uint256 funds, uint256 minAmount) payable',
  'function buyTokenAMAP(address token, uint256 funds, uint256 minAmount) payable',
  'function sellToken(address token, uint256 amount)'
]

export const Four_TokenManagerHelper_V1_ABI = [
  'constructor(address tokenManager)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  'function PANCAKE_FACTORY() view returns (address)',
  'function WBNB() view returns (address)',
  'function _tokenManager() view returns (address)',
  'function calcBuyAmount(address token, uint256 funds) view returns (uint256)',
  'function calcBuyCost(address token, uint256 amount) view returns (uint256)',
  'function calcSellCost(address token, uint256 amount) view returns (uint256)',
  'function calcTradeFee(uint256 funds) view returns (uint256)',
  'function getLastPrice(address token) view returns (uint256)',
  'function getMinTradeFee() view returns (uint256)',
  'function getPancakePair(address token) view returns (address)',
  'function getTokenInfo(address token) view returns (bool, uint256, uint256, uint256, uint256, uint256)',
  'function getTradeFeeRate() view returns (uint256)',
  'function owner() view returns (address)',
  'function renounceOwnership()',
  'function setTokenManager(address v)',
  'function transferOwnership(address newOwner)',
  'function tryBuy(address token, uint256 amount, uint256 funds) view returns (uint256, uint256 cost, uint256 fee, bool dontBuyAMAP)',
  'function trySell(address token, uint256 amount) view returns (uint256 funds, uint256 fee)'
]

export const Four_TokenManagerHelper_V2_ABI = [
  'function PANCAKE_FACTORY() view returns (address)',
  'function TM() view returns (address)',
  'function TM2() view returns (address)',
  'function TOKEN_MANAGER() view returns (address)',
  'function TOKEN_MANAGER_2() view returns (address)',
  'function WBNB() view returns (address)',
  'function getPancakePair(address token) view returns (address)',
  'function getTokenInfo(address token) view returns (uint256 version, address tokenManager, address quote, uint256 lastPrice, uint256 tradingFeeRate, uint256 minTradingFee, uint256 launchTime, uint256 offers, uint256 maxOffers, uint256 funds, uint256 maxFunds, bool liquidityAdded)',
  'function tryBuy(address token, uint256 amount, uint256 funds) view returns (address tokenManager, address quote, uint256 estimatedAmount, uint256 estimatedCost, uint256 estimatedFee, uint256 fundRequirement, uint256 fundAsParameter)',
  'function trySell(address token, uint256 amount) view returns (address tokenManager, address quote, uint256 funds, uint256 fee)'
]


export const SunPump_Launchpad_ABI = [
  'function LAUNCH_FEE() view returns (uint256)',
  'function LAUNCH_THRESHOLD() view returns (uint256)',
  'function LAUNCH_TRX_RESERVE() view returns (uint256)',
  'function TOKEN_SUPPLY() view returns (uint256)',
  'function TOTAL_SALE() view returns (uint256)',
  'function VIRTUAL_TOKEN_RESERVE_AMOUNT() view returns (uint256)',
  'function VIRTUAL_TRX_RESERVE_AMOUNT() view returns (uint256)',
  'function _becomeNewImplementation(address proxy)',
  'function acceptOwner()',
  'function createAndInitPurchase(string name, string symbol) payable',
  'function deadAddress() view returns (address)',
  'function getExactTokenAmountForPurchase(address token, uint256 tokenAmount) view returns (uint256 trxAmount)',
  'function getExactTokenAmountForPurchaseWithFee(address token, uint256 tokenAmount) view returns (uint256 trxAmount, uint256 fee)',
  'function getExactTrxAmountForSale(address token, uint256 trxAmount) view returns (uint256 tokenAmount)',
  'function getExactTrxAmountForSaleWithFee(address token, uint256 trxAmount) view returns (uint256 tokenAmount, uint256 fee)',
  'function getPrice(address token) view returns (uint256)',
  'function getTokenAmountByPurchase(address token, uint256 trxAmount) view returns (uint256 tokenAmount)',
  'function getTokenAmountByPurchaseWithFee(address token, uint256 trxAmount) view returns (uint256 tokenAmount, uint256 fee)',
  'function getTokenState(address token) view returns (uint256)',
  'function getTrxAmountBySale(address token, uint256 tokenAmount) view returns (uint256 trxAmount)',
  'function getTrxAmountBySaleWithFee(address token, uint256 tokenAmount) view returns (uint256 trxAmount, uint256 fee)',
  'function implementation() view returns (address)',
  'function initialize(address _vault, address _v2Router, uint256 _salefee, uint256 _purchasefee)',
  'function launchFee() view returns (uint256)',
  'function launchToDEX(address token)',
  'function launcher() view returns (address)',
  'function maxPurachaseAmount() view returns (uint256)',
  'function minTxFee() view returns (uint256)',
  'function mintFee() view returns (uint256)',
  'function operator() view returns (address)',
  'function owner() view returns (address)',
  'function pause() view returns (bool)',
  'function pausePad()',
  'function pendingImplementation() view returns (address)',
  'function pendingOwner() view returns (address)',
  'function purchaseFee() view returns (uint256)',
  'function purchaseToken(address token, uint256 AmountMin) payable',
  'function rerunPad()',
  'function saleFee() view returns (uint256)',
  'function saleToken(address token, uint256 tokenAmount, uint256 AmountMin)',
  'function setLauncher(address newLauncher)',
  'function setMinTxFee(uint256 newFee)',
  'function setMintAndMinTxFee(uint256 _newMintFee, uint256 _newMinTxFee)',
  'function setMintFee(uint256 newFee)',
  'function setOperator(address newOp)',
  'function setPendingOwner(address newPendingOwner)',
  'function setPurchaseFee(uint256 _fee)',
  'function setSaleFee(uint256 _fee)',
  'function setVault(address _addr)',
  'function tokenAddress(uint256) view returns (address)',
  'function tokenCount() view returns (uint256)',
  'function tokenCreator(address) view returns (address)',
  'function v2Router() view returns (address)',
  'function vault() view returns (address)',
  'function virtualPools(address) view returns (uint256 TRXReserve, uint256 TokenReserve, bool launched)'
]

export const SunPump_Router_ABI = [
  'constructor(address _factory, address _WETH, address _owner, address _operator)',
  'function WETH() view returns (address)',
  'function acceptOnwer()',
  'function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB, uint256 liquidity)',
  'function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)',
  'function factory() view returns (address)',
  'function getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut) pure returns (uint256 amountIn)',
  'function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) pure returns (uint256 amountOut)',
  'function getAmountsIn(uint256 amountOut, address[] path) view returns (uint256[] amounts)',
  'function getAmountsOut(uint256 amountIn, address[] path) view returns (uint256[] amounts)',
  'function getPairOffChain(address tokenA, address tokenB) view returns (address pair)',
  'function getPauseState() view returns (bool)',
  'function isAllowedTradingPair(address tokenA, address tokenB) view returns (bool)',
  'function isSunPumpToken(address token) view returns (bool)',
  'function launchPad() view returns (address)',
  'function operator() view returns (address)',
  'function owner() view returns (address)',
  'function pathLimit() view returns (uint256)',
  'function pause() view returns (bool)',
  'function pauseRouter()',
  'function pendingOwner() view returns (address)',
  'function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) pure returns (uint256 amountB)',
  'function removeAllowedTradeToken(address _token)',
  'function removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB)',
  'function removeLiquidityETH(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) returns (uint256 amountToken, uint256 amountETH)',
  'function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) returns (uint256 amountETH)',
  'function removeLiquidityETHWithPermit(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) returns (uint256 amountToken, uint256 amountETH)',
  'function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) returns (uint256 amountETH)',
  'function removeLiquidityWithPermit(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) returns (uint256 amountA, uint256 amountB)',
  'function rerunRouter()',
  'function setAllowedTradeToken(address _token)',
  'function setLaunchPad(address _launchpad)',
  'function setOperator(address newOperator)',
  'function setPendingOwner(address _newOwner)',
  'function swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)',
  'function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)',
  'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable',
  'function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)',
  'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)',
  'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  'function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)',
  'function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)',
  'function tokenWhiteList(address) view returns (bool)'
]

export const UniChainsV4 = ['base', 'bsc']

export function getQuoteABI(chain: string) {
  if (UniChainsV4?.includes(chain)) {
    return QuoteV4ABI
  }
  return QuoteABI
}

export function getSwapMethod(chain: string) {
  return UniChainsV4?.includes(chain) ? 'swapV4' : 'swapPlus'
}
