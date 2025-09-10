import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Tooltip, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Clock, Plus, Download, Shield, Users, Activity, Bell, Settings, Target, Calendar, Eye, EyeOff, RefreshCw, Zap } from 'lucide-react';
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
  const [showBalance, setShowBalance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const stats = mockDashboardStats;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  // Performance data for different periods
  const performanceData = {
    '1d': [
      { time: '00:00', value: 100, volume: 1200000 },
      { time: '04:00', value: 102.5, volume: 980000 },
      { time: '08:00', value: 98.2, volume: 1450000 },
      { time: '12:00', value: 105.8, volume: 2100000 },
      { time: '16:00', value: 107.3, volume: 1800000 },
      { time: '20:00', value: 109.1, volume: 1300000 },
    ],
    '7d': [
      { time: 'Mon', value: 100, volume: 15000000 },
      { time: 'Tue', value: 105.2, volume: 18000000 },
      { time: 'Wed', value: 103.8, volume: 16500000 },
      { time: 'Thu', value: 108.5, volume: 22000000 },
      { time: 'Fri', value: 112.3, volume: 19500000 },
      { time: 'Sat', value: 115.7, volume: 14000000 },
      { time: 'Sun', value: 118.2, volume: 12000000 },
    ],
    '30d': [
      { time: 'Week 1', value: 100, volume: 110000000 },
      { time: 'Week 2', value: 108.3, volume: 125000000 },
      { time: 'Week 3', value: 115.6, volume: 98000000 },
      { time: 'Week 4', value: 123.4, volume: 135000000 },
    ]
  };

  const notifications = [
    { id: 1, type: 'success', message: 'Investment plan completed successfully', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'New trading signal available', time: '4 hours ago' },
    { id: 3, type: 'warning', message: 'Portfolio rebalancing recommended', time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Portfolio performing well today
              <Badge variant="secondary" className="ml-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5%
              </Badge>
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="animate-fade-in"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Alerts ({notifications.length})
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-card to-surface border-card-border hover-scale transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Balance
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowBalance(!showBalance)}
                  className="h-6 w-6 p-0"
                >
                  {showBalance ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
                <Wallet className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {showBalance ? `$${stats.totalBalance.toLocaleString()}` : '••••••'}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-success flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12.5%
                </p>
                <Badge variant="secondary" className="text-xs">
                  This month
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-surface border-card-border hover-scale transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Invested
              </CardTitle>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs bg-success/10">
                  Active
                </Badge>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${stats.totalInvested.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                <span>{stats.activeInvestments} active plans</span>
                <Badge variant="secondary" className="text-xs">
                  <Target className="w-3 h-3 mr-1" />
                  85% allocated
                </Badge>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-surface border-card-border hover-scale transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Earnings
              </CardTitle>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-accent animate-pulse" />
                <DollarSign className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${stats.todayEarnings}
              </div>
              <Progress value={65} className="mt-2" />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  65% of target
                </p>
                <Badge variant="secondary" className="text-xs">
                  $125 to go
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-surface border-card-border hover-scale transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs bg-success/10 text-success">
                  +25% ROI
                </Badge>
                <ArrowUpRight className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${stats.totalEarnings.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-success flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +8.2% this week
                </p>
                <Badge variant="secondary" className="text-xs">
                  All time
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Performance Chart */}
        <Card className="mb-8 bg-card/80 backdrop-blur border-card-border">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Portfolio Performance
                </CardTitle>
                <CardDescription>Track your investment growth over time</CardDescription>
              </div>
              <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="mt-4 md:mt-0">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="1d">24H</TabsTrigger>
                  <TabsTrigger value="7d">7D</TabsTrigger>
                  <TabsTrigger value="30d">30D</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={performanceData[selectedPeriod]}>
                <defs>
                  <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#performanceGradient)"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Earnings Chart */}
          <Card className="bg-card/80 backdrop-blur border-card-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-success" />
                Daily Earnings
              </CardTitle>
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
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
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

          {/* Enhanced Portfolio Distribution */}
          <Card className="bg-card/80 backdrop-blur border-card-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Portfolio Distribution
              </CardTitle>
              <CardDescription>How your investments are allocated across plans</CardDescription>
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
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-1 gap-3 mt-4">
                {mockPortfolioData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground">
                        ${item.value.toLocaleString()}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {((item.value / mockPortfolioData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Balance History & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Enhanced Balance History */}
          <Card className="lg:col-span-2 bg-card/80 backdrop-blur border-card-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Balance History
              </CardTitle>
              <CardDescription>Your account balance growth over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockBalanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar 
                    dataKey="balance" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions & Notifications */}
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur border-card-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Manage your investments efficiently</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="investment" 
                  size="lg" 
                  className="w-full animate-fade-in hover-scale"
                  onClick={() => setInvestmentDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Investment
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full hover-scale"
                  onClick={() => setWithdrawalDialogOpen(true)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Withdraw Funds
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full hover-scale"
                  onClick={() => navigate('/plans')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Plans
                </Button>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover-scale"
                    onClick={() => setBackupDialogOpen(true)}
                  >
                    <Shield className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover-scale"
                    onClick={() => setReportsDialogOpen(true)}
                  >
                    <TrendingUp className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Card */}
            <Card className="bg-card/80 backdrop-blur border-card-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Bell className="w-5 h-5 text-accent" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="flex items-start gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'success' ? 'bg-success' :
                      notification.type === 'warning' ? 'bg-accent' :
                      'bg-primary'
                    }`} />
                    <div className="flex-1">
                      <p className="text-xs text-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => setNotificationDialogOpen(true)}
                >
                  View All
                </Button>
              </CardContent>
            </Card>
          </div>
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