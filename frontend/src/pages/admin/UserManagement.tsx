import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Users, 
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield,
  ArrowLeft,
  Eye,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, isAxiosError } from "@/lib/api";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "provider" | "admin";
  isActive?: boolean;
  createdAt: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users || data);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch users");
      } else {
        toast.error("Failed to fetch users");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { isActive });
      toast.success(`User ${isActive ? "activated" : "suspended"} successfully`);
      fetchUsers();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update user status");
      } else {
        toast.error("Failed to update user status");
      }
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update user role");
      } else {
        toast.error("Failed to update user role");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                  User Management
                </h1>
                <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Manage all users on the platform
              </p>
            </div>
          </div>
          <Button onClick={fetchUsers} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Customers</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === "user").length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Providers</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === "provider").length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === "admin").length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {filteredUsers.length} users found
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Filter role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="provider">Providers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.isActive !== false
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-destructive/10 text-destructive border-destructive/20"
                            }
                          >
                            {user.isActive !== false ? "Active" : "Suspended"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.role !== "admin" && (
                                <DropdownMenuItem
                                  onClick={() => handleRoleChange(user._id, "admin")}
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Make Admin
                                </DropdownMenuItem>
                              )}
                              {user.role !== "provider" && (
                                <DropdownMenuItem
                                  onClick={() => handleRoleChange(user._id, "provider")}
                                >
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Make Provider
                                </DropdownMenuItem>
                              )}
                              {user.role !== "user" && (
                                <DropdownMenuItem
                                  onClick={() => handleRoleChange(user._id, "user")}
                                >
                                  <Users className="w-4 h-4 mr-2" />
                                  Make User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {user.isActive !== false ? (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleStatusChange(user._id, false)}
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-primary"
                                  onClick={() => handleStatusChange(user._id, true)}
                                >
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View User Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Viewing details for {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedUser.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge variant="outline" className="capitalize">
                      {selectedUser.role}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      variant="outline"
                      className={
                        selectedUser.isActive !== false
                          ? "bg-primary/10 text-primary"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {selectedUser.isActive !== false ? "Active" : "Suspended"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default UserManagement;
