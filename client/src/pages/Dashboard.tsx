import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, FileText, Image, User } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // If not authenticated and not loading, redirect to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If still loading or not authenticated, don't render the dashboard yet
  if (!isAuthenticated) {
    return null;
  }

  // Check if the user is an admin
  const isAdmin = user?.role === "admin";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Manage your website content and user accounts"
              : "Manage your profile and submissions"}
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="outline"
            className="mt-4 md:mt-0"
            onClick={() => navigate("/admin")}
          >
            Go to Admin Portal
          </Button>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                View and manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500">Username</h3>
                  <p className="text-lg font-medium mt-1">{user?.username}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500">Email</h3>
                  <p className="text-lg font-medium mt-1">{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500">Role</h3>
                  <p className="text-lg font-medium capitalize mt-1">{user?.role}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500">Member Since</h3>
                  <p className="text-lg font-medium mt-1">March 27, 2025</p>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline">Edit Profile</Button>
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                My Research Submissions
              </CardTitle>
              <CardDescription>
                Manage your research papers and submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
                <p className="text-neutral-500 mb-4">
                  You haven't submitted any research papers or articles yet.
                </p>
                <Button>Submit New Research</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Favorite Articles
              </CardTitle>
              <CardDescription>
                Articles and research papers you've saved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="text-neutral-500 mb-4">
                  You haven't saved any articles or research papers as favorites.
                </p>
                <Button variant="outline" onClick={() => navigate("/news")}>
                  Browse Articles
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                My Gallery Submissions
              </CardTitle>
              <CardDescription>
                Manage your image uploads and gallery submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Image className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <h3 className="text-lg font-medium mb-2">No gallery submissions</h3>
                <p className="text-neutral-500 mb-4">
                  You haven't uploaded any images to the gallery yet.
                </p>
                <Button>Upload New Image</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}