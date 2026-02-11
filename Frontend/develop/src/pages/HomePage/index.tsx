import { useAppDispatch } from "../../store/hooks"
import { logout } from "../../store/auth"
import { LogOut, LayoutDashboard, Users, DollarSign, Activity, TrendingUp } from "lucide-react"

const HomePage = () => {
    const dispatch = useAppDispatch()
    // Assuming auth state has a user object with email or name. 
    // Based on authSlice, it has 'user' which is null initially or populated.
    // The 'login' thunk returns { access_token: string }, but doesn't seem to set 'user' details immediately unless encoded in token or fetched separately.
    // For now, I'll allow a fallback for user name.
    const user = localStorage.getItem("username")
    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex justify-between h-16 w-full">
                        <div className="flex items-center">
                            <LayoutDashboard className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">DevDashboard</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">Welcome, {user ? user : "User"}</div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Hero Section */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="mt-2 text-lg text-gray-600">Here's what's happening with your projects today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10 w-full">
                    {stats.map((item) => (
                        <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">{item.stat}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        View all
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    )
}

const stats = [
    { name: 'Total Subscribers', stat: '71,897', icon: Users, color: 'text-blue-500' },
    { name: 'Avg. Open Rate', stat: '58.16%', icon: Activity, color: 'text-green-500' },
    { name: 'Total Revenue', stat: '$24,500', icon: DollarSign, color: 'text-yellow-500' },
    { name: 'Growth', stat: '+12.5%', icon: TrendingUp, color: 'text-indigo-500' },
]

export default HomePage
