import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, Calendar, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
}

const ReportsDialog: React.FC<ReportsDialogProps> = ({ open, onOpenChange, isAdmin = false }) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateReport = async (type: string) => {
    setGenerating(true);
    setProgress(0);
    
    // Simulate report generation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          toast({
            title: "Report Generated",
            description: `${type} report has been generated and downloaded`,
          });
          return 100;
        }
        return prev + 20;
      });
    }, 500);
  };

  const reportTypes = isAdmin ? [
    { id: 'users', title: 'Users Report', description: 'Complete user analytics and activity' },
    { id: 'investments', title: 'Investments Report', description: 'All investment plans and performance' },
    { id: 'transactions', title: 'Transactions Report', description: 'Financial transactions summary' },
    { id: 'platform', title: 'Platform Report', description: 'Overall platform metrics and KPIs' }
  ] : [
    { id: 'portfolio', title: 'Portfolio Report', description: 'Your investment portfolio summary' },
    { id: 'earnings', title: 'Earnings Report', description: 'Detailed earnings breakdown' },
    { id: 'transactions', title: 'Transaction History', description: 'Your complete transaction history' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Generate Reports
          </DialogTitle>
          <DialogDescription>
            {isAdmin ? 'Generate comprehensive platform reports' : 'Generate your investment reports'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Reports</TabsTrigger>
            <TabsTrigger value="custom">Custom Range</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {reportTypes.map((report) => (
                <Card key={report.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">{report.title}</CardTitle>
                        <CardDescription className="text-xs">{report.description}</CardDescription>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => generateReport(report.title)}
                        disabled={generating}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Custom Date Range</CardTitle>
                <CardDescription className="text-xs">Select specific date range for reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">From Date</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded-md bg-background"
                      defaultValue="2024-01-01"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">To Date</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded-md bg-background"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => generateReport('Custom Range')}
                  disabled={generating}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Generate Custom Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {generating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Generating report...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportsDialog;