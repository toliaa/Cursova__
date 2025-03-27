import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

export default function ContactSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize Google Map
    if (mapRef.current && window.google) {
      const location = { lat: 40.712776, lng: -74.005974 }; // Example coordinates (NYC)
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 14,
      });
      
      // Add marker for the location
      new window.google.maps.Marker({
        position: location,
        map,
        title: "University Campus",
      });
    }
  }, [mapRef]);

  return (
    <section id="contacts" className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-neutral-800 mb-4 text-center">Contact Us</h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-10">
          Have questions about our research or want to collaborate? Reach out to us.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6">Get In Touch</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="text-primary-600 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Address</h4>
                    <p className="text-neutral-600">123 University Avenue, Academic District, City, Country, 12345</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-primary-600 mt-1">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Email</h4>
                    <p className="text-neutral-600">research@university.edu</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-primary-600 mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Phone</h4>
                    <p className="text-neutral-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-primary-600 mt-1">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Office Hours</h4>
                    <p className="text-neutral-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="rounded-lg overflow-hidden h-64 shadow-sm bg-neutral-200">
                <div 
                  ref={mapRef} 
                  id="google-map" 
                  className="w-full h-full"
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
              
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Please select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="research">Research Collaboration</SelectItem>
                      <SelectItem value="information">Information Request</SelectItem>
                      <SelectItem value="funding">Funding Opportunities</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Write your message here"
                    className="mt-1 min-h-[150px]"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
