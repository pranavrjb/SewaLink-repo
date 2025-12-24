import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  Briefcase, 
  DollarSign,
  TrendingUp,
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield,
  Settings,
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminDashboardProps {
  user: User;
}

// Mock data
const recentUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "user", status: "active", joined: "Dec 22, 2025" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "provider", status: "pending", joined: "Dec 21, 2025" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", role: "user", status: "active", joined: "Dec 20, 2025" },
  { id: 4, name: "David Lee", email: "david@example.com", role: "provider", status: "active", joined: "Dec 19, 2025" },
  { id: 5, name: "Emma Wilson", email: "emma@example.com", role: "user", status: "suspended", joined: "Dec 18, 2025" },
];

const recentBookings = [
  { id: 1, service: "Plumbing", user: "Alice J.", provider: "John S.", amount: 50, status: "completed" },
  { id: 2, service: "Cleaning", user: "Bob W.", provider: "Maria G.", amount: 40, status: "in-progress" },
  { id: 3, service: "Electrical", user: "Carol D.", provider: "Mike J.", amount: 60, status: "pending" },
  { id: 4, service: "Painting", user: "Dave L.", provider: "Sarah K.", amount: 55, status: "completed" },
];

const pendingApprovals = [
  { id: 1, name: "New Provider Application", type: "provider", count: 5 },
  { id: 2, name: "Service Requests", type: "service", count: 12 },
  { id: 3, name: "Reported Issues", type: "report", count: 3 },
];

type TabType = "overview" | "users" | "providers" | "bookings" | "reports";

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: BarChart3 },
    { id: "users" as TabType, label: "Users", icon: Users },
    { id: "providers" as TabType, label: "Providers", icon: Briefcase },
    { id: "bookings" as TabType, label: "Bookings", icon: FileText },
    { id: "reports" as TabType, label: "Reports", icon: AlertTriangle },
  ];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Admin Dashboard
            </h1>
            <Badge className="bg-destructive/10 text-destructive border-destructive/20">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Welcome, {user.name}. Manage your platform from here.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            Generate Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2"
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-heading font-bold text-foreground">2,456</p>
                <p className="text-xs text-primary mt-1">+12% this month</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Providers</p>
                <p className="text-2xl font-heading font-bold text-foreground">342</p>
                <p className="text-xs text-accent mt-1">+8% this month</p>
              </div>
              <Briefcase className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-heading font-bold text-foreground">Rs.45,230</p>
                <p className="text-xs text-primary mt-1">+18% this month</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bookings</p>
                <p className="text-2xl font-heading font-bold text-foreground">1,892</p>
                <p className="text-xs text-primary mt-1">+15% this month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Users Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-48"
                  />
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.status === "active"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : user.status === "pending"
                              ? "bg-accent/10 text-accent border-accent/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <UserX className="w-4 h-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest service bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.service}</TableCell>
                      <TableCell>{booking.user}</TableCell>
                      <TableCell>{booking.provider}</TableCell>
                      <TableCell>Rs.{booking.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            booking.status === "completed"
                              ? "bg-primary/10 text-primary"
                              : booking.status === "in-progress"
                              ? "bg-accent/10 text-accent"
                              : "bg-secondary text-secondary-foreground"
                          }
                        >
                          {booking.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {booking.status === "in-progress" && <Clock className="w-3 h-3 mr-1" />}
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Approvals */}
          <Card className="border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-accent" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-accent/5 rounded-lg"
                >
                  <span className="text-sm">{item.name}</span>
                  <Badge className="bg-accent text-accent-foreground">
                    {item.count}
                  </Badge>
                </div>
              ))}
              <Button className="w-full mt-4" variant="outline">
                Review All
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>User Satisfaction</span>
                  <span className="font-medium text-primary">94%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "94%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Provider Rating</span>
                  <span className="font-medium text-primary">4.8/5</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: "96%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Issue Resolution</span>
                  <span className="font-medium text-primary">89%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "89%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/users">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/services">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Manage Services
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                View All Bookings
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Platform Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
