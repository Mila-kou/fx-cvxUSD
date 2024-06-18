import React from 'react'
import ArUSDPoolCell from './components/ArUSDPoolCell'
import useArUSDController from './controller/useArUSDController'

export default function ArUSDPools() {
  const arUSD_pool = useArUSDController()

  return (
    <div>
      <div>
        <div className="font-bold mb-[10px] flex items-center">
          FX² Autocompounding Pool{' '}
          <div className="flex items-center gap-[10px] text-[14px] font-normal ml-[10px] text-[var(--second-text-color)]">
            Powered by{' '}
            <a
              href="https://concentrator.aladdin.club/vaults/"
              target="_blank"
              rel="noreferrer"
            >
              <img className="h-[30px]" src="/assets/concentrator-logo.svg" />
            </a>
          </div>
        </div>
        <div className="px-[16px] flex justify-between">
          <div className="w-[230px]" />
          <div className="w-[120px] text-[14px]">AUM</div>
          <div className="w-[200px] text-[14px]">APR</div>
          <div className="w-[110px] text-[14px]">Index</div>
          <div className="w-[100px] text-[14px]">My Balance</div>
          <div className="w-[20px]" />
        </div>
      </div>

      <ArUSDPoolCell
        title="arUSD"
        subTitle={<p className="text-[14px]">rUSD Stability Pool</p>}
        {...arUSD_pool}
      />
    </div>
  )
}
