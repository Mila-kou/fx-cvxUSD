import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import styles from './styles.module.scss'
import { getFxThirdList } from '@/services/dataInfo'
import { fb4 } from '@/utils/index'
import { TOKEN_ICON_MAP } from '@/config/tokens'

export default function ThirdPools() {
  const { data: fxThirdList } = useQuery({
    queryKey: ['fxThirdList'],
    queryFn: () => getFxThirdList(),
    initialData: [],
  })

  const getApy = (apy) => {
    let arr = [`${apy}%`]
    if (typeof apy === 'object') {
      arr = [`Current: ${apy.current}%`]
      if (apy?.project) {
        arr.push([`Projected: ${apy.project}%`])
      }
    }
    return arr
  }

  const list = useMemo(() => {
    if (fxThirdList && Array.isArray(fxThirdList)) {
      return fxThirdList.map((item) => {
        const { name = '' } = item
        let icons = []
        if (name.includes('+')) {
          icons = name.split('+')
        } else if (name.includes('/')) {
          icons = name.split('/')
        } else {
          icons = [name]
        }
        return {
          ...item,
          iconList: icons.map((icon) => TOKEN_ICON_MAP[icon]),
        }
      })
    }
    return []
  }, [fxThirdList])

  return (
    <div>
      {list.map((item) => (
        <div key={item.id} className={styles.poolWrap}>
          <div className={styles.card}>
            <div className="w-[140px] text-[16px]">
              <div className="flex w-[230px] gap-[26px] items-center">
                <div className="flex items-center">
                  {item.iconList?.map((icon) => (
                    <div className="relative flex-shrink-0 mr-[-10px]">
                      <img className="w-[30px]" src={icon} />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[16px] h-[16px]">{item.name}</p>
                </div>
              </div>
            </div>
            <div className="flex pl-[20px] w-[70px] gap-[16px] items-center">
              <div>
                <p className="text-[16px]">{item.siteName}</p>
                <p className="text-[14px] text-[var(--second-text-color)]">
                  {item.chainName}
                </p>
              </div>
            </div>
            <div className="w-[30px] text-[16px]">{item.Category}</div>
            <div className="w-[40px] text-[16px]">{fb4(item.tvl, true, 0)}</div>
            <div className="w-[100px]">
              {getApy(item.apy).map((apy) => (
                <p className="text-[16px] text-center">{apy}</p>
              ))}
            </div>

            <div className="w-[70px] cursor-pointer ">
              <a
                href={item.Link}
                target="_blank"
                className="underline text-[var(--a-button-color)] flex gap-[6px] items-center"
                rel="noreferrer"
              >
                Open
                <img className="h-[16px]" src="/images/share.svg" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
