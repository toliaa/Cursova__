import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle,
  FileText, 
  Image, 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  SlidersHorizontal, 
  User, 
  Users 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the user is an admin
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
        navigate("/dashboard");
      } else {
        setIsAdmin(true);
      }
    }
  }, [user, isLoading, navigate, toast]);

  // If not authenticated and not loading, redirect to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || !isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            Admin Portal
          </h1>
          <p className="text-muted-foreground">
            Manage your website content, users, and settings
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-4 md:mt-0"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Admin Mode</AlertTitle>
        <AlertDescription>
          You're currently in admin mode. Changes made here will affect all users.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="news" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="news">News Management</TabsTrigger>
          <TabsTrigger value="gallery">Gallery Management</TabsTrigger>
          <TabsTrigger value="slider">Slider Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-bold">News Management</CardTitle>
                <CardDescription>
                  Add, edit, or remove news articles from the website
                </CardDescription>
              </div>
              <Button className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Add News
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="grid gap-4">
                    <div className="rounded-lg bg-neutral-50 p-6 text-center">
                      <FileText className="mx-auto h-10 w-10 text-neutral-400" />
                      <h3 className="mt-4 text-lg font-medium">No news articles</h3>
                      <p className="mt-2 text-sm text-neutral-500">
                        You haven't added any news articles yet.
                      </p>
                      <Button className="mt-4 gap-1">
                        <PlusCircle className="h-4 w-4" /> 
                        Create First Article
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-bold">Gallery Management</CardTitle>
                <CardDescription>
                  Manage images and categories in the gallery
                </CardDescription>
              </div>
              <Button className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Image
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="grid gap-4">
                    <div className="rounded-lg bg-neutral-50 p-6 text-center">
                      <Image className="mx-auto h-10 w-10 text-neutral-400" />
                      <h3 className="mt-4 text-lg font-medium">No gallery images</h3>
                      <p className="mt-2 text-sm text-neutral-500">
                        You haven't added any gallery images yet.
                      </p>
                      <Button className="mt-4 gap-1">
                        <PlusCircle className="h-4 w-4" /> 
                        Upload First Image
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slider" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-bold">Slider Management</CardTitle>
                <CardDescription>
                  Manage homepage slider images and content
                </CardDescription>
              </div>
              <Button className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Slide
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="grid gap-4">
                    <div className="rounded-lg bg-neutral-50 p-6 text-center">
                      <SlidersHorizontal className="mx-auto h-10 w-10 text-neutral-400" />
                      <h3 className="mt-4 text-lg font-medium">No slider items</h3>
                      <p className="mt-2 text-sm text-neutral-500">
                        You haven't added any slider items yet.
                      </p>
                      <Button className="mt-4 gap-1">
                        <PlusCircle className="h-4 w-4" /> 
                        Create First Slide
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-bold">User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </div>
              <Button className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center justify-between rounded-md border p-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user?.username}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          Admin
                        </span>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Website Settings
              </CardTitle>
              <CardDescription>
                Configure global settings for your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div>
                  <h3 className="text-md font-medium mb-3">General Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Site Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md"
                        value="University Research Portal"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Site Description</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md"
                        value="Advancing Knowledge Together"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-md"
                        value="contact@university.edu"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border rounded-md"
                        value="+1 (555) 123-4567"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}