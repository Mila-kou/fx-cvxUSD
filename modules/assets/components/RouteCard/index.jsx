import { Skeleton } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import cn from 'classnames'
import styles from './styles.module.scss'

export default function RouteCard({
  options,
  routeType = '',
  onSelect,
  onRefresh,
  loading,
}) {
  return (
    <div className="mt-[32px]">
      <div className="flex justify-between items-center">
        <p>Select a route to perform a swap</p>
        <ReloadOutlined className="cursor-pointer" onClick={onRefresh} />
      </div>
      <p className="text-second text-[14px]">
        Best route is selected based on net output.
      </p>

      {options.length > 0 ? (
        options.map((item, index) =>
          loading ? (
            <div className={cn(styles.cell)}>
              <Skeleton
                active
                title={false}
                paragraph={{
                  rows: 2,
                  width: '100%',
                  style: { marginTop: '5px' },
                }}
              />
            </div>
          ) : (
            <div
              key={item.routeType}
              className={cn(
                styles.cell,
                routeType === item.routeType && styles.selected,
                'py-[40px]'
              )}
              onClick={() => {
                if (routeType !== item.routeType && !loading) {
                  onSelect(item.routeType)
                }
              }}
            >
              <div className="flex">
                <p className="flex-1">
                  {item.amount_text}
                  <span className="text-third ml-[4px]">{item.symbol}</span>
                </p>
                {index === 0 ? (
                  <p className="text-green text-[14px]">BEST</p>
                ) : (
                  <p className="text-red text-[14px]">{item.diffRatio}%</p>
                )}
              </div>
              <div className="flex justify-between mt-[8px]">
                <p className="text-second text-[16px]">≈ ${item.usd}</p>
                <p className="text-second text-[16px]">via {item.routeType}</p>
              </div>
            </div>
          )
        )
      ) : (
        <div className={cn(styles.cell)}>
          <Skeleton
            active={loading}
            title={false}
            paragraph={{
              rows: 2,
              width: '100%',
              style: { marginTop: '5px' },
            }}
          />
        </div>
      )}
    </div>
  )
}
