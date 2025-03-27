import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FlaskConical, LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const handleLoginClick = () => {
    navigate("/login");
    setIsOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Site Name */}
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-12 h-12 bg-primary-600 flex items-center justify-center rounded-lg mr-3">
            <FlaskConical className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-700">University Research Portal</h1>
            <p className="text-sm text-neutral-500">Advancing Knowledge Together</p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-neutral-700 hover:text-primary-600"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          <Link href="/">
            <a className={cn("font-medium hover:text-primary-600 transition", 
              isActive("/") ? "text-primary-600" : "text-neutral-600")}>
              Home
            </a>
          </Link>
          <Link href="/about">
            <a className={cn("font-medium hover:text-primary-600 transition", 
              isActive("/about") ? "text-primary-600" : "text-neutral-600")}>
              About
            </a>
          </Link>
          <Link href="/gallery">
            <a className={cn("font-medium hover:text-primary-600 transition", 
              isActive("/gallery") ? "text-primary-600" : "text-neutral-600")}>
              Gallery
            </a>
          </Link>
          <Link href="/news">
            <a className={cn("font-medium hover:text-primary-600 transition", 
              isActive("/news") ? "text-primary-600" : "text-neutral-600")}>
              News
            </a>
          </Link>
          <Link href="/contacts">
            <a className={cn("font-medium hover:text-primary-600 transition", 
              isActive("/contacts") ? "text-primary-600" : "text-neutral-600")}>
              Contacts
            </a>
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.username}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">{user?.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLoginClick}>Login</Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <nav className={cn("w-full md:hidden mt-4 space-y-3", isOpen ? "block" : "hidden")}>
          <Link href="/">
            <a className={cn("block py-2 px-4 rounded font-medium", 
              isActive("/") ? "text-primary-600 bg-neutral-100" : "text-neutral-600 hover:bg-neutral-100")}>
              Home
            </a>
          </Link>
          <Link href="/about">
            <a className={cn("block py-2 px-4 rounded font-medium", 
              isActive("/about") ? "text-primary-600 bg-neutral-100" : "text-neutral-600 hover:bg-neutral-100")}>
              About
            </a>
          </Link>
          <Link href="/gallery">
            <a className={cn("block py-2 px-4 rounded font-medium", 
              isActive("/gallery") ? "text-primary-600 bg-neutral-100" : "text-neutral-600 hover:bg-neutral-100")}>
              Gallery
            </a>
          </Link>
          <Link href="/news">
            <a className={cn("block py-2 px-4 rounded font-medium", 
              isActive("/news") ? "text-primary-600 bg-neutral-100" : "text-neutral-600 hover:bg-neutral-100")}>
              News
            </a>
          </Link>
          <Link href="/contacts">
            <a className={cn("block py-2 px-4 rounded font-medium", 
              isActive("/contacts") ? "text-primary-600 bg-neutral-100" : "text-neutral-600 hover:bg-neutral-100")}>
              Contacts
            </a>
          </Link>
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="px-4 py-2 text-sm font-medium text-neutral-600">
                Signed in as <span className="font-bold">{user?.username}</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button className="w-full" onClick={handleLoginClick}>Login</Button>
          )}
        </nav>
      </div>
    </header>
  );
}
