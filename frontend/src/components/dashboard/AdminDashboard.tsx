import { useState, useEffect } from "react";
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
  Eye,
  Loader2,
  RefreshCw,
  Download,
  X,
  Trash2,
  Edit
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminDashboardProps {
  user: User;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt: string;
}

interface AdminService {
  _id: string;
  title: string;
  category: string;
  price: number;
  provider: {
    _id: string;
    name: string;
    email: string;
  };
  status?: string;
  createdAt: string;
}

interface AdminBooking {
  _id: string;
  service: {
    _id: string;
    title: string;
    category: string;
    price: number;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  pendingProviders: number;
  pendingBookings: number;
  reportedIssues: number;
}

interface ConfirmDialog {
  isOpen: boolean;
  title: string;
  description: string;
  action: () => void;
  variant?: "default" | "destructive";
}

interface UserDetailsDialog {
  isOpen: boolean;
  user: AdminUser | null;
  stats?: {
    totalServices?: number;
    totalBookings?: number;
    averageRating?: string;
    totalReviews?: number;
  };
}

type TabType = "overview" | "users" | "providers" | "bookings" | "services";

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [providers, setProviders] = useState<AdminUser[]>([]);
  const [services, setServices] = useState<AdminService[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    variant: "default"
  });
  const [userDetailsDialog, setUserDetailsDialog] = useState<UserDetailsDialog>({
    isOpen: false,
    user: null,
    stats: undefined
  });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");

  const { toast } = useToast();

  const fetchAdminData = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      else setIsRefreshing(true);

      const [usersRes, bookingsRes, statsRes, servicesRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/bookings"),
        api.get("/admin/stats"),
        api.get("/admin/services")
      ]);

      setUsers(usersRes.data.users || usersRes.data || []);
      setBookings(bookingsRes.data.bookings || bookingsRes.data || []);
      setServices(servicesRes.data.services || servicesRes.data || []);
      setStats(statsRes.data);

      // Fetch providers separately
      const providersRes = await api.get("/admin/providers");
      setProviders(providersRes.data.providers || []);

      if (!showLoading) {
        toast({
          title: "Data refreshed",
          description: "Dashboard data has been updated successfully.",
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch admin data:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch admin data",
        variant: "destructive",
      });
      
      setStats({
        totalUsers: 0,
        totalProviders: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingProviders: 0,
        pendingBookings: 0,
        reportedIssues: 0
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: BarChart3 },
    { id: "users" as TabType, label: "Users", icon: Users },
    { id: "providers" as TabType, label: "Providers", icon: Briefcase },
    { id: "services" as TabType, label: "Services", icon: FileText },
    { id: "bookings" as TabType, label: "Bookings", icon: Clock },
  ];

  // Filter functions
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus = filterStatus === "all" || (u.status || "active") === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredProviders = providers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || (p.status || "active") === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredServices = services.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.service?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         b.user?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // User Actions
  const handleViewUserDetails = async (userId: string) => {
    try {
      const response = await api.get(`/admin/user/${userId}`);
      setUserDetailsDialog({
        isOpen: true,
        user: response.data.user,
        stats: response.data.stats
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch user details",
        variant: "destructive",
      });
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/user/${userId}/role`, { role: newRole });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      fetchAdminData(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleSuspendUser = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      await api.put(`/admin/user/${userId}/status`, { status: newStatus });
      toast({
        title: "Success",
        description: `User ${newStatus === "suspended" ? "suspended" : "activated"} successfully`,
      });
      fetchAdminData(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/admin/user/${userId}`);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      fetchAdminData(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  // Provider Actions
  const handleApproveProvider = async (providerId: string) => {
    try {
      await api.put(`/admin/provider/${providerId}/approve`);
      toast({
        title: "Success",
        description: "Provider approved successfully",
      });
      fetchAdminData(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve provider",
        variant: "destructive",
      });
    }
  };

  // Service Actions
  const handleDeleteService = async (serviceId: string) => {
    try {
      await api.delete(`/admin/service/${serviceId}`);
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
      fetchAdminData(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  // Booking Actions
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await api.put(`/admin/booking/${bookingId}/status`, { status: newStatus });
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
      fetchAdminData(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const handleGenerateReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      stats,
      summary: {
        totalUsers: users.length,
        totalProviders: providers.length,
        totalServices: services.length,
        totalBookings: bookings.length,
        completedBookings: bookings.filter(b => b.status === "completed").length,
        pendingBookings: bookings.filter(b => b.status === "pending").length,
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-report-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "Admin report has been downloaded successfully",
    });
  };

  const completedBookings = bookings.filter(b => b.status === "completed");
  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.service?.price || 0), 0);
  const providerCount = users.filter(u => u.role === "provider").length;

  const pendingApprovals = [
    { 
      id: 1, 
      name: "New Provider Applications", 
      type: "provider", 
      count: stats?.pendingProviders || providers.filter(p => p.status === "pending").length,
      action: () => {
        setActiveTab("providers");
        setFilterStatus("pending");
      }
    },
    { 
      id: 2, 
      name: "Pending Bookings", 
      type: "booking", 
      count: stats?.pendingBookings || bookings.filter(b => b.status === "pending").length,
      action: () => {
        setActiveTab("bookings");
        setFilterStatus("pending");
      }
    },
    { 
      id: 3, 
      name: "Reported Issues", 
      type: "report", 
      count: stats?.reportedIssues || 0,
      action: () => {
        toast({
          title: "Coming Soon",
          description: "Reports management feature is under development",
        });
      }
    },
  ];

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    switch (activeTab) {
      case "users":
        return renderUsersTable();
      case "providers":
        return renderProvidersTable();
      case "services":
        return renderServicesTable();
      case "bookings":
        return renderBookingsTable();
      default:
        return renderOverview();
    }
  };

  const renderUsersTable = () => (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage platform users</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="provider">Provider</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          {(filterRole !== "all" || filterStatus !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterRole("all");
                setFilterStatus("all");
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
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
            {filteredUsers.map((u) => (
              <TableRow key={u._id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      u.status === "active" || !u.status
                        ? "bg-primary/10 text-primary border-primary/20"
                        : u.status === "pending"
                        ? "bg-accent/10 text-accent border-accent/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    {u.status || "active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(u.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card">
                      <DropdownMenuItem onClick={() => handleViewUserDetails(u._id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: `${u.status === "suspended" ? "Activate" : "Suspend"} User`,
                            description: `Are you sure you want to ${u.status === "suspended" ? "activate" : "suspend"} ${u.name}?`,
                            action: () => handleSuspendUser(u._id, u.status || "active"),
                            variant: "default"
                          });
                        }}
                      >
                        {u.status === "suspended" ? (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        ) : (
                          <>
                            <UserX className="w-4 h-4 mr-2" />
                            Suspend
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: "Delete User",
                            description: `Are you sure you want to delete ${u.name}? This action cannot be undone and will delete all related data.`,
                            action: () => handleDeleteUser(u._id),
                            variant: "destructive"
                          });
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderProvidersTable = () => (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Service Providers</CardTitle>
          <CardDescription>Manage service providers and applications</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          {filterStatus !== "all" && (
            <Button variant="ghost" size="sm" onClick={() => setFilterStatus("all")}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProviders.map((p: any) => (
              <TableRow key={p._id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      p.status === "active" || !p.status
                        ? "bg-primary/10 text-primary border-primary/20"
                        : p.status === "pending"
                        ? "bg-accent/10 text-accent border-accent/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    {p.status || "active"}
                  </Badge>
                </TableCell>
                <TableCell>{p.stats?.totalServices || 0}</TableCell>
                <TableCell>{p.stats?.totalBookings || 0}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(p.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card">
                      <DropdownMenuItem onClick={() => handleViewUserDetails(p._id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {p.status === "pending" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: "Approve Provider",
                                description: `Approve ${p.name} as a service provider?`,
                                action: () => handleApproveProvider(p._id),
                                variant: "default"
                              });
                            }}
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Approve Provider
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: `${p.status === "suspended" ? "Activate" : "Suspend"} Provider`,
                            description: `Are you sure you want to ${p.status === "suspended" ? "activate" : "suspend"} ${p.name}?`,
                            action: () => handleSuspendUser(p._id, p.status || "active"),
                            variant: "default"
                          });
                        }}
                      >
                        {p.status === "suspended" ? (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        ) : (
                          <>
                            <UserX className="w-4 h-4 mr-2" />
                            Suspend
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredProviders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No providers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderServicesTable = () => (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>All Services</CardTitle>
          <CardDescription>Manage platform services</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((s) => (
              <TableRow key={s._id}>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{s.provider?.name || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{s.provider?.email || ""}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {s.category}
                  </Badge>
                </TableCell>
                <TableCell>Rs.{s.price}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(s.createdAt), "MMM d, yyyy")}
                </TableCell>
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
                        View Service
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: "Delete Service",
                            description: `Are you sure you want to delete "${s.title}"? This will also delete all related bookings.`,
                            action: () => handleDeleteService(s._id),
                            variant: "destructive"
                          });
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Service
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredServices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No services found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderBookingsTable = () => (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Manage platform bookings</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          {filterStatus !== "all" && (
            <Button variant="ghost" size="sm" onClick={() => setFilterStatus("all")}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell className="font-medium">{booking.service?.title || "N/A"}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{booking.user?.name || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{booking.user?.email || ""}</p>
                  </div>
                </TableCell>
                <TableCell>${booking.service?.price || 0}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(booking.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      booking.status === "completed"
                        ? "bg-primary/10 text-primary"
                        : booking.status === "accepted"
                        ? "bg-accent/10 text-accent"
                        : booking.status === "pending"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-destructive/10 text-destructive"
                    }
                  >
                    {booking.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {booking.status === "accepted" && <Clock className="w-3 h-3 mr-1" />}
                    {booking.status}
                  </Badge>
                </TableCell>
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
                      {booking.status !== "completed" && booking.status !== "cancelled" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: "Update Booking Status",
                                description: "Mark this booking as completed?",
                                action: () => handleUpdateBookingStatus(booking._id, "completed"),
                                variant: "default"
                              });
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: "Cancel Booking",
                                description: "Are you sure you want to cancel this booking?",
                                action: () => handleUpdateBookingStatus(booking._id, "cancelled"),
                                variant: "destructive"
                              });
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel Booking
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("users")}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.slice(0, 5).map((u) => (
                    <TableRow key={u._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            u.status === "active" || !u.status
                              ? "bg-primary/10 text-primary border-primary/20"
                              : u.status === "pending"
                              ? "bg-accent/10 text-accent border-accent/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          {u.status || "active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(u.createdAt), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest service bookings</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("bookings")}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.slice(0, 5).map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell className="font-medium">{booking.service?.title || "N/A"}</TableCell>
                      <TableCell>{booking.user?.name || "N/A"}</TableCell>
                      <TableCell>Rs.{booking.service?.price || 0}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(booking.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            booking.status === "completed"
                              ? "bg-primary/10 text-primary"
                              : booking.status === "accepted"
                              ? "bg-accent/10 text-accent"
                              : booking.status === "pending"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-destructive/10 text-destructive"
                          }
                        >
                          {booking.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {booking.status === "accepted" && <Clock className="w-3 h-3 mr-1" />}
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

        <div className="space-y-6">
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
                  className="flex items-center justify-between p-3 bg-accent/5 rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                  onClick={item.action}
                >
                  <span className="text-sm">{item.name}</span>
                  <Badge className="bg-accent text-accent-foreground">
                    {item.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Booking Success Rate</span>
                  <span className="font-medium text-primary">
                    {bookings.length > 0 
                      ? Math.round((completedBookings.length / bookings.length) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all" 
                    style={{ 
                      width: `${bookings.length > 0 
                        ? Math.round((completedBookings.length / bookings.length) * 100) 
                        : 0}%` 
                    }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Active Providers</span>
                  <span className="font-medium text-primary">
                    {stats?.totalProviders || providerCount}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Transactions</span>
                  <span className="font-medium text-primary">{completedBookings.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline" 
                onClick={() => setActiveTab("users")}
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setActiveTab("services")}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Manage Services
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setActiveTab("bookings")}
              >
                <FileText className="w-4 h-4 mr-2" />
                View All Bookings
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Platform settings feature is under development",
                })}
              >
                <Settings className="w-4 h-4 mr-2" />
                Platform Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );

  return (
    <div className="container py-4 sm:py-8 px-4">
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
          <Button 
            variant="outline"
            onClick={() => fetchAdminData(false)}
            disabled={isRefreshing}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          {/* <Button variant="outline" onClick={handleGenerateReport} size="sm">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Report</span>
          </Button> */}
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery("");
              setFilterStatus("all");
              setFilterRole("all");
            }}
            className="flex items-center gap-2 whitespace-nowrap"
            size="sm"
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {isLoading ? "-" : stats?.totalUsers || users.length}
                </p>
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
                <p className="text-2xl font-heading font-bold text-foreground">
                  {isLoading ? "-" : stats?.totalProviders || providerCount}
                </p>
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
                <p className="text-2xl font-heading font-bold text-foreground">
                  Rs.{isLoading ? "-" : stats?.totalRevenue || totalRevenue}
                </p>
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
                <p className="text-2xl font-heading font-bold text-foreground">
                  {isLoading ? "-" : stats?.totalBookings || bookings.length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {activeTab !== "overview" && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}

      {renderTabContent()}

      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.variant}
              onClick={() => {
                confirmDialog.action();
                setConfirmDialog({ ...confirmDialog, isOpen: false });
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={userDetailsDialog.isOpen} onOpenChange={(open) => setUserDetailsDialog({ ...userDetailsDialog, isOpen: open })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {userDetailsDialog.user && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{userDetailsDialog.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userDetailsDialog.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant="outline" className="capitalize">
                    {userDetailsDialog.user.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={
                      userDetailsDialog.user.status === "active" || !userDetailsDialog.user.status
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    {userDetailsDialog.user.status || "active"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {format(new Date(userDetailsDialog.user.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              {userDetailsDialog.stats && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {userDetailsDialog.user.role === "provider" ? (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Services</p>
                          <p className="text-xl font-bold">{userDetailsDialog.stats.totalServices}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Bookings</p>
                          <p className="text-xl font-bold">{userDetailsDialog.stats.totalBookings}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Average Rating</p>
                          <p className="text-xl font-bold">{userDetailsDialog.stats.averageRating}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Reviews</p>
                          <p className="text-xl font-bold">{userDetailsDialog.stats.totalReviews}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Bookings</p>
                          <p className="text-xl font-bold">{userDetailsDialog.stats.totalBookings}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Reviews</p>
                          <p className="text-xl font-bold">{userDetailsDialog.stats.totalReviews}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;