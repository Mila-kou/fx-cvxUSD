import React from 'react'
import { CloseOutlined } from '@ant-design/icons'

import styles from './styles.module.scss'

export default function FAQ({ open, onCancel }) {
  console.log('open----', open)
  return (
    <div>
      {open ? (
        <div className={styles.faq}>
          <div className={styles.content}>
            <CloseOutlined onClick={onCancel} />
            <h1>f(x) FAQ</h1>

            <h2>1) What</h2>

            <p>
              f(x) allows you to transform your ETH into either a low-volatility
              “floating stablecoin” called fETH or a high volatility “leveraged
              ETH” called xETH. Use ETH to mint either one.
            </p>

            <h2>2) Can I get ETH back out again?</h2>

            <p>
              Yes! Every fETH or xETH token is redeemable for ETH at any time,
              in the amount of its current NAV. Since the NAV of xETH and fETH
              change continuously with the price of ETH, your (f,x)ETH tokens
              may be redeemable for more or less ETH than was used to mint them.
            </p>

            <h2>3) What is NAV?</h2>

            <p>
              NAV is net asset value. It’s the current price, as determined by
              the protocol, of fETH or xETH. You can mint or redeem xETH or fETH
              for their respective NAVs.{' '}
            </p>

            <h2>4) Why would I want fETH?</h2>

            <p>
              fETH is intended to be used like a stablecoin. It’s completely
              decentralized (backed only by ETH) so it avoids exposure to the
              shenanigans of central banks or other IRL entities.
            </p>

            <p>
              fETH isn’t a stablecoin exactly though, because it gains and loses
              a small amount of value as ETH rises and falls. Those price
              movements are only 10% of the size of ETH’s. In this way it’s
              anchored to the Ethereum economy, rather than the US one. If you
              think that USD will devalue over time compared to ETH, you might
              like to hold it instead of USD stablecoins.
            </p>

            <h2>5) Why would I want xETH?</h2>

            <p>
              That’s easy: xETH provides powerful, free leverage on ETH. No
              funding rate, very low risk of liquidation. It’s a great token to
              amplify your gains on a long-term bet on ETH price growth.
            </p>

            <h2>6) Where can I trade it?</h2>

            <p>
              There are secondary markets available to trade on Curve. There
              should be very little difference between minting/redeeming with
              f(x) and trading on secondary since arbitrage bots will keep the
              prices very close.
            </p>

            <h2>7)What risks am I taking when I hold fETH/xETH?</h2>

            <p>
              f(x) was designed specifically to create a scalable low volatility
              token (fETH) that avoids the common risks of centralized
              stablecoins, however nothing is without risk. Apart from smart
              contract and oracle risk, which are common to nearly all DeFi
              protocols, the main risk for f(x) is of an extreme outlier rapid
              ETH price drop which is larger than the ability of the currently
              minted xETH to absorb. In that case xETH price would go to zero
              (sort of like a liquidation) and fETH would lose its low
              volatility nature, essentially reverting to 1:1 ETH price
              movements.
            </p>

            <p>
              f(x) has extensive and thoughtful risk management systems to
              prevent this from happening, and we recommend further reading in
              the whitepaper to understand them.
            </p>

            <h2>8)How much does it cost?</h2>

            <p>
              f(x) charges a small minting and redemption fee, but those can be
              avoided by swapping in and out on secondary (and those fees are
              waived in certain circumstances, see whitepaper).
            </p>

            <p>
              Aside from that, if the amount of xETH ever becomes relatively too
              small compared to the amount of minted fETH, fETH holders will pay
              a small fee directly to xETH minters or fETH redeemers. These are
              very small since they are spread across all fETH holders via a
              small adjustment to the NAV and are only applied to incentivize
              the minimum minting/redemption to return the protocol to full
              stability. Again, see whitepaper for details.
            </p>

            <h2>9)What am I waiting for?</h2>

            <p>Good question!</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
