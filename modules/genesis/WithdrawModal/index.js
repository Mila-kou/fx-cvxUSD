import React, { useState, useCallback, useEffect } from 'react'
import { Modal } from 'antd'
import Button from '@/components/Button'
import styles from './styles.module.scss'
import { cBN, fb4 } from '@/utils/index'
import { NoticeCard } from '@/modules/assets/components/Common'

export default function WithdrawModal(props) {
  const {
    onCancel,
    onClaim,
    info,
    isBaseToken,
    getMinoutBaseToken,
    isFullLaunched,
    assetSymbol,
  } = props
  const { xToken, symbol, baseSymbol, sharesRes } = info

  const NOTICE_MAP = {
    fxUSD:
      'You will lose at least 50% of the rewards which will be allocated proportionally to users who keep their position till the end of the seeding event',
    rUSD: `You will lose at least ${
      baseSymbol === 'ezETH' ? 'Renzo ezPoints' : 'Etherfi Points'
    }+EigenLayer Point, which will be proportionally distributed to users who maintain their positions till the end of the seeding event.`,
  }

  const [list, setList] = useState([])

  useEffect(() => {
    if (isBaseToken) {
      getMinoutBaseToken(symbol).then((res) => {
        const fee = cBN(sharesRes)
          .minus(res)
          .dividedBy(sharesRes)
          .multipliedBy(100)
          .toFormat(2)
        setList([
          {
            symbol: baseSymbol,
            amount: fb4(res),
            fee,
          },
        ])
      })
    } else {
      setList([
        {
          symbol: assetSymbol,
          amount: info.fToken_text,
        },
        {
          symbol: xToken,
          amount: info.xToken_text,
        },
        // {
        //   symbol: 'FXN',
        //   amount: '100',
        // },
      ])
    }
  }, [info, isBaseToken, getMinoutBaseToken])

  if (!isBaseToken && isFullLaunched) {
    return (
      <Modal
        visible={!!list.length}
        centered
        onCancel={onCancel}
        footer={null}
        width={500}
      >
        <div className={styles.content}>
          <h2 className="mb-[16px]">Withdraw</h2>

          <div className="mt-[6px] pl-[24px]">
            <p>You will receive:</p>
            {list.map((item) => (
              <p key={item.symbol} className="ml-[24px]">
                · {item.amount} {item.symbol}
                {item?.fee ? (
                  <p className="ml-[6px] mt-[6px] text-[16px] text-right  text-[var(--second-text-color)]">
                    {isBaseToken ? `( Withdraw Fee: ${item.fee}% )` : null}
                  </p>
                ) : null}
              </p>
            ))}
          </div>

          <div className="flex gap-[32px] mt-[32px]">
            <Button
              type="second"
              className="flex-1"
              size="large"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              size="large"
              style={{ background: 'var(--red-color)' }}
              onClick={() => onClaim(info.symbol)}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </Modal>
    )
  }

  if (!isBaseToken && !info.fxWithdrawalEnabled) {
    return (
      <Modal
        visible={!!list.length}
        centered
        onCancel={onCancel}
        footer={null}
        width={500}
      >
        <div className={styles.content}>
          <h2 className="mb-[16px]">Earn Partial Rewards only</h2>

          <div className="mt-[6px] pl-[24px]">
            <NoticeCard
              content={[
                `You can withdraw ${assetSymbol} + ${info.xToken} after the event.`,
              ]}
            />
            <div className="flex gap-[32px] mt-[32px]">
              <Button
                type="second"
                className="flex-1"
                size="large"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      visible={!!list.length}
      centered
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <div className={styles.content}>
        <h2 className="mb-[16px]">Earn Partial Rewards only</h2>

        <div className="mt-[6px] pl-[24px]">
          <p>You will receive:</p>
          {list.map((item) => (
            <p key={item.symbol} className="ml-[24px]">
              · {item.amount} {item.symbol}
              {item?.fee ? (
                <p className="ml-[6px] mt-[6px] text-[16px] text-right  text-[var(--second-text-color)]">
                  {isBaseToken ? `( Withdraw Fee: ${item.fee}% )` : null}
                </p>
              ) : null}
            </p>
          ))}
          {/* <p className="mt-[16px] text-[var(--red-color)]">You will lost:</p>
          <p className="ml-[24px] text-[var(--red-color)] text-[16px]">
            · 1,000 Lido
          </p> 
          <p className="text-[16px] mt-[16px] leading-5 text-[var(--yellow-color)]">
            You will lose 50% rewards which will be allocated proportionally to
            users who keep their deposits in the seeding event until the very
            end.
          </p> */}

          <NoticeCard content={[NOTICE_MAP[assetSymbol]]} />
        </div>

        <div className="flex gap-[32px] mt-[32px]">
          <Button
            type="second"
            className="flex-1"
            size="large"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            size="large"
            style={{ background: 'var(--red-color)' }}
            onClick={() => onClaim(info.symbol)}
          >
            Withdraw
          </Button>
        </div>
      </div>
    </Modal>
  )
}
