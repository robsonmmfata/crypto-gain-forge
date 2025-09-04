import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Clock, Plus, Download, Shield, Users } from 'lucide-react';
import { mockDashboardStats, mockEarningsChartData, mockPortfolioData, mockBalanceHistory, mockTransactions } from '@/data/mockData';
import InvestmentDialog from '@/components/InvestmentDialog';
import WithdrawalDialog from '@/components/WithdrawalDialog';
import ReportsDialog from '@/components/ReportsDialog';
import NotificationDialog from '@/components/NotificationDialog';
import BackupDialog from '@/components/BackupDialog';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [investmentDialogOpen, setInvestmentDialogOpen] = useState(false);
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);

  const stats = mockDashboardStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's your investment portfolio overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-card to-surface border-card-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${stats.totalBalance.toLocaleString()}
              </div>
              <p className="text-xs text-success flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-surface border-card-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Invested
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${stats.totalInvested.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {stats.activeInvestments} active investments
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-surface border-card-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${stats.todayEarnings}
              </div>
              <Progress value={65} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                65% of daily target
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-surface border-card-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${stats.totalEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-success flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +25% ROI overall
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Earnings Chart */}
          <Card className="bg-card/80 backdrop-blur border-card-border">
            <CardHeader>
              <CardTitle className="text-foreground">Daily Earnings</CardTitle>
              <CardDescription>Your earnings over the last 15 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockEarningsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Portfolio Distribution */}
          <Card className="bg-card/80 backdrop-blur border-card-border">
            <CardHeader>
              <CardTitle className="text-foreground">Portfolio Distribution</CardTitle>
              <CardDescription>How your investments are allocated</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockPortfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockPortfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-1 gap-2 mt-4">
                {mockPortfolioData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Balance History & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance History */}
          <Card className="lg:col-span-2 bg-card/80 backdrop-blur border-card-border">
            <CardHeader>
              <CardTitle className="text-foreground">Balance History</CardTitle>
              <CardDescription>Your account balance growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockBalanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Bar dataKey="balance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card/80 backdrop-blur border-card-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription>Manage your investments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="investment" 
                size="lg" 
                className="w-full"
                onClick={() => setInvestmentDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Investment
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={() => setWithdrawalDialogOpen(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Withdraw Funds
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full"
                onClick={() => navigate('/plans')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Plans
              </Button>
              
              <div className="mt-6 pt-4 border-t border-card-border">
                <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setBackupDialogOpen(true)}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Backup Data
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setReportsDialogOpen(true)}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Generate Reports
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setNotificationDialogOpen(true)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-card/80 backdrop-blur border-card-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Transactions</CardTitle>
            <CardDescription>Your latest investment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'deposit' ? 'bg-success/20' :
                      transaction.type === 'withdrawal' ? 'bg-destructive/20' :
                      transaction.type === 'earnings' ? 'bg-accent/20' :
                      'bg-primary/20'
                    }`}>
                      {transaction.type === 'deposit' && <ArrowDownRight className="w-5 h-5 text-success" />}
                      {transaction.type === 'withdrawal' && <ArrowUpRight className="w-5 h-5 text-destructive" />}
                      {transaction.type === 'earnings' && <DollarSign className="w-5 h-5 text-accent" />}
                      {transaction.type === 'investment' && <TrendingUp className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground capitalize">
                        {transaction.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'deposit' || transaction.type === 'earnings' 
                        ? 'text-success' 
                        : transaction.type === 'withdrawal' 
                        ? 'text-destructive' 
                        : 'text-foreground'
                    }`}>
                      {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount}
                    </p>
                    <p className={`text-xs ${
                      transaction.status === 'completed' ? 'text-success' :
                      transaction.status === 'pending' ? 'text-accent' :
                      'text-destructive'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dialogs */}
        <InvestmentDialog 
          open={investmentDialogOpen}
          onOpenChange={setInvestmentDialogOpen}
        />
        <WithdrawalDialog
          open={withdrawalDialogOpen}
          onOpenChange={setWithdrawalDialogOpen}
        />
        <ReportsDialog
          open={reportsDialogOpen}
          onOpenChange={setReportsDialogOpen}
        />
        <NotificationDialog
          open={notificationDialogOpen}
          onOpenChange={setNotificationDialogOpen}
        />
        <BackupDialog
          open={backupDialogOpen}
          onOpenChange={setBackupDialogOpen}
        />
      </div>
    </div>
  );
};

export default Dashboard;