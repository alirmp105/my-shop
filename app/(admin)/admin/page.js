


export default function AdminDashboard() {



  
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">داشبورد مدیریت</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "کاربران", value: "۲,۴۵۰", color: "bg-blue-500" },
          { title: "درآمد", value: "۴۵,۰۰۰ تومان", color: "bg-green-500" },
          { title: "سفارشات", value: "۱۲۵", color: "bg-purple-500" },
          { title: "محصولات", value: "۸۹۰", color: "bg-orange-500" },
        ].map((stat) => (
          <div key={stat.title} className="rounded-lg bg-white p-6 shadow-sm">
            <div className={`mb-4 h-2 w-12 rounded-full ${stat.color}`}></div>
            <h3 className="text-sm text-gray-600">{stat.title}</h3>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}