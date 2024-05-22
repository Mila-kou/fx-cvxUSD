import React, { useMemo, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { notification } from 'antd'
import useGlobal from '@/hooks/useGlobal'
import useWeb3 from '@/hooks/useWeb3'
import Button from '@/components/Button'
import { getInviteCodeInfo } from '@/services/referral'
import CreateModal from './components/CreateModal'
import BindModal from './components/BindModal'
import PointsPerToken from './components/PointsPerToken'
import styles from './styles.module.scss'

export default function BoosterAccountPage() {
  const { myCode, myInviter } = useGlobal()
  const { currentAccount } = useWeb3()
  const [modalType, setModalType] = useState('')

  const [{ data: codeList }] = useQueries({
    queries: [
      {
        queryKey: ['inviteCodeInfo', myCode],
        queryFn: () => getInviteCodeInfo(myCode),
        enabled: !!myCode,
        refetchInterval: 10000,
        initialData: [],
      },
    ],
  })

  const getTwitterShareUrl = () => {
    const message = `I'm getting leveraged LRT Points / BTC / ETH on my stablecoins & liquidation-free leverage on @protocol_fx. Use my referral code and start earning too:`

    return `http://twitter.com/intent/tweet?text=${encodeURIComponent(
      message
    )}&url=${encodeURIComponent(getUrl())}`
  }

  const getUrl = () => `${window.location.origin}/assets/?code=${myCode}`

  const onCopy = () => {
    navigator.clipboard.writeText(getUrl())
    notification.success({
      description: `Referral link copied to your clipboard`,
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className="flex gap-[6px] mb-[32px]">My Account</h2>
        <h2 className="flex gap-[6px] mb-[16px] justify-between">
          My Referral Link
          {!myCode && (
            <Button
              disabled={!currentAccount}
              onClick={() => setModalType('create')}
              size="small"
            >
              Create My Link
            </Button>
          )}
        </h2>
        {!!myCode && (
          <div className="flex items-center gap-[10px]">
            <input value={getUrl()} disabled />
            <Button onClick={onCopy} className="flex-shrink-0" size="small">
              Copy Link
            </Button>
            <a href={getTwitterShareUrl()} target="_blank" rel="noreferrer">
              <img className="w-[30px]" src="/socials/twitter.svg" />
            </a>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h2 className="flex gap-[6px] mb-[16px]">My Referrals</h2>

        <div className="flex justify-between">
          <p className="w-[140px]">Address</p>
          {/* <p>Action</p>
        <p>Points</p> */}
        </div>
        {codeList.length ? (
          codeList.map(({ signerAddress, action, points }) => (
            <div className="flex mt-[6px] justify-between">
              <p className="text-[var(--second-text-color)] text-[16px] w-[140px]">
                {`${signerAddress.slice(0, 6)}******${signerAddress.slice(-6)}`}
              </p>
              {/* <p className="text-[var(--second-text-color)] text-[16px]">
                {action || 'xxxx'}
              </p>
              <p className="text-[var(--second-text-color)] text-[16px]">
                {points || 'xxxx'}
          </p> */}
            </div>
          ))
        ) : (
          <p className="text-[var(--second-text-color)] text-center">
            No records yet.
          </p>
        )}
      </div>

      <div className={styles.content}>
        <h2 className="flex gap-[6px] mb-[16px]">How to earn?</h2>

        {/* <PointsPerToken /> */}
        <p className="mt-[10px]">
          4 FX/day for 1 fToken staked in any Stability Pool and/or LP on
          Convex/f(x).
        </p>
        <p className="mt-[10px]">
          2 FX/day for 1 xToken held in wallet and/or LP on Curve/Convex/f(x).
        </p>
        <p className="mt-[10px]">
          50% - 50% FX split between referrer and referral.
        </p>
        {/* <div className="flex justify-between mt-[10px]">
          <p>Hold in wallets or staked in the stability pools</p>
          <p>
            <span className="text-[var(--yellow-color)] ">1x Points</span> per
            Token/Day
          </p>
        </div> */}
      </div>

      <div className={styles.content}>
        <h2 className="flex gap-[6px] mb-[16px] justify-between">
          Your Invite Code
          {myInviter ? (
            <p>{myInviter}</p>
          ) : (
            <p
              className="text-[var(--a-button-color)] cursor-pointer"
              onClick={() => {
                if (!currentAccount) return
                setModalType('bind')
              }}
            >
              Enter a Code
            </p>
          )}
        </h2>
      </div>

      {modalType === 'create' && (
        <CreateModal onCancel={() => setModalType('')} />
      )}
      {modalType === 'bind' && <BindModal onCancel={() => setModalType('')} />}
    </div>
  )
}
