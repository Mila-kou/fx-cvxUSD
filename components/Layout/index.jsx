import AppHeader from '../AppHeader'

export default function Layout({ children }) {
  return (
    <div>
      <AppHeader />
      <main>{children}</main>
    </div>
  )
}
