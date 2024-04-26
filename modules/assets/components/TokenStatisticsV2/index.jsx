import { useSelector } from 'react-redux'
import useFxUSDNavs from '../../hooks/useFxUSDNavs'
import NavChart from '../NavChart'
import BreakdownChart from '../BreakdownChart'
import BackendAssetValueChart from '../BackendAssetValueChart'
import { ChangedPrice } from '../Common'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import styles from './styles.module.scss'

export default function TokenStatisticsV2({ assetInfo, baseTokens = [] }) {
  const {
    name,
    symbol,
    baseSymbol,
    nav_text,
    totalSupply_text,
    marketCap_text,
    change24h,
    isBreakdownChart,
    isShow24Change,
    isX,
    icon,
    subIcon,
  } = assetInfo
  const baseToken = useSelector((state) => state.baseToken)

  // console.log('baseTokens---', baseTokens)

  const navsData = useFxUSDNavs()
  const navList = navsData.navList[symbol]
  const totalBaseTokenList = navsData.totalBaseTokenList[baseSymbol]

  const isFXUSD = ['fxUSD', 'rUSD', 'btcUSD', 'btcUSD'].includes(symbol)

  const getTotalBaseTokenUSD = () => {
    let totalBaseTokenUSD = cBN(0)

    baseTokens.forEach(({ data }) => {
      totalBaseTokenUSD = totalBaseTokenUSD.plus(
        checkNotZoroNum(data.totalBaseTokenRes)
          ? cBN(data.totalBaseTokenRes)
              .multipliedBy(cBN(data.prices.inMint))
              .toFixed(0, 1)
          : 0
      )
    })
    return fb4(totalBaseTokenUSD, false, 18, 2, false)
  }

  const getCollateralRatioDom = () => {
    if (isFXUSD) {
      if (!baseTokens) return null
      return (
        <div>
          {baseTokens.map((item) => (
            <div className={styles.nums}>
              {item.data?.collateralRatio_text
                ? `${item.data?.collateralRatio_text}% `
                : '- '}
              <span className="text-[16px] text-[var(--second-text-color)]">
                ({item.baseName})
              </span>
            </div>
          ))}
        </div>
      )
    }
    const data = baseToken[baseSymbol]?.data
    return (
      <div className={styles.nums}>
        {isX ? data?.leverage_text : `${data?.collateralRatio_text}%`}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className="flex gap-[18px] items-center mb-[24px]">
        <div className="relative">
          <img className="w-[28px]" src={icon} />
          {subIcon ? (
            <img
              className="w-[18px] absolute right-[-8px] bottom-[-3px]"
              src={subIcon}
            />
          ) : null}
        </div>
        <p>
          {name || symbol} <span className="mx-[8px]">{nav_text}</span>
          {isShow24Change ? <ChangedPrice value={change24h} isRed /> : null}
        </p>
      </div>

      <div className={styles.wrap}>
        <div className={styles.item}>
          <div className={styles.card}>
            <div className={styles.title}>Reserve Asset Value</div>
            <div className={styles.nums}>
              ${getTotalBaseTokenUSD()}
              {(baseTokens || []).map(({ baseName, data }) => (
                <div className={styles.processWrap} key={data.baseSymbol}>
                  <p>
                    {data.totalBaseToken} / {data.baseTokenCap_text} {baseName}
                  </p>
                  <progress
                    value={(data.totalBaseToken || '').replace(/,/g, '')}
                    max={data.baseTokenCap}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.title}>
              {symbol} {isX ? 'Leverage' : 'Collateral Ratio'}
            </div>
            {getCollateralRatioDom()}
          </div>
        </div>

        <p className="mt-[24px] text-[16px]">
          Total {symbol} Supply
          <span className="ml-[16px] text-[var(--primary-color)]">
            {totalSupply_text || '-'}
          </span>
        </p>
        <p className="mt-[4px] text-[16px]">
          Market Cap
          <span className="ml-[16px] text-[var(--primary-color)]">
            {marketCap_text}
          </span>
        </p>

        <p className="mt-[16px]">NAV (USD)</p>
        <div className={styles.chart}>
          <NavChart dateList={navsData.dateList} navs={navList} />
        </div>

        <p className="mt-[24px]">
          {isBreakdownChart ? 'Backed Asset Breakdown' : 'Reserve Asset Value'}
        </p>
        <div className={styles.chart}>
          {isBreakdownChart ? (
            <BreakdownChart
              dateList={navsData.dateList}
              baseTokens={navsData.totalBaseTokenList}
              assetInfo={assetInfo}
            />
          ) : (
            <BackendAssetValueChart
              dateList={navsData.dateList}
              list={totalBaseTokenList}
              assetInfo={assetInfo}
            />
          )}
        </div>
      </div>
    </div>
  )
}
