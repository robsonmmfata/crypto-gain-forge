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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Users, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({ open, onOpenChange, isAdmin = false }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: 'general',
    priority: 'medium',
    title: '',
    message: '',
    recipients: 'all'
  });
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!formData.title || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    
    // Simulate sending notification
    setTimeout(() => {
      setSending(false);
      toast({
        title: "Notification Sent",
        description: `Notification sent successfully to ${formData.recipients === 'all' ? 'all users' : formData.recipients}`,
      });
      onOpenChange(false);
      setFormData({
        type: 'general',
        priority: 'medium',
        title: '',
        message: '',
        recipients: 'all'
      });
    }, 2000);
  };

  const recipientOptions = isAdmin ? [
    { value: 'all', label: 'All Users', count: 156 },
    { value: 'active', label: 'Active Investors', count: 89 },
    { value: 'pending', label: 'Pending Withdrawals', count: 12 },
    { value: 'new', label: 'New Users (Last 30 days)', count: 23 }
  ] : [
    { value: 'admin', label: 'Administrator', count: 1 },
    { value: 'support', label: 'Support Team', count: 3 }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            {isAdmin ? 'Send Notification to Users' : 'Contact Support'}
          </DialogTitle>
          <DialogDescription>
            {isAdmin ? 'Send important notifications to platform users' : 'Send a message to support or admin'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Recipients</label>
            <Select value={formData.recipients} onValueChange={(value) => setFormData(prev => ({ ...prev, recipients: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {recipientOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      <Badge variant="secondary" className="ml-2">
                        {option.count}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Title *</label>
            <Input
              placeholder="Notification title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Message *</label>
            <Textarea
              placeholder="Type your message here..."
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span>
              {isAdmin 
                ? `This will be sent to ${recipientOptions.find(r => r.value === formData.recipients)?.count || 0} users`
                : 'Your message will be delivered to the selected recipients'
              }
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? 'Sending...' : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Notification
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;