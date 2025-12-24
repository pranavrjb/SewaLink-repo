import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Star, 
  DollarSign,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  MessageSquare,
  Settings
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProviderDashboardProps {
  user: User;
}

// Mock data
const todaysBookings = [
  {
    id: 1,
    service: "Plumbing Repair",
    customer: "Alice Johnson",
    time: "10:00 AM",
    address: "123 Main St, Apt 4B",
    status: "upcoming",
    price: 50,
  },
  {
    id: 2,
    service: "Pipe Installation",
    customer: "Bob Williams",
    time: "2:00 PM",
    address: "456 Oak Ave",
    status: "upcoming",
    price: 75,
  },
  {
    id: 3,
    service: "Drain Cleaning",
    customer: "Carol Davis",
    time: "4:30 PM",
    address: "789 Pine Rd",
    status: "upcoming",
    price: 45,
  },
];

const recentReviews = [
  {
    id: 1,
    customer: "John Smith",
    rating: 5,
    comment: "Excellent work! Very professional and quick.",
    date: "2 days ago",
  },
  {
    id: 2,
    customer: "Emma Wilson",
    rating: 5,
    comment: "Great service, would recommend!",
    date: "5 days ago",
  },
];

const ProviderDashboard = ({ user }: ProviderDashboardProps) => {
  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Provider Dashboard
          </h1>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Provider
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Welcome back, {user.name}! Here's your business overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Bookings</p>
                <p className="text-2xl font-heading font-bold text-foreground">3</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-heading font-bold text-foreground">28</p>
              </div>
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Earnings</p>
                <p className="text-2xl font-heading font-bold text-foreground">Rs.2,450</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-heading font-bold text-foreground">4.9</p>
              </div>
              <Star className="w-8 h-8 text-accent fill-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your appointments for today</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View Calendar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{booking.service}</h4>
                      <p className="text-sm text-muted-foreground">{booking.customer}</p>
                      <p className="text-xs text-muted-foreground">{booking.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{booking.time}</p>
                    <p className="text-sm text-foreground">Rs.{booking.price}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                      <Button size="sm">
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>What your customers are saying</CardDescription>
              </div>
              <Button variant="link" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="p-4 border border-border rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-medium">{review.customer.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{review.customer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-accent text-accent" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Earnings Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-semibold">Rs.620</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold">Rs.2,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-semibold text-accent">Rs.170</span>
                </div>
                <Button className="w-full mt-4">
                  Withdraw Earnings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-between" variant="outline">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Manage Availability
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button className="w-full justify-between" variant="outline">
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Service Settings
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button className="w-full justify-between" variant="outline">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Rate</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "98%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: "95%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>On-Time Rate</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
