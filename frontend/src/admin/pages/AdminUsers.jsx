import { Search, UserRound, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getAdminUsers } from '../../lib/api'

function AdminUsers() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: users = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAdminUsers,
    retry: 1,
  })

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return users

    return users.filter((user) =>
      [user.fullName, user.email, user.regNumber].some((value) =>
        value.toLowerCase().includes(query),
      ),
    )
  }, [searchTerm, users])

  if (isPending) {
    return (
      <div className="grid min-h-[420px] place-items-center rounded-2xl border border-black/10 bg-white">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-bookify-primary" />
          <p className="mt-3 text-sm font-semibold text-bookify-muted">
            Loading users...
          </p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="grid min-h-[320px] place-items-center rounded-2xl border border-red-200 bg-white px-5 text-center">
        <div>
          <p className="font-serif text-xl font-bold text-bookify-ink">
            Could not load users
          </p>
          <p className="mt-2 text-sm text-bookify-muted">
            {error.response?.data?.message ||
              'Please check your server connection and try again.'}
          </p>
          <button
            type="button"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
            }
            className="mt-5 rounded-xl bg-bookify-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-bookify-primary-dark"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="min-w-0 max-w-full pb-8">
      <label className="relative mb-5 block w-full sm:max-w-[380px]">
        <span className="sr-only">Search users</span>
        <Search
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bookify-muted"
        />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search name, email or registration number..."
          className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm text-bookify-ink outline-none transition placeholder:text-bookify-muted/80 focus:border-bookify-primary focus:ring-2 focus:ring-bookify-primary/15"
        />
      </label>

      <div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="hidden max-w-full overflow-x-auto md:block">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead className="bg-[#faf7f1]">
              <tr className="text-[11px] font-bold uppercase tracking-wide text-bookify-muted">
                <th className="px-4 py-3.5">Student</th>
                <th className="px-4 py-3.5">Registration number</th>
                <th className="px-4 py-3.5">Joined</th>
                <th className="px-4 py-3.5">Orders</th>
                <th className="px-4 py-3.5">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-black/10 transition hover:bg-bookify-primary/[0.025]"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bookify-primary/10 font-serif font-bold text-bookify-primary">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-bookify-ink">
                          {user.fullName}
                        </p>
                        <p className="mt-0.5 text-xs text-bookify-muted">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-bookify-ink">
                    {user.regNumber}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-bookify-muted">
                    {new Date(user.createdAt).toLocaleDateString('en-NG')}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-bookify-ink">
                    {user.orderCount}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-flex rounded-full bg-bookify-primary/10 px-2.5 py-1 text-xs font-bold text-bookify-primary"
                    >
                      Student
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-black/10 md:hidden">
          {filteredUsers.map((user) => (
            <article key={user._id} className="p-4">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-bookify-primary/10 text-bookify-primary">
                  <UserRound size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-bookify-ink">
                        {user.fullName}
                      </h2>
                      <p className="mt-0.5 truncate text-xs text-bookify-muted">
                        {user.email}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-bookify-primary/10 px-2 py-1 text-[10px] font-bold text-bookify-primary">
                      Student
                    </span>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-[#faf7f1] p-3">
                    <div>
                      <dt className="text-[10px] font-bold uppercase text-bookify-muted">
                        Reg. number
                      </dt>
                      <dd className="mt-1 text-xs font-semibold text-bookify-ink">
                        {user.regNumber}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-bold uppercase text-bookify-muted">
                        Orders
                      </dt>
                      <dd className="mt-1 text-xs font-semibold text-bookify-ink">
                        {user.orderCount}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="grid min-h-[260px] place-items-center px-5 py-12 text-center">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-xl bg-bookify-primary/10 text-bookify-primary">
                <Users size={25} />
              </span>
              <h2 className="mt-4 font-serif text-xl font-bold text-bookify-ink">
                No users found
              </h2>
              <p className="mt-1 text-sm text-bookify-muted">
                Try another name, email, or registration number.
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-black/10 bg-[#faf7f1] px-4 py-3 text-xs text-bookify-muted">
          Showing {filteredUsers.length} of {users.length} registered students
        </div>
      </div>
    </section>
  )
}

export default AdminUsers
