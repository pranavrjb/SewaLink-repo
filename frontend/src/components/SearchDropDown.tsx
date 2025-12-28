import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { servicesApi, Service } from "@/services/servicesApi";

const SearchDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch services when dropdown opens
  useEffect(() => {
    if (isOpen && services.length === 0) {
      const fetchServices = async () => {
        setIsLoading(true);
        try {
          const { services: fetchedServices } = await servicesApi.getServices();
          setServices(fetchedServices);
        } catch (error) {
          console.error("Failed to fetch services:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchServices();
    }
  }, [isOpen, services.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter services based on query
  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(query.toLowerCase()) ||
      service.category.toLowerCase().includes(query.toLowerCase()) ||
      service.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setHasSearched(true);
    
    if (filteredServices.length === 0) {
      navigate("/not-found");
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleServiceClick = (service: Service) => {
    navigate(`/providers?category=${encodeURIComponent(service.category)}`);
    setIsOpen(false);
    setQuery("");
    setHasSearched(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHasSearched(false);
                }}
                onKeyDown={handleKeyDown}
                className="pl-9 pr-9"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setHasSearched(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : query.trim() === "" ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Type to search for services...
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="py-2">
                {filteredServices.slice(0, 5).map((service) => (
                  <button
                    key={service._id}
                    onClick={() => handleServiceClick(service)}
                    className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Search className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {service.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {service.category} • ${service.price}
                      </p>
                    </div>
                  </button>
                ))}
                {filteredServices.length > 5 && (
                  <div className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
                    +{filteredServices.length - 5} more results
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-muted-foreground text-sm mb-3">
                  No services found for "{query}"
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigate("/not-found");
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  Go to 404 Page
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;