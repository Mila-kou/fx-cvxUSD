import React, { useState } from 'react'
import Button from '@/components/Button'
import styles from '../styles.module.scss'
import NoticeModal from './NoticeModal'

function InfoItem({ title, value, unit }) {
  return (
    <div className="my-2 text-[14px]">
      {title}: <span className="text-[var(--blue-color)] ">{value}</span> {unit}
    </div>
  )
}

export default function Cell({
  canClaim,
  claiming,
  handleClaim,

  onConvert,
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

  canClaimReward,
}) {
  let itemData = [
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
    // {
    //   title: 'Claimed Amount',
    //   value: claimedAmount,
    // },
  ]
  // if (symbol == 'FXN') {
  //   itemData = [
  //     ...itemData,
  //     {
  //       title: 'Claimed Amount',
  //       value: claimedAmount,
  //     },
  //   ]
  // }

  const [showNoticeModal, setShowNoticeModal] = useState(false)

  const goClaim = () => {
    setShowNoticeModal(false)
    handleClaim()
  }

  const goConvert = () => {
    setShowNoticeModal(false)
    onConvert()
  }

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

        <div className="flex justify-between pt-[16px] items-center">
          <div>
            {!!startTime && (
              <InfoItem title="Start Time" value={`${startTimeText}`} />
            )}
            {!!latestTime && (
              <InfoItem title="End Time" value={`${latestTimeText}`} />
            )}
          </div>
          <div className="flex justify-center gap-4 items-end">
            {onConvert ? (
              <div>
                <p className="text-[14px] text-[var(--yellow-color)]">
                  Earn 100% + APY
                </p>
                <Button
                  width="150px"
                  height="56px"
                  onClick={onConvert}
                  loading={converting}
                >
                  Convert
                </Button>
              </div>
            ) : null}
            {!(canClaim * 1) && (
              <Button
                width="150px"
                height="56px"
                onClick={() => setShowNoticeModal(true)}
                loading={claiming}
              >
                Claim
              </Button>
            )}
          </div>
        </div>
      </div>

      {canClaimReward ? (
        <div className="mt-[32px]">
          <h2 className="text-[18px]">Rewards</h2>
          <div className="flex justify-between">
            <div className="flex gap-[32px] items-center">
              {rewards.map((item) => (
                <div className="flex items-center gap-[8px]">
                  <div className="w-[26px] h-[26px] bg-[#fff] flex items-center justify-center rounded-full">
                    <img
                      className={`w-[${item.iconSize || '24'}px] h-[${
                        item.iconSize || '24'
                      }px]`}
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
              width="220px"
              height="56px"
              onClick={handleClaimReward}
              loading={claimRewarding}
            >
              Claim Rewards
            </Button>
          </div>
        </div>
      ) : null}

      {showNoticeModal ? (
        <NoticeModal
          onCancel={() => setShowNoticeModal(false)}
          goClaim={goClaim}
          goConvert={goConvert}
        />
      ) : null}
    </div>
  )
}
