import React, { useState } from 'react'
import Visible from 'components/Visible'
// import Tip from 'components/Tip'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import useWeb3 from 'hooks/useWeb3'
import { cBN, fb4 } from 'utils'
import cn from 'classnames'
import Button from 'components/Button'
// import Banner from 'components/Banner'
import useInfo from './controllers/useInfo'
// import LockModal from './components/LockModal'
// import LockMoreModal from './components/LockMoreModal'
// import ExtendModal from './components/ExtendModal'
// import LockerChart from './components/LockerChart'
// import { useVeCTR, useVeFXNFee } from '@/hooks/useContracts'
import styles from './styles.module.scss'

const InfoItem = ({ title, value }) => (
  <div className={`flex justify-between my-3 `}>
    <span className="color-blue">{title}</span>
    <span className="text-white">{value}</span>
  </div>
)

// const BannerData = (props) => {
//   const { data } = props
//   return (
//     <div className={styles.bannerData}>
//       {data.map((i) => (
//         <div key={i.title} className={styles.item}>
//           <div className={styles.title}>{i.title}</div>
//           <div className={styles.value}>{i.value}</div>
//           <div className={styles.desc}>{i.desc}</div>
//         </div>
//       ))}
//     </div>
//   )
// }

const RebateInfo = ({ info, preWeekData }) => {
  return (
    <div
      className={cn(
        styles.bgBlue,
        'flex flex-col justify-between p-6 text-base md:text-xl color-blue lg:p-12 mb-6'
      )}
    >
      <div>
        {/* <div className={cn(styles.boardTitle, 'text-lg font-semibold')}>Total veCTR Revenue</div> */}
        <div className="text-white font-medium mb-3">Total veCTR Revenue</div>
        <div className="flex items-center justify-between my-3">
          <div className="flex items-center gap-1">
            <div>Cumulative This Week</div>
            {/* <Tip
              title={`This week’s revenue sharing pool accumulates 50% of protocol fee starting from ${info.startTime}`}
              style={{ width: '300px' }}
            /> */}
          </div>

          <div className="text-white">
            {fb4(info.weekAmount)} aCRV
            {/* ≈ {fb4(info.weekVal, true)} */}
          </div>
        </div>
        <div className="flex items-center justify-between my-3">
          <div>Previous Week</div>
          <div className="text-white">
            {fb4(preWeekData.weekAmount)} aCRV
            {/* ≈ {fb4(preWeekData.weekVal, true)} */}
          </div>
        </div>
        <div className="flex items-center justify-between my-3">
          <div>Accumulate Till</div>
          <div className="text-white">{info.untilTime}</div>
        </div>
      </div>
    </div>
  )
}

const LockPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const pageData = useInfo(refreshTrigger)

  // console.log('hook-usedata-', pageData.weekReabte);
  return <div className={styles.vaultPage}>sss</div>
}

export default LockPage
