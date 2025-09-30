
export default async function Dashboard() {
 
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium">Welcome</h2>
          <p className="mt-1 text-sm text-gray-500">
            You are successfully logged in.
          </p>
        </div>
      </div>
      
      {/* Dashboard content goes here */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Sample cards */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            <p className="mt-1 text-sm text-gray-500">Your recent actions and updates</p>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <h3 className="text-lg font-medium">Statistics</h3>
            <p className="mt-1 text-sm text-gray-500">Key metrics and performance data</p>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <h3 className="text-lg font-medium">Quick Actions</h3>
            <p className="mt-1 text-sm text-gray-500">Common tasks and shortcuts</p>
          </div>
        </div>
      </div>
    </div>
  );
}