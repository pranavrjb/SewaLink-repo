import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Loader2,
  Search,
  ArrowLeft
} from "lucide-react";
import { servicesApi, Service } from "@/services/servicesApi";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Import service category images
import plumbingImg from "@/assets/plumbing.jpg";
import electricalImg from "@/assets/electrical.jpg";
import cleaningImg from "@/assets/cleaning.jpg";
import gardeningImg from "@/assets/gardening.jpg";
import carpentryImg from "@/assets/carpentry.jpg";
import paintingImg from "@/assets/painting.jpg";
import hvacImg from "@/assets/hvac.jpg";
import applianceImg from "@/assets/appliance.jpg";
import pestcontrolImg from "@/assets/pestcontrol.jpg";
import educationImg from "@/assets/education.jpg";
import beautyImg from "@/assets/beauty.jpg";
import cateringImg from "@/assets/catering.jpg";
import fitnessImg from "@/assets/fitness.jpg";
import it_supportImg from "@/assets/it_support.jpg";
import healthcareImg from "@/assets/healthcare.jpg";
import laundryImg from "@/assets/laundry.jpg";
import movingImg from "@/assets/moving.jpg";
import petcareImg from "@/assets/petcare.jpg";
import securityImg from "@/assets/security.jpg";

const categoryImages: Record<string, string> = {
  plumbing: plumbingImg,
  electrical: electricalImg,
  cleaning: cleaningImg,
  gardening: gardeningImg,
  carpentry: carpentryImg,
  painting: paintingImg,
  hvac: hvacImg,
  appliance: applianceImg,
  healthcare: healthcareImg,
  beauty: beautyImg,
  education: educationImg,
  it_support: it_supportImg,
  security: securityImg,
  moving: movingImg,
  petcare: petcareImg,
  fitness: fitnessImg,
  catering: cateringImg,
  laundry: laundryImg,
  pestcontrol: pestcontrolImg,
};

const categories = [
  "plumbing",
  "electrical",
  "cleaning",
  "gardening",
  "carpentry",
  "painting",
  "hvac",
  "appliance",
  "healthcare",
  "beauty",
  "education",
  "IT Support",
  "security",
  "moving",
  "petcare",
  "fitness",
  "catering",
  "laundry",
  "pestcontrol",
];

interface ServiceFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  phone: string;
  providerName: string;
  image?: string;
}

const initialFormData: ServiceFormData = {
  title: "",
  description: "",
  category: "",
  price: 0,
  location: "",
  phone: "",
  providerName: "",
  image: "",
};

interface ServiceFormProps {
  formData: ServiceFormData;
  setFormData: (data: ServiceFormData) => void;
  isEdit?: boolean;
}

const ServiceForm = ({ formData, setFormData, isEdit = false }: ServiceFormProps) => (
  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
    <div className="space-y-2">
      <Label htmlFor="title">Service Title *</Label>
      <Input
        id="title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="e.g., Professional Plumbing Repair"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="category">Category *</Label>
      <Select
        value={formData.category}
        onValueChange={(value) => setFormData({ ...formData, category: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label htmlFor="description">Description * (min 20 characters)</Label>
      <Textarea
        id="description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Describe your service in detail..."
        rows={4}
      />
      <p className="text-xs text-muted-foreground">
        {formData.description.length} characters
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="price">Price (Rs.) *</Label>
        <Input
          id="price"
          type="number"
          min="500"
          step="100"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          placeholder="500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone * (Max 10)</Label>
        <Input
          id="phone"
          value={formData.phone}
          maxLength={10}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Contact number"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="location">Location *</Label>
      <Input
        id="location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        placeholder="Service area"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="providerName">Provider Name</Label>
      <Input
        id="providerName"
        value={formData.providerName}
        onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
        placeholder="Your business name"
      />
    </div>

    {isEdit && (
      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <Label htmlFor="visibility">Hide Service</Label>
          <p className="text-xs text-muted-foreground">Hidden services won't appear in search</p>
        </div>
        <Switch
          id="visibility"
          checked={formData.isHidden}
          onCheckedChange={(checked) => setFormData({ ...formData, isHidden: checked })}
        />
      </div>
    )}
  </div>
);

const MyServices = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // State for the form
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServices = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const response = await servicesApi.getProviderServices(user.id);
      setServices(response.services || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast({
        title: "Failed to load services",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getServiceImage = (service: Service) => {
    if (service.image) return service.image;
    const categoryKey = service.category?.toLowerCase().replace(/\s+/g, "");
    return categoryImages[categoryKey] || categoryImages.cleaning;
  };

  const handleAddService = () => {
    setFormData({
      ...initialFormData,
      providerName: user?.name || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      location: service.location || "",
      phone: service.phone || "",
      providerName: service.providerName || user?.name || "",
      image: service.image || "",
      isHidden: service.isHidden || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleVisibility = async (e: React.MouseEvent, service: Service) => {
    e.stopPropagation();
    try {
      await servicesApi.updateService(service._id, {
        isHidden: !service.isHidden,
      });
      setServices(prev =>
        prev.map(s =>
          s._id === service._id ? { ...s, isHidden: !s.isHidden } : s
        )
      );

      toast({
        title: !service.isHidden ? "Service hidden" : "Service visible",
        description: `Service is now ${!service.isHidden ? 'hidden from' : 'visible to'} customers.`,
      });
    } catch (error) {
      console.error("Visibility update failed:", error);
      toast({
        title: "Update failed",
        description: "Could not change visibility status.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitAdd = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.phone || !formData.location) {
      toast({
        title: "Missing fields",
        description: "Please fill in title, category, price, phone, and location.",
        variant: "destructive",
      });
      return;
    }

    if (formData.description.length < 20) {
      toast({
        title: "Description too short",
        description: "Description must be at least 20 characters.",
        variant: "destructive",
      });
      return;
    }

    if (formData.phone.length > 10) {
      toast({
        title: "Invalid Phone",
        description: "Phone number cannot exceed 10 digits.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await servicesApi.createService(formData);
      toast({
        title: "Service created successfully!",
        variant: "default",
      });
      setIsAddDialogOpen(false);
      fetchServices();
    } catch (error: any) {
      console.error("Failed to create service:", error);
      const errMsg = error.response?.data?.message || "Failed to create service";
      toast({
        title: "Error",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedService) return;

    if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.phone || !formData.location) {
      toast({
        title: "Missing fields",
        description: "Please fill in title, category, price, phone, and location.",
        variant: "destructive",
      });
      return;
    }

    if (formData.description.length < 20) {
      toast({
        title: "Description too short",
        description: "Description must be at least 20 characters.",
        variant: "destructive",
      });
      return;
    }

    if (formData.phone.length > 10) {
      toast({
        title: "Invalid Phone",
        description: "Phone number cannot exceed 10 digits.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await servicesApi.updateService(selectedService._id, formData);
      toast({
        title: "Service updated successfully!",
        variant: "default",
      });
      setIsEditDialogOpen(false);
      fetchServices();
    } catch (error: any) {
      console.error("Failed to update service:", error);
      const errMsg = error.response?.data?.message || "Failed to update service";
      toast({
        title: "Error",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedService) return;

    try {
      setIsSubmitting(true);
      await servicesApi.deleteService(selectedService._id);
      toast({
        title: "Service deleted successfully!",
        variant: "default",
      });
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
      fetchServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast({
        title: "Failed to delete service",
        variant: "destructive",
      });
      setIsSubmitting(false);
    } finally {
      if (isDeleteDialogOpen) setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                My Services
              </h1>
              <p className="text-muted-foreground">
                Manage your service listings
              </p>
            </div>
          </div>
          <Button onClick={handleAddService} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add New Service
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Services ({filteredServices.length})</CardTitle>
            <CardDescription>View and manage all your service listings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      {/* <TableHead>Rating</TableHead> */}
                      {/* <TableHead>Status</TableHead> */}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={getServiceImage(service)}
                              alt={service.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium">{service.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {service.description.substring(0, 50)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {service.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 font-semibold">
                            {/* CHANGED TO Rs. Text */}
                            <span className="text-primary font-bold">Rs.</span>
                            {service.price}
                          </span>
                        </TableCell>
                        {/* <TableCell>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            {service.rating?.toFixed(1) || "N/A"}
                            {service.reviewCount ? (
                              <span className="text-xs text-muted-foreground">
                                ({service.reviewCount})
                              </span>
                            ) : null}
                          </span>
                        </TableCell> */}
                        {/* <TableCell>
                          {service.isHidden ? (
                            <Badge variant="outline" className="text-muted-foreground">
                              <EyeOff className="w-3 h-3 mr-1" />
                              Hidden
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-primary border-primary/30">
                              <Eye className="w-3 h-3 mr-1" />
                              Visible
                            </Badge>
                          )}
                        </TableCell> */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleToggleVisibility(e, service)}
                              title={service.isHidden ? "Show service" : "Hide service"}
                            >
                              {service.isHidden ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </Button> */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditService(service)}
                              title="Edit service"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(service)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Delete service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No services yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first service listing
                </p>
                <Button onClick={handleAddService}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Service
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new service listing for customers to discover
            </DialogDescription>
          </DialogHeader>
          <ServiceForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAdd} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update your service details
            </DialogDescription>
          </DialogHeader>
          <ServiceForm formData={formData} setFormData={setFormData} isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedService?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyServices;