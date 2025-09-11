import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, DollarSign, TrendingUp, Shield, Eye, Ban, CheckCircle, XCircle, Settings } from 'lucide-react';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import ReportsDialog from '@/components/ReportsDialog';
import NotificationDialog from '@/components/NotificationDialog';
import BackupDialog from '@/components/BackupDialog';

// Mock admin data
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', balance: 12500, totalInvested: 10000, status: 'active', joinDate: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', balance: 8500, totalInvested: 7000, status: 'active', joinDate: '2024-02-01' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', balance: 0, totalInvested: 5000, status: 'suspended', joinDate: '2024-01-20' },
];

const mockAdminStats = {
  totalUsers: 156,
  activeInvestments: 89,
  totalDeposits: 450000,
  totalWithdrawals: 125000,
  pendingWithdrawals: 12,
  dailyEarnings: 12500
};

const mockUserGrowthData = [
  { month: 'Jan', users: 45 },
  { month: 'Feb', users: 78 },
  { month: 'Mar', users: 92 },
  { month: 'Apr', users: 125 },
  { month: 'May', users: 143 },
  { month: 'Jun', users: 156 }
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [investments, setInvestments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [investmentPlans, setInvestmentPlans] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Carregar investimentos
        const investmentsData = await apiService.getUserInvestments();
        setInvestments(investmentsData);

        // Carregar transações
        const transactionsData = await apiService.getTransactionHistory(50);
        setTransactions(transactionsData);

        // Carregar planos de investimento
        const plansData = await apiService.getInvestmentPlans();
        setInvestmentPlans(plansData);
      } catch (error) {
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar alguns dados administrativos.",
          variant: "destructive",
        });
      }
    };

    if (user?.isAdmin) {
      fetchAdminData();
    }
  }, [user?.isAdmin]);

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUserAction = (action: string, userId: string) => {
    toast({
      title: "Action Completed",
      description: `User ${action} successfully`,
    });
  };

  const handleWithdrawalAction = (action: string, amount: number) => {
    toast({
      title: `Withdrawal ${action}`,
      description: `$${amount} withdrawal has been ${action.toLowerCase()}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your platform and monitor all activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-card to-surface border-card-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockAdminStats.totalUsers}</div>
              <p className="text-xs text-success">+12 this month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-surface border-card-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Investments</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockAdminStats.activeInvestments}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-surface border-card-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Deposits</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${mockAdminStats.totalDeposits.toLocaleString()}</div>
              <p className="text-xs text-success">+5.2% this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-surface border-card-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Withdrawals</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockAdminStats.pendingWithdrawals}</div>
              <p className="text-xs text-destructive">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <Card className="bg-card/80 backdrop-blur border-card-border">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly user registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockUserGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Investment Distribution */}
              <Card className="bg-card/80 backdrop-blur border-card-border">
                <CardHeader>
                  <CardTitle>Investment Plans Distribution</CardTitle>
                  <CardDescription>Active investments by plan type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Starter', value: 35, color: 'hsl(var(--primary))' },
                          { name: 'Professional', value: 45, color: 'hsl(var(--success))' },
                          { name: 'VIP Elite', value: 20, color: 'hsl(var(--accent))' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { color: 'hsl(var(--primary))' },
                          { color: 'hsl(var(--success))' },
                          { color: 'hsl(var(--accent))' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-card/80 backdrop-blur border-card-border">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and their accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Joined: {user.joinDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">${user.balance.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Invested: ${user.totalInvested.toLocaleString()}</p>
                        </div>
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                          {user.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleUserAction('viewed', user.id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {user.status === 'active' ? (
                            <Button size="sm" variant="destructive" onClick={() => handleUserAction('suspended', user.id)}>
                              <Ban className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="default" onClick={() => handleUserAction('activated', user.id)}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments">
            <Card className="bg-card/80 backdrop-blur border-card-border">
              <CardHeader>
                <CardTitle>Investment Management</CardTitle>
                <CardDescription>Monitor and manage all investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div>
                        <p className="font-medium">Investment #{investment.id}</p>
                        <p className="text-sm text-muted-foreground">Amount: ${investment.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Created: {new Date(investment.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                          {investment.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">Daily: {investment.dailyReturn}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="bg-card/80 backdrop-blur border-card-border">
              <CardHeader>
                <CardTitle>Transaction Management</CardTitle>
                <CardDescription>Review and approve pending transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.filter(t => t.status === 'pending').map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{transaction.type}</p>
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold">${transaction.amount}</p>
                          <p className="text-sm text-muted-foreground">{transaction.currency}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleWithdrawalAction('approved', transaction.amount)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleWithdrawalAction('rejected', transaction.amount)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur border-card-border">
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure platform parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Minimum Deposit</label>
                    <Input type="number" placeholder="100" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Platform Fee (%)</label>
                    <Input type="number" placeholder="2.5" />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Settings Saved",
                        description: "Platform settings have been updated successfully",
                      });
                    }}
                  >
                    Save Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur border-card-border">
                <CardHeader>
                  <CardTitle>Investment Plans</CardTitle>
                  <CardDescription>Manage investment plan configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {investmentPlans.map((plan) => (
                      <div key={plan.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {plan.dailyReturn}% daily • {plan.duration} days
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Plan Settings",
                              description: `${plan.name} plan settings opened for editing`,
                            });
                          }}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions for Admin */}
        <Card className="bg-card/80 backdrop-blur border-card-border mt-6">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>Administrative tools and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setBackupDialogOpen(true)}
              >
                <Shield className="w-4 h-4 mr-2" />
                System Backup
              </Button>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => setReportsDialogOpen(true)}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate Reports
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setNotificationDialogOpen(true)}
              >
                <Users className="w-4 h-4 mr-2" />
                Notify All Users
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dialogs */}
        <ReportsDialog
          open={reportsDialogOpen}
          onOpenChange={setReportsDialogOpen}
          isAdmin={true}
        />
        <NotificationDialog
          open={notificationDialogOpen}
          onOpenChange={setNotificationDialogOpen}
          isAdmin={true}
        />
        <BackupDialog
          open={backupDialogOpen}
          onOpenChange={setBackupDialogOpen}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;