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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Download, Database, FileText, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
}

const BackupDialog: React.FC<BackupDialogProps> = ({ open, onOpenChange, isAdmin = false }) => {
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>(['portfolio', 'transactions']);
  const [backing, setBacking] = useState(false);
  const [progress, setProgress] = useState(0);

  const backupItems = isAdmin ? [
    { id: 'users', label: 'User Data', icon: Users, description: 'All user accounts and profiles' },
    { id: 'investments', label: 'Investment Data', icon: Database, description: 'Investment plans and active investments' },
    { id: 'transactions', label: 'Transaction History', icon: FileText, description: 'Complete transaction records' },
    { id: 'settings', label: 'Platform Settings', icon: Settings, description: 'Configuration and system settings' }
  ] : [
    { id: 'portfolio', label: 'Portfolio Data', icon: Database, description: 'Your investment portfolio' },
    { id: 'transactions', label: 'Transaction History', icon: FileText, description: 'Your transaction records' },
    { id: 'profile', label: 'Profile Information', icon: Users, description: 'Your account details' }
  ];

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const startBackup = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to backup",
        variant: "destructive"
      });
      return;
    }

    setBacking(true);
    setProgress(0);
    
    // Simulate backup process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBacking(false);
          
          // Simulate file download
          const element = document.createElement('a');
          const file = new Blob(['# CryptoVault Pro Backup\n\nBackup completed successfully!\nItems included: ' + selectedItems.join(', ')], {type: 'text/plain'});
          element.href = URL.createObjectURL(file);
          element.download = `cryptovault-backup-${new Date().toISOString().split('T')[0]}.txt`;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          
          toast({
            title: "Backup Complete",
            description: "Your data has been backed up and downloaded successfully",
          });
          onOpenChange(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            {isAdmin ? 'System Backup' : 'Data Backup'}
          </DialogTitle>
          <DialogDescription>
            {isAdmin ? 'Create a backup of platform data' : 'Download a backup of your personal data'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Select the data you want to include in your backup:
          </div>

          <div className="space-y-3">
            {backupItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleItemToggle(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <CardTitle className="text-sm">{item.label}</CardTitle>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {backing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Creating backup...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Your backup will be encrypted and downloaded to your device</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={backing}>
            Cancel
          </Button>
          <Button onClick={startBackup} disabled={backing}>
            {backing ? 'Creating Backup...' : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Start Backup
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BackupDialog;