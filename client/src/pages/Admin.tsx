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
  ExternalLink,
  FileText, 
  Image, 
  LayoutDashboard,
  Link2,
  Loader2,
  MoreHorizontal,
  MousePointerClick,
  Pencil,
  PlusCircle, 
  Settings, 
  SlidersHorizontal, 
  Trash2,
  Type,
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

const galleryFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
  category: z.string().min(1, "Please select a category")
});

const sliderFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  subtitle: z.string().min(5, "Subtitle must be at least 5 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
  ctaText: z.string().min(2, "CTA text must be at least 2 characters"),
  ctaLink: z.string().min(1, "CTA link is required"),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional()
});

type NewsFormValues = z.infer<typeof newsFormSchema>;
type GalleryFormValues = z.infer<typeof galleryFormSchema>;
type SliderFormValues = z.infer<typeof sliderFormSchema>;

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // State for managing dialogs
  const [showNewsDialog, setShowNewsDialog] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [showSliderDialog, setShowSliderDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState<'news' | 'gallery' | 'slider' | 'user'>('news');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
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
  
  // Fetch all slider items
  const { data: sliderData, isLoading: isLoadingSlider, refetch: refetchSlider } = useQuery({
    queryKey: ['/api/slider'],
    queryFn: async () => {
      const res = await fetch('/api/slider');
      if (!res.ok) throw new Error('Failed to fetch slider items');
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
  
  // Form for adding gallery items
  const galleryForm = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      category: ""
    }
  });
  
  // Form for adding slider items
  const sliderForm = useForm<SliderFormValues>({
    resolver: zodResolver(sliderFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      imageUrl: "",
      ctaText: "",
      ctaLink: "",
      secondaryCtaText: "",
      secondaryCtaLink: ""
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
      
      await apiRequest('/api/news', 'POST', newsItem);
      
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

  // Function to handle adding gallery item
  const onAddGallery = async (values: GalleryFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest('/api/gallery', 'POST', values);
      
      toast({
        title: "Success",
        description: "Gallery item has been added",
      });
      
      // Refetch gallery data and close dialog
      refetchGallery();
      setShowGalleryDialog(false);
      galleryForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add gallery item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to handle adding slider item
  const onAddSlider = async (values: SliderFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest('/api/slider', 'POST', values);
      
      toast({
        title: "Success",
        description: "Slider item has been added",
      });
      
      // Refetch slider data and close dialog
      refetchSlider();
      setShowSliderDialog(false);
      sliderForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add slider item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Unified delete function for all item types
  const handleDeleteItem = async () => {
    if (!selectedItemId) return;
    
    setIsSubmitting(true);
    try {
      let endpoint = '';
      let successMessage = '';
      
      switch (deleteType) {
        case 'news':
          endpoint = `/api/news/${selectedItemId}`;
          successMessage = "News article has been deleted";
          break;
        case 'gallery':
          endpoint = `/api/gallery/${selectedItemId}`;
          successMessage = "Gallery item has been deleted";
          break;
        case 'slider':
          endpoint = `/api/slider/${selectedItemId}`;
          successMessage = "Slider item has been deleted";
          break;
        case 'user':
          endpoint = `/api/users/${selectedItemId}`;
          successMessage = "User has been deleted";
          break;
      }
      
      await apiRequest(endpoint, 'DELETE');
      
      toast({
        title: "Success",
        description: successMessage,
      });
      
      // Refetch data based on type
      if (deleteType === 'news') refetchNews();
      if (deleteType === 'gallery') refetchGallery();
      if (deleteType === 'slider') refetchSlider();
      if (deleteType === 'user') refetchUsers();
      
      // Close dialog and reset state
      setShowDeleteDialog(false);
      setSelectedItemId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${deleteType} item`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                                      setSelectedItemId(item.id);
                                      setDeleteType('news');
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
                  {deleteType === 'news' && "Are you sure you want to delete this news article?"}
                  {deleteType === 'gallery' && "Are you sure you want to delete this gallery image?"}
                  {deleteType === 'slider' && "Are you sure you want to delete this slider item?"}
                  {deleteType === 'user' && "Are you sure you want to delete this user account?"}
                  {" This action cannot be undone."}
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
                  onClick={handleDeleteItem}
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
              <Button className="gap-1" onClick={() => setShowGalleryDialog(true)}>
                <PlusCircle className="h-4 w-4" />
                Add Image
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                {isLoadingGallery ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : !galleryData || galleryData.length === 0 ? (
                  <div className="p-4">
                    <div className="grid gap-4">
                      <div className="rounded-lg bg-neutral-50 p-6 text-center">
                        <Image className="mx-auto h-10 w-10 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium">No gallery images</h3>
                        <p className="mt-2 text-sm text-neutral-500">
                          You haven't added any gallery images yet.
                        </p>
                        <Button 
                          className="mt-4 gap-1" 
                          onClick={() => setShowGalleryDialog(true)}
                        >
                          <PlusCircle className="h-4 w-4" /> 
                          Upload First Image
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableCaption>A list of all gallery images</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {galleryData.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{item.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <a 
                                href={item.imageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View Image
                              </a>
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
                                    onClick={() => {
                                      setSelectedItemId(item.id);
                                      setDeleteType('gallery');
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
          
          {/* Add Gallery Dialog */}
          <Dialog open={showGalleryDialog} onOpenChange={setShowGalleryDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Gallery Image</DialogTitle>
                <DialogDescription>
                  Add a new image to the gallery. This will appear on the gallery page.
                </DialogDescription>
              </DialogHeader>
              <Form {...galleryForm}>
                <form onSubmit={galleryForm.handleSubmit(onAddGallery)} className="space-y-4">
                  <FormField
                    control={galleryForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={galleryForm.control}
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
                            <SelectItem value="campus">Campus</SelectItem>
                            <SelectItem value="events">Events</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="people">People</SelectItem>
                            <SelectItem value="facilities">Facilities</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={galleryForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URL" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a URL for the gallery image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowGalleryDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Image
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
              <Button className="gap-1" onClick={() => setShowSliderDialog(true)}>
                <PlusCircle className="h-4 w-4" />
                Add Slide
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                {isLoadingSlider ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : !sliderData || sliderData.length === 0 ? (
                  <div className="p-4">
                    <div className="grid gap-4">
                      <div className="rounded-lg bg-neutral-50 p-6 text-center">
                        <SlidersHorizontal className="mx-auto h-10 w-10 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium">No slider items</h3>
                        <p className="mt-2 text-sm text-neutral-500">
                          You haven't added any slider items yet.
                        </p>
                        <Button 
                          className="mt-4 gap-1" 
                          onClick={() => setShowSliderDialog(true)}
                        >
                          <PlusCircle className="h-4 w-4" /> 
                          Create First Slide
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableCaption>A list of all slider items</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead>CTA</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sliderData.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              <div>
                                <div>{item.title}</div>
                                <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <a 
                                href={item.imageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View Image
                              </a>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <MousePointerClick className="h-3 w-3" />
                                  {item.ctaText}
                                </Badge>
                                <Link2 className="h-3 w-3 text-muted-foreground" />
                              </div>
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
                                    onClick={() => {
                                      setSelectedItemId(item.id);
                                      setDeleteType('slider');
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
          
          {/* Add Slider Dialog */}
          <Dialog open={showSliderDialog} onOpenChange={setShowSliderDialog}>
            <DialogContent className="max-w-md sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Add Slider Item</DialogTitle>
                <DialogDescription>
                  Create a new slider item for the homepage. This will appear in the homepage slider.
                </DialogDescription>
              </DialogHeader>
              <Form {...sliderForm}>
                <form onSubmit={sliderForm.handleSubmit(onAddSlider)} className="space-y-4">
                  <FormField
                    control={sliderForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter slide title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={sliderForm.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter slide subtitle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={sliderForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URL" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a URL for the slider background image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={sliderForm.control}
                      name="ctaText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Call to Action Text</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Learn More" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={sliderForm.control}
                      name="ctaLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Call to Action Link</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. /about" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={sliderForm.control}
                      name="secondaryCtaText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary CTA Text (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Contact Us" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={sliderForm.control}
                      name="secondaryCtaLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary CTA Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. /contact" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowSliderDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Slider Item
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
                                    onClick={() => {
                                      setSelectedItemId(item.id);
                                      setDeleteType('user');
                                      setShowDeleteDialog(true);
                                    }}
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