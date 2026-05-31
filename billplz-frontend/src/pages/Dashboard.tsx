import { ArrowUpRight, CreditCard, DollarSign, TrendingUp, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const stats = [
  {
    title: "Total Revenue",
    value: "$12,450",
    change: "+12%",
    icon: DollarSign,
  },
  {
    title: "Active Subscriptions",
    value: "342",
    change: "+8%",
    icon: Users,
  },
  {
    title: "Transactions",
    value: "1,234",
    change: "+23%",
    icon: TrendingUp,
  },
  {
    title: "Avg. Order Value",
    value: "$36.50",
    change: "+5%",
    icon: CreditCard,
  },
];

const recentTransactions = [
  { id: "TXN001", customer: "john@example.com", amount: "$49.00", status: "Completed", date: "Jan 15, 2024" },
  { id: "TXN002", customer: "jane@example.com", amount: "$19.00", status: "Completed", date: "Jan 15, 2024" },
  { id: "TXN003", customer: "mike@example.com", amount: "$149.00", status: "Pending", date: "Jan 14, 2024" },
  { id: "TXN004", customer: "sarah@example.com", amount: "$49.00", status: "Completed", date: "Jan 14, 2024" },
  { id: "TXN005", customer: "alex@example.com", amount: "$19.00", status: "Failed", date: "Jan 13, 2024" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your payment overview.</p>
            </div>
            <Button className="mt-4 md:mt-0">
              <CreditCard className="w-4 h-4 mr-2" />
              New Transaction
            </Button>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Recent Transactions</h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {recentTransactions.map((transaction, index) => (
                  <div key={transaction.id}>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            {transaction.customer.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{transaction.customer}</p>
                          <p className="text-xs text-muted-foreground">{transaction.id} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{transaction.amount}</p>
                        <p className={`text-xs ${
                          transaction.status === 'Completed' ? 'text-primary' :
                          transaction.status === 'Pending' ? 'text-muted-foreground' :
                          'text-destructive'
                        }`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                    {index < recentTransactions.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
