import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import useGlobal from '@/hooks/useGlobal'

import styles from './styles.module.scss'

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
              <h2>1. What?</h2>

              <p>
                f(x) splits ETH into a mix of low-volatility “floating
                stablecoins” called fETH and high volatility “leveraged ETH”
                tokens called xETH. Users can supply ETH or stETH to mint either
                one (pure ETH is zapped into stETH before deposit)
              </p>

              <h2>2. Can I get stETH back out again?</h2>

              <p>
                Yes! Every fETH or xETH token is instantly redeemable for stETH
                at any time, in the amount of its current NAV. The NAV of xETH
                and fETH change continuously with the price of ETH.
              </p>

              <h2>3. What is NAV?</h2>

              <p>
                NAV is net asset value. It’s the current value, as determined by
                the protocol, of fETH or xETH. You can mint or redeem xETH or
                fETH for their respective NAVs.
              </p>

              <h2>4. Why would I want fETH?</h2>

              <p>
                fETH can be used like a stablecoin. It’s decentralized (backed
                only by stETH) so it avoids exposure to the shenanigans of
                central banks or other IRL entities.
              </p>

              <p>
                fETH isn’t exactly a stablecoin, because it gains and loses a
                small amount of value as ETH rises and falls. Those price
                movements are fixed at 10% of the size of ETH’s. In this way
                it’s anchored to the Ethereum economy, rather than the US one.
                If you think that USD will devalue over time compared to ETH,
                you might like to hold it instead of USD stablecoins.
              </p>

              <h2>5. Why would I want xETH?</h2>

              <p>
                xETH provides powerful, free leverage on ETH. No funding rate,
                very low risk of liquidation. It’s a great token to amplify your
                gains on a long-term bet on ETH price growth.
              </p>

              <h2>6. Where can I trade it?</h2>

              <p>
                Mint and redeem on the f(x) website, or trade on{' '}
                <a
                  href="https://curve.fi/#/ethereum/pools"
                  target="_blank"
                  rel="noreferrer"
                >
                  Curve
                </a>
                !
              </p>

              <h2>7. What risks am I taking when I hold fETH/xETH?</h2>

              <p>
                f(x) was created to avoid centralized risks from real-world
                assets. Apart from smart contract and oracle risk, which are
                common to nearly all DeFi protocols, the main risk for f(x) is
                of an extreme outlier rapid ETH price drop which is larger than
                the ability of the currently minted xETH to absorb. In that case
                xETH price would go to zero (sort of like a liquidation) and
                fETH would lose its low volatility nature, reverting to 1:1 ETH
                price movements.
              </p>

              <p>
                f(x) has extensive and thoughtful risk management systems to
                prevent this from happening, clearly explained in the{' '}
                <a
                  href="https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/whitepapers/whitepaper_v2.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  whitepaper
                </a>
              </p>

              <h2>8. What’s the Rebalancing Pool?</h2>

              <p>
                The Rebalancing pool is a farming vault for fETH which earns
                high yields (in stETH!) sourced from the staking yields of the
                reserve. fETH in this vault can be automatically redeemed into
                stETH if the amount of fETH minted ever gets too high compared
                to xETH (see risks above, and{' '}
                <a
                  href="https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/whitepapers/whitepaper_v2.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  whitepaper
                </a>
                ). When this operation is needed, the protocol redeems only as
                much fETH as necessary to return the protocol to stability, with
                fETH sourced proportionally from all depositors. Two important
                notes:
              </p>
              <p>
                * 2-week waiting period after latest withdraw request, before
                withdrawal-requested fETH is claimable
              </p>
              <p>
                * until it is claimed, withdrawal-requested fETH earns no yield
                but may still be used for redemptions
              </p>
              <p>
                TL;DR: Deposit fETH to Rebalancing Pool to farm high stETH
                yields and periodically DCA into stETH 🙂
              </p>

              <h2>9. How much does it cost?</h2>

              <p>
                f(x) charges very small minting and redemption fees. Those can
                be avoided by swapping in and out on secondary (and some fees
                are waived in certain circumstances, see whitepaper).
              </p>
              <p>
                Aside from that, users do not pay any cost. Protocol revenue and
                stability services (see the Rebalancing pool above) come from
                staking yields earned by stETH in the reserve.
              </p>

              <h2>10. What is the "reference price"? </h2>
              <p>
                When f(x) reports the price change of ETH, we compare the
                current 30-minute TWAP from Chainlink with the reference price.
                To start with, the reference price was the price of ETH at the
                moment the protocol was turned on, but we update the reference
                price periodically whenever the current price deviates
                significantly. Doing this helps the numbers reported on the UI
                to reflect more recent price fluctuations Reference price
                updates do not affect the NAV of fETH or xETH.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
