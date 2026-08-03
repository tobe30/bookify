import {
  AlertTriangle,
  Bell,
  CheckCheck,
  PackageCheck,
  ShoppingCart,
  UserPlus,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { adminNotifications } from '../../data/notifications'

const notificationIcons = {
  order: ShoppingCart,
  stock: AlertTriangle,
  user: UserPlus,
  delivery: PackageCheck,
}

const notificationColors = {
  order: 'bg-blue-50 text-blue-600',
  stock: 'bg-amber-50 text-amber-700',
  user: 'bg-violet-50 text-violet-600',
  delivery: 'bg-bookify-primary/10 text-bookify-primary',
}

function AdminNotifications() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(adminNotifications)
  const containerRef = useRef(null)
  const unreadCount = notifications.filter((notification) => !notification.read).length

  useEffect(() => {
    const closeDropdown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', closeDropdown)
    return () => document.removeEventListener('mousedown', closeDropdown)
  }, [])

  const markAsRead = (notificationId) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative grid size-10 place-items-center rounded-full border border-black/8 bg-white text-bookify-muted transition hover:text-bookify-primary"
        aria-label={`Admin notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-4 text-white ring-2 ring-[#faf6ef]">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <section className="absolute right-0 top-12 z-40 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_20px_55px_rgba(30,24,18,0.18)]">
          <header className="flex items-center justify-between gap-4 border-b border-black/10 px-4 py-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-bookify-ink">
                Notifications
              </h2>
              <p className="mt-0.5 text-xs text-bookify-muted">
                {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-bookify-primary hover:text-bookify-primary-dark"
              >
                <CheckCheck size={15} />
                Mark all read
              </button>
            )}
          </header>

          <div className="max-h-[420px] overflow-y-auto">
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type] ?? Bell

              return (
                <button
                  type="button"
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`flex w-full gap-3 border-b border-black/[0.06] px-4 py-4 text-left transition last:border-0 hover:bg-bookify-primary/[0.035] ${
                    notification.read ? 'bg-white' : 'bg-bookify-primary/[0.025]'
                  }`}
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${notificationColors[notification.type]}`}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-sm font-bold text-bookify-ink">
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-bookify-primary" />
                      )}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-bookify-muted">
                      {notification.message}
                    </span>
                    <span className="mt-1.5 block text-[10px] font-semibold text-bookify-primary">
                      {notification.time}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

export default AdminNotifications
