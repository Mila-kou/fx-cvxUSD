import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import useGlobal from '@/hooks/useGlobal'

import styles from './styles.module.scss'

const Whitepaper = () => (
  <a
    href="https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/whitepapers/f(x)_whitepaper_v2.pdf"
    target="_blank"
    rel="noreferrer"
  >
    whitepaper
  </a>
)

export default function FAQ({ open, onCancel }) {
  const { theme } = useGlobal()
  return (
    <div>
      {open ? (
        <div className={styles.faq}>
          <div className={styles.container}>
            <div className={styles.header}>
              <div className={styles.title}>
                <img
                  src={`/images/f-x-logo${theme === 'blue' ? '-dark' : ''}.svg`}
                />
                <p>FAQ</p>
              </div>
              <CloseOutlined onClick={onCancel} />
            </div>

            <div className={styles.content}>
              <h1>f(x) FAQ</h1>

              <h2>1) What</h2>

              <p>
                Big Picture: f(x) splits yield-bearing tokens into two
                derivative coins: a stable one, and a more volatile one. On the
                stable side, the headliners are fETH and fxUSD: both stable (one
                USD-pegged, one that increases or decreases a little with the
                price of ETH. Holding the high volatility tokens like xETH,
                xstETH, and others are like holding leverage on the reserve,
                i.e. leveraged ETH, but with zero funding costs and no
                individual liquidations.
              </p>

              <h2>2) </h2>
              <p>
                Tokens on f(x) can be minted by supplying to their reserve: for
                example, supply stETH or frxETH to mint fxUSD. Just use what you
                have to mint what you want; stable or ‘volatility amplified,’ or
                any combination thereof. No slippage or collateral to manage
                (fees and gas still apply!)
              </p>

              <h2>3) Can I get stETH/ReserveToken back out again?</h2>

              <p>
                Yes! Every minted token is always redeemable for a share of the
                reserve, with its redemption value determined by its NAV.
              </p>

              <h2>4) What is NAV?</h2>

              <p>
                NAV is net asset value, i.e. the current cost to mint or amount
                received to redeem for a given token. As the value (in dollars)
                of the reserve changes, the protocol sets the NAV of each
                derivative token such that the stable tokens stay stable (or
                nearly stable in the case of fETH) and the xETH tokens absorb
                the difference.
              </p>
              <p>
                If the value of the reserve rises or falls, the value of stables
                minted against it stays the same while the value of its X tokens
                rises and falls by <b>a bigger % than the reserve</b>, to make
                up the difference.
              </p>

              <h2>5) What’s so special about fxUSD and fETH?</h2>

              <p>
                These stablecoins are designed to power the next generation of
                on-chain activity without exposure to the risks of banks,
                governments, or real world assets. Unlike decentralized
                stablecoins before them, they can do this while still being
                scalable. And to top it off, each can be staked in the stability
                pool to earn a share of ETH staking yields from the reserve.
              </p>
              <p>
                Value-wise, fxUSD is a traditional stablecoin: pegged to $1.
                fETH is different: its value stays mostly stable, but it follows
                the price of ETH by adjusting its NAV by 10% of the change in
                ETH price. If ETH goes up a lot, fETH goes up a little. You can
                think of it as the first stablecoin anchored in the crypto
                economy. If you want to be able to plan for expenses but not
                totally get left behind in fiat as ETH price moves, it’s for
                you.
              </p>

              <h2>6) What’s rUSD?</h2>
              <p>
                rUSD is a stablecoin that uses the same mechanism as fxUSD, but
                with its reserve comprised of only ETH Liquid Restaking Tokens
                (LRT), starting with ether.fi’s eETH. Even though the risk
                profile of LRTs are different enough to LSTs that they should
                not be included in fxUSD, restaked ETH is an excellent use-case
                for the powerful f(x) mechanism. Stability pool depositors can
                earn very high restaking rewards, including points, all without
                taking ETH price exposure. In fact, since 100% of reserve points
                flow to the rUSD stability pool, along with 50% of LST yields,
                points accrual in the rUSD Stability Pool is much higher, dollar
                for dollar, than holding the LST itself!
              </p>

              <h2>7) What’s with xETH and these other x tokens?</h2>
              <p>
                xETH and its ilk provide powerful, free leverage on ETH (or
                whichever token is in their reserve. No funding rate, very low
                risk of liquidation. It’s a great token to amplify your gains on
                a long-term bet on ETH price growth. Its “equivalent leverage”
                varies between about 1.5 and 4, changing with the makeup of the
                derivative tokens against that reserve. If the balance is skewed
                to stable tokens the multiplier is higher, when it skews toward
                x tokens the multiplier is lower.
              </p>

              <h2>
                8) What the heck does “low risk of liquidation” for xETH even
                mean?
              </h2>

              <p>
                xETH has no concept of ‘liquidation’ (unlike leveraged perps or
                CDPs). When we talk about risk of xETH “liquidation”, we really
                mean the risk of xETH’s price going to zero due to an extreme
                drop in ETH price (see Bad Things section). We analyzed ETH
                daily price data over years to set parameters to keep this risk
                below 0.1% and that doesn’t even factor in stability mode which
                automatically deploys stability pool capital and bonus
                incentives to restabilize the system.
              </p>

              <h2>9) What risks am I taking when I hold fxUSD or fETH?</h2>

              <p>
                f(x) headline stablecoins fETH and fxUSD were created to avoid
                centralized risks from real-world assets. Apart from smart
                contract and oracle risk, which are common to nearly all DeFi
                protocols, the main risk for these stables is of an extreme
                outlier rapid ETH price drop which is larger than the ability of
                the currently minted xETH to absorb. In that case xETH price
                would go to zero (sort of like a liquidation) and fETH would
                lose its low volatility nature, reverting to 1:1 ETH.
              </p>

              <p>
                f(x) has extensive and thoughtful risk management systems to
                prevent this from happening, clearly explained in the{' '}
                <Whitepaper />.
              </p>

              <h2>10) What’s a Stability Pool?</h2>

              <p>
                There is one stability pool for every stable-leverage pair on
                f(x). When stable holders deposit there, they earn part of the
                yields generated by the reserve <b>plus</b> FXN emissions.
              </p>
              <p>
                If the stable-leverage pair is ever at risk of becoming unstable
                because of too much minted stable and not enough minted x token,
                stables in the stability pool are redeemed for reserve assets at
                their NAV. If the protocol enters stability mode, for stability
                pool users it is like automatically buying ETH (or whatever the
                reserve token is) at market price, with no slippage. Otherwise
                it’s farming unstable, real yields using stable coins.
              </p>

              <h2>11) How much does it cost?</h2>

              <p>
                f(x) charges small minting and redemption fees which vary by
                asset. Those can be avoided by swapping in and out on secondary
                (and some fees are waived in certain circumstances, see{' '}
                <Whitepaper />
                ).
              </p>
              <p>
                Aside from that, users do not pay any cost. Protocol revenue and
                stability services (see the Stability pool above) come from
                staking yields earned by stETH in the reserve.
              </p>

              <h1>What if bad things happen?</h1>

              <h2>
                12) What happens if there’s a huge flash crash in ETH price?
              </h2>
              <p>
                In the unlikely (&lt;0.1%; see <Whitepaper />) event of a price
                crash in ETH that’s so big that the Stability pool and minting
                incentives fail to restabilize the system, the price of xETH can
                fall to zero [this is the closest thing to a liquidation on
                f(x)] and in that case fETH will have sole claim on the reserve.
                If that happens, the fETH NAV will start following the full
                price swings of ETH, rather than just 10%. As always, it would
                be redeemable.
              </p>
              <p>
                If this ever were to happen there are provisions for
                recapitalizing the protocol described in the <Whitepaper />.
              </p>

              <h2>
                13) What happens if stETH or other LSD/LRT depegs from ETH?
              </h2>
              <p>
                f(x) has an automatic emergency brake built-in which protects
                stable and leverage token holders if there is a depeg. Using
                multiple oracle feeds f(x) can determine if the price of a
                liquid staked/restaked derivative has diverged more than 1% from
                the price of ETH, and if so minting with it is (temporarily)
                disabled. Redemptions remain enabled (as always), however
                stable-side (f token) redemptions use the higher of the two
                divergent prices (ETH or LSD) and leverage-side (x token)
                redemptions use the lower. When the peg normalizes, minting
                resumes. This mechanism ensures f and x token holders are
                protected, and ensures that{' '}
                <b>
                  no urgent action is ever needed in the event of an LSD or LRT
                  depeg
                </b>
                .
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
