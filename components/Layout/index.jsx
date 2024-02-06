import AppHeader from '../AppHeader'
import AppFooter from '../AppFooter'
import AggressModal from '../AggressModal'

export default function Layout({ children }) {
  return (
    <div>
      <AppHeader />
      <main style={{ minHeight: 'calc(100vh - 390px)' }}>{children}</main>
      <AppFooter />
      <AggressModal />
    </div>
  )
}
