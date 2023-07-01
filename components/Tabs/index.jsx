import React, { useEffect, useState } from 'react'

export function TabsHeader(props) {
  const { onChange, options, headerItemClass } = props
  const [active, setActive] = useState(options[0])
  useEffect(() => {
    onChange?.(active)
  }, [active])

  return (
    <div className="ala-tabs">
      {options.map((i) => (
        <div
          key={i}
          onClick={() => setActive(i)}
          className={`header-item text-lg ${headerItemClass} ${
            i == active ? 'active' : ''
          }`}
        >
          {i}
        </div>
      ))}
    </div>
  )
}
