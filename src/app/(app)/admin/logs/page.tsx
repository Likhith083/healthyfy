"use client";
import { useEffect, useState } from "react";
import { getLogs, clearLogs, SystemLog } from "@/lib/systemLogs";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminSystemLogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SystemLog[]>([]);

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  if (!user || user.role !== "admin") {
    return <div className="p-8 text-center">Access denied. Admins only.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">System Logs</CardTitle>
          <CardDescription>View recent system events and actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={() => { clearLogs(); setLogs([]); }}>Clear Logs</Button>
          </div>
          {logs.length === 0 ? (
            <div className="text-muted-foreground text-center">No logs found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 border">Timestamp</th>
                    <th className="p-2 border">Message</th>
                    <th className="p-2 border">User</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 border whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="p-2 border">{log.message}</td>
                      <td className="p-2 border">
                        {log.user ? (
                          <span>{log.user.name} ({log.user.email}, {log.user.role})</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 