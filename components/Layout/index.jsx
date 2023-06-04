import AppHeader from '../AppHeader'
import AppFooter from '../AppFooter'

export default function Layout({ children }) {
  return (
    <div>
      <AppHeader />
      <main>{children}</main>
      <AppFooter />
    </div>
  )
}
