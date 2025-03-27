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
  Calendar,
  FileText, 
  Image, 
  LayoutDashboard,
  Loader2,
  MoreHorizontal,
  Pencil,
  PlusCircle, 
  Settings, 
  SlidersHorizontal, 
  Trash2,
  User, 
  Users,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define schemas for validation
const newsFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
  category: z.string().min(1, "Please select a category")
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // State for managing dialogs
  const [showNewsDialog, setShowNewsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all news
  const { data: newsData, isLoading: isLoadingNews, refetch: refetchNews } = useQuery({
    queryKey: ['/api/news'],
    queryFn: async () => {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to fetch news');
      return await res.json();
    },
    enabled: isAdmin
  });

  // Fetch all users
  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const res = await fetch('/api/users', {
        credentials: 'include' // Include auth cookies for protected routes
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    },
    enabled: isAdmin // Only fetch when authenticated as admin
  });

  // Fetch all gallery items
  const { data: galleryData, isLoading: isLoadingGallery, refetch: refetchGallery } = useQuery({
    queryKey: ['/api/gallery'],
    queryFn: async () => {
      const res = await fetch('/api/gallery');
      if (!res.ok) throw new Error('Failed to fetch gallery items');
      return await res.json();
    },
    enabled: isAdmin
  });

  // Form for adding news
  const newsForm = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      imageUrl: "",
      category: ""
    }
  });

  // Function to handle adding news
  const onAddNews = async (values: NewsFormValues) => {
    setIsSubmitting(true);
    try {
      // Add current date to the news item
      const newsItem = {
        ...values,
        date: new Date().toISOString(),
      };
      
      await apiRequest('POST', '/api/news', newsItem);
      
      toast({
        title: "Success",
        description: "News article has been added",
      });
      
      // Refetch news data and close dialog
      refetchNews();
      setShowNewsDialog(false);
      newsForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add news article",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle deleting news
  const handleDeleteNews = async () => {
    if (!selectedNewsId) return;
    
    setIsSubmitting(true);
    try {
      await apiRequest('DELETE', `/api/news/${selectedNewsId}`);
      
      toast({
        title: "Success",
        description: "News article has been deleted",
      });
      
      // Refetch news data and close dialog
      refetchNews();
      setShowDeleteDialog(false);
      setSelectedNewsId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete news article",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle deleting user
  const handleDeleteUser = async (userId: number) => {
    try {
      await apiRequest('DELETE', `/api/users/${userId}`);
      
      toast({
        title: "Success",
        description: "User has been deleted",
      });
      
      // Refetch users data
      refetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

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
              <Button className="gap-1" onClick={() => setShowNewsDialog(true)}>
                <PlusCircle className="h-4 w-4" />
                Add News
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                {isLoadingNews ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : !newsData || newsData.length === 0 ? (
                  <div className="p-4">
                    <div className="grid gap-4">
                      <div className="rounded-lg bg-neutral-50 p-6 text-center">
                        <FileText className="mx-auto h-10 w-10 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium">No news articles</h3>
                        <p className="mt-2 text-sm text-neutral-500">
                          You haven't added any news articles yet.
                        </p>
                        <Button className="mt-4 gap-1" onClick={() => setShowNewsDialog(true)}>
                          <PlusCircle className="h-4 w-4" /> 
                          Create First Article
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableCaption>A list of all news articles</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newsData.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{item.category}</Badge>
                            </TableCell>
                            <TableCell>{formatDate(item.date)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => {
                                      setSelectedNewsId(item.id);
                                      setShowDeleteDialog(true);
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Add News Dialog */}
          <Dialog open={showNewsDialog} onOpenChange={setShowNewsDialog}>
            <DialogContent className="max-w-md sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Add News Article</DialogTitle>
                <DialogDescription>
                  Create a new news article for the website. All articles will appear on the news page.
                </DialogDescription>
              </DialogHeader>
              <Form {...newsForm}>
                <form onSubmit={newsForm.handleSubmit(onAddNews)} className="space-y-4">
                  <FormField
                    control={newsForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter news title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={newsForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="events">Events</SelectItem>
                            <SelectItem value="faculty">Faculty</SelectItem>
                            <SelectItem value="students">Students</SelectItem>
                            <SelectItem value="awards">Awards</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={newsForm.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter a brief summary" 
                            className="min-h-20" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A short summary that will appear in news listings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={newsForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter full content" 
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={newsForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URL" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a URL for the news image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewsDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add News
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this news article? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteNews}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                {isLoadingUsers ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : !usersData || usersData.length === 0 ? (
                  <div className="p-4">
                    <div className="grid gap-4">
                      <div className="rounded-lg bg-neutral-50 p-6 text-center">
                        <Users className="mx-auto h-10 w-10 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium">No users</h3>
                        <p className="mt-2 text-sm text-neutral-500">
                          You haven't added any users yet.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableCaption>A list of all users</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usersData.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.username}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={item.role === 'admin' ? "default" : "secondary"}
                              >
                                {item.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteUser(item.id)}
                                    disabled={item.id === user?.id} // Cannot delete own account
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
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