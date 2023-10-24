import React from 'react'
import Button from '@/components/Button'
import styles from '../styles.module.scss'

function InfoItem({ title, value, unit }) {
  return (
    <div className="my-2">
      {title}: <span className="text-[var(--blue-color)]">{value}</span> {unit}
    </div>
  )
}

export default function Cell({
  canClaim,
  claiming,
  handleClaim,

  handleConvert,
  converting,

  totalClaimAble,
  canClaimText,
  notYetVestedText,
  claimedAmount,

  startTime,
  startTimeText,
  latestTime,
  latestTimeText,

  symbol,
  rewards = [],

  title,

  handleClaimReward,
  claimRewarding,
}) {
  const itemData = [
    {
      title: `Total No of ${symbol} Tokens`,
      value: totalClaimAble,
    },
    {
      title: 'Claimable',
      value: canClaimText,
    },
    {
      title: 'Not Yet Vested',
      value: notYetVestedText,
    },
    {
      title: 'Claimed Amount',
      value: claimedAmount,
    },
  ]

  return (
    <div className={styles.cell}>
      <div>
        <h2 className="flex gap-[6px]">
          {/* <img
            className="h-[22px]"
            src={`/images/vesting${theme === 'red' ? '' : '-white'}.svg`}
          /> */}
          {title}
        </h2>
        <div className={styles.items}>
          {itemData.map((item) => (
            <div className={styles.item} key={item.title}>
              <p>{item.title}</p>
              <h2>{item.value}</h2>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-10 items-center">
          <div className="">
            {!!startTime && (
              <InfoItem title="Start Time" value={`${startTimeText}`} />
            )}
            {!!latestTime && (
              <InfoItem title="End Time" value={`${latestTimeText}`} />
            )}
          </div>
          <div className="flex justify-center gap-4">
            {handleConvert ? (
              <Button
                width="150px"
                onClick={handleConvert}
                loading={converting}
              >
                Convert
              </Button>
            ) : null}
            {!!(canClaim * 1) && (
              <Button width="150px" onClick={handleClaim} loading={claiming}>
                Claim
              </Button>
            )}
          </div>
        </div>
      </div>

      {rewards.length ? (
        <div className="mt-32px">
          <h2>Rewards</h2>
          <div className="flex justify-between">
            <div className="flex gap-[32px] items-center">
              {rewards.map((item) => (
                <div className="flex items-center gap-[8px]">
                  <div className="w-[26px] h-[26px] bg-[#fff] flex items-center justify-center rounded-full">
                    <img
                      className={`w-[${item.iconSize || '24px'}] h-[${
                        item.iconSize || '24px'
                      }]`}
                      src={item.icon}
                    />
                  </div>
                  <div className="text-[var(--second-text-color)] pt-[6px]">
                    {item.symbol} {item.amount}
                  </div>
                </div>
              ))}
            </div>
            <Button
              width="200px"
              onClick={handleClaimReward}
              loading={claimRewarding}
            >
              Claim Rewards
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
