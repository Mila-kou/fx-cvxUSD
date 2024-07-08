import React, { useMemo, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { notification, Tooltip } from 'antd'
import cn from 'classnames'
import { InfoCircleOutlined } from '@ant-design/icons'
import useGlobal from '@/hooks/useGlobal'
import useWeb3 from '@/hooks/useWeb3'
import Button from '@/components/Button'
import {
  getInviteCodeInfo,
  getReferralUserInfo,
  getReferralConvex,
  getReferralStakedao,
  getReferralSocreRound1Score,
} from '@/services/referral'
import CreateModal from './components/CreateModal'
import BindModal from './components/BindModal'
import PointsPerToken from './components/PointsPerToken'
import MerkleTree from '@/modules/earningPool/MerkleTree'
import { convexAddresses, stakeDaoAddresses } from './helper/isRound1Address'
import styles from './styles.module.scss'

export default function BoosterAccountPage() {
  const { myCode, myInviter } = useGlobal()
  const { currentAccount } = useWeb3()
  const [modalType, setModalType] = useState('')

  const [
    { data: codeList },
    { data: referralUserInfo },
    { data: referralConvex },
    { data: referralStakedao },
    { data: referralSocreRound1Score },
  ] = useQueries({
    queries: [
      {
        queryKey: ['inviteCodeInfo', myCode],
        queryFn: () => getInviteCodeInfo(myCode),
        enabled: !!myCode,
        refetchInterval: 30000,
        initialData: [],
      },
      {
        queryKey: ['referralUserInfo', currentAccount],
        queryFn: () => getReferralUserInfo(currentAccount),
        enabled: !!currentAccount,
        refetchInterval: 30000,
        initialData: [],
      },
      {
        queryKey: ['referralConvex', currentAccount],
        queryFn: () => getReferralConvex(currentAccount),
        enabled: !!currentAccount,
        refetchInterval: 30000,
        initialData: {},
      },
      {
        queryKey: ['referralStakedao', currentAccount],
        queryFn: () => getReferralStakedao(currentAccount),
        enabled: !!currentAccount,
        refetchInterval: 30000,
        initialData: {},
      },
      {
        queryKey: ['referralSocreRound1Score'],
        queryFn: () => getReferralSocreRound1Score(),
        enabled: !!currentAccount,
        refetchInterval: 30000,
        initialData: {},
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

  const [referralConvexUsd, referralStakedaoUsd] = useMemo(() => {
    let c = Number(referralConvex?.usd || '0').toFixed(4)
    let s = Number(referralStakedao?.usd || '0').toFixed(4)
    if (convexAddresses.includes(currentAccount)) {
      c = '0.0000'
    }
    if (stakeDaoAddresses.includes(currentAccount)) {
      s = '0.0000'
    }
    return [c, s]
  }, [currentAccount, referralConvex, referralStakedao])

  return (
    <div className={styles.container}>
      {/* <h2 className="flex gap-[6px] mb-[32px]">fx Boost 1st Round 4/1-5/1</h2> */}

      <div className={styles.header}>
        <div className="flex justify-between mb-[24px]">
          <p className="flex gap-[6px] mb-[16px]">
            {/* <UserAddOutlined /> */}
            f(x) Referral Program 2nd Epoch
          </p>
        </div>
        <div className={styles.items}>
          <div className={styles.item}>
            <p>My FX Points</p>
            <h2 className="text-[22px] text-blue">
              {Number(referralUserInfo?.score || '0').toFixed(4)}
            </h2>
          </div>
          <div className={styles.item}>
            <p>My Convex Point Airdrop</p>
            <h2 className="text-[22px] text-blue">{referralConvexUsd}</h2>
          </div>
          <div className={styles.item}>
            <p>My StakeDAO Point Airdrop</p>
            <h2 className="text-[22px] text-blue">{referralStakedaoUsd}</h2>
          </div>
        </div>
      </div>

      <div className={cn(styles.header, 'mt-[24px]')}>
        <div className="flex justify-between mb-[8px]">
          <p className="flex gap-[6px] mb-[16px]">
            {/* <UserAddOutlined /> */}
            1st Epoch Rewards
          </p>
        </div>
        <div className="flex justify-between mb-[8px]">
          <p>FX Points:</p>
          <p className="text-second mb-[6px]">
            {referralSocreRound1Score?.[currentAccount]?.score || '-'}
          </p>
        </div>
        <p>Congratulations, the rewards you won in the last round</p>

        <MerkleTree title="" alwaysShow />
      </div>

      <div className={styles.content}>
        <h2 className="flex gap-[6px] mb-[32px]">Referral Center</h2>
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
          {/* <p>Action</p> */}
          <p>Points</p>
        </div>
        {codeList.length ? (
          codeList.map(({ signerAddress, action, points }) => (
            <div className="flex mt-[6px] justify-between">
              <p className="text-[var(--second-text-color)] text-[16px] w-[140px]">
                {`${signerAddress.slice(0, 6)}******${signerAddress.slice(-6)}`}
              </p>
              {/* <p className="text-[var(--second-text-color)] text-[16px]">
                {action || 'xxxx'}
              </p>  */}
              <p className="text-[var(--second-text-color)] text-[16px]">
                {points || '-'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-[var(--second-text-color)] text-center">
            No records yet.
          </p>
        )}
      </div>

      <div className={styles.content}>
        <h2 className="flex gap-[6px] mb-[16px]">FX points distribution</h2>

        {/* <PointsPerToken /> */}
        <p className="mt-[10px]">
          4 FX points/day for 1 fToken staked in any Stability Pool and/or LP on
          Convex/f(x).
        </p>
        <p className="mt-[10px]">
          2 FX points/day for 1 xToken held in wallet and/or LP on Convex/f(x).
        </p>
        <p className="mt-[10px]">
          50% - 50% split between referrer and referral.
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
        <h2
          className="flex gap-[6px] mb-[16px] justify-between"
          style={{ alignItems: 'center' }}
        >
          If you've been referred by a fellow degen
          <br />
          {/* {!myInviter && ( */}
          {/* <> */}
          please enter their referral code so you can both start earning FX
          points.
          {/* </> */}
          {/* )} */}
          {myInviter ? (
            <p className="text-blue text-[22px]">{myInviter}</p>
          ) : (
            <p
              className="text-[var(--a-button-color)] cursor-pointer"
              onClick={() => {
                if (!currentAccount) return
                setModalType('bind')
              }}
            >
              Enter a Referral Code
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
