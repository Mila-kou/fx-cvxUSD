import React from 'react'
// import config from 'config'
// import { addToMetamask } from '@/utils/index'
import style from './style.module.scss'

const socialLinks = [
  {
    key: 'twitter',
    icon: <img src="/socials/twitter.svg" className={style.socialIcons} />,
    link: 'https://twitter.com/protocol_fx',
  },
  {
    key: 'medium',
    icon: <img src="/socials/medium.svg" className={style.socialIcons} />,
    link: 'https://medium.com/@protocol_fx_667',
  },
  {
    key: 'gitbook',
    icon: <img src="/socials/gitBook.svg" className={style.socialIcons} />,
    link: 'https://docs.aladdin.club/f-x-protocol',
  },
  {
    key: 'github',
    icon: <img src="/socials/gitHub.svg" className={style.socialIcons} />,
    link: 'https://github.com/AladdinDAO/',
  },
  {
    key: 'discord',
    icon: <img src="/socials/discord.svg" className={style.socialIcons} />,
    link: 'https://discord.gg/mCTXgANxWy',
  },
  {
    key: 'telegramm',
    icon: <img src="/socials/telegram.svg" className={style.socialIcons} />,
    link: 'https://t.me/aladdin_dao',
  },
]

const audits = [
  {
    title: 'clevCVX',
    link: 'https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_CLever_Report_v1.1.pdf',
  },
  {
    title: 'Furnace',
    link: 'https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_CLever_Furnace_Update_20221111.pdf',
  },
  {
    title: 'clevUSD',
    link: 'https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_AladdinDaoV3_ClevUSD_Strategy_Report.pdf',
  },
]

export default function AppFooter() {
  const addToken = () => {
    // addToMetamask(
    //   config.tokens.clev,
    //   'CLEV',
    //   18,
    //   `${window.location.origin}/${config.tokens.clev.toLowerCase()}.png`
    // )
  }

  return (
    <div className={style.footer}>
      <div className="container">
        <div className={style.footerInner}>
          <div className={style.linksWrapper}>
            <ul className={style.links}>
              <li>
                <a onClick={addToken}>Add CLEV to metamask</a>
              </li>
            </ul>
            <div className={style.footerTitle}>Audits</div>

            {/* <img
              src="/resources/images/audits/secbit.jpg"
              className="w-44 mb-4"
  /> */}

            <div className="flex items-center gap-2">
              {audits.map((item) => (
                <a
                  key={item.link}
                  rel="noopener noreferrer"
                  target="_blank"
                  href={item.link}
                  className=" text-gray-600 underline font-semibold text-xs"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          <div className={style.socials}>
            {socialLinks.map((item) => (
              <a
                key={item.key}
                target="_blank"
                rel="noopener noreferrer"
                alt={item.key}
                href={item.link}
                className={style.socialLink}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
        <div className={style.copyright}>
          <div className={style.risk}>
            This project is in beta. Use at your own risk.
          </div>
          Copyright © 2023 Aladdin ENS:
          <a
            className="text-[#5488fe] text-[14px] ml-[4px]"
            href="https://fxn.eth.limo/"
            target="_blank"
            rel="noreferrer"
          >
            fxn.eth
          </a>
        </div>
      </div>
    </div>
  )
}
