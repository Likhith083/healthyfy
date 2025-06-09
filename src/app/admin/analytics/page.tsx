import { Metadata } from 'next';
import { Activity, Calendar, Clock, Users, TrendingUp, Heart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/animations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Analytics Dashboard - Health Service Portal',
  description: 'Comprehensive analytics and insights for administrators.',
};

const stats = [
  {
    title: 'Total Patients',
    value: '2,543',
    change: '+12.5%',
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: 'Active Doctors',
    value: '156',
    change: '+5.2%',
    icon: <Heart className="h-6 w-6" />,
  },
  {
    title: 'Appointments Today',
    value: '89',
    change: '+8.1%',
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    title: 'Average Wait Time',
    value: '15 min',
    change: '-2.3%',
    icon: <Clock className="h-6 w-6" />,
  },
];

const metrics = [
  {
    title: 'Patient Satisfaction',
    value: '4.8/5',
    change: '+0.2',
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    title: 'Response Time',
    value: '2.5 min',
    change: '-0.5',
    icon: <Clock className="h-6 w-6" />,
  },
  {
    title: 'Active Discussions',
    value: '234',
    change: '+15',
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    title: 'System Uptime',
    value: '99.9%',
    change: '+0.1%',
    icon: <Activity className="h-6 w-6" />,
  },
];

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        {/* Header */}
        <section className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor system performance, user engagement, and key metrics.
          </p>
        </section>

        {/* Date Range Selector */}
        <section className="mb-8 animate-slide-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline">Last 7 Days</Button>
              <Button variant="outline">Last 30 Days</Button>
              <Button variant="outline">Last 90 Days</Button>
            </div>
            <Button>
              <Activity className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </section>

        {/* Key Stats */}
        <section className="mb-8 animate-slide-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      {stat.icon}
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      stat.change.startsWith('+') ? "text-green-500" : "text-red-500"
                    )}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="mb-8 animate-slide-in">
          <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <Card
                key={index}
                className="hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      {metric.icon}
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      metric.change.startsWith('+') ? "text-green-500" : "text-red-500"
                    )}>
                      {metric.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* User Activity */}
        <section className="mb-8 animate-slide-in">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Recent user interactions and system usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: 'New patient registration',
                    count: 45,
                    change: '+12%',
                  },
                  {
                    action: 'Appointments scheduled',
                    count: 128,
                    change: '+8%',
                  },
                  {
                    action: 'Messages sent',
                    count: 356,
                    change: '+15%',
                  },
                  {
                    action: 'Articles viewed',
                    count: 892,
                    change: '+23%',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div>
                      <h4 className="font-semibold">{activity.action}</h4>
                      <p className="text-sm text-muted-foreground">
                        {activity.count} in the last 24 hours
                      </p>
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      activity.change.startsWith('+') ? "text-green-500" : "text-red-500"
                    )}>
                      {activity.change}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* System Health */}
        <section className="animate-slide-in">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current system performance and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    metric: 'Server Response Time',
                    value: '120ms',
                    status: 'Healthy',
                  },
                  {
                    metric: 'Database Performance',
                    value: '98%',
                    status: 'Healthy',
                  },
                  {
                    metric: 'API Latency',
                    value: '85ms',
                    status: 'Healthy',
                  },
                  {
                    metric: 'Error Rate',
                    value: '0.1%',
                    status: 'Healthy',
                  },
                ].map((health, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div>
                      <h4 className="font-semibold">{health.metric}</h4>
                      <p className="text-sm text-muted-foreground">
                        Current: {health.value}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-500">
                      {health.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
} 