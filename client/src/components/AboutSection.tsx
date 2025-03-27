import { Microscope, Users, GraduationCap, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 px-4 bg-neutral-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-neutral-800 mb-6">About the Research Portal</h2>
            
            <p className="text-neutral-600 mb-4 leading-relaxed">
              The University Research Portal serves as a centralized hub for our institution's groundbreaking research initiatives, academic discoveries, and educational achievements. Our mission is to facilitate knowledge sharing and interdisciplinary collaboration.
            </p>
            
            <p className="text-neutral-600 mb-6 leading-relaxed">
              Established in 2015, this portal connects researchers, students, and the global academic community, providing access to research papers, project updates, and funding opportunities across all disciplines.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-primary-600 text-2xl mb-3">
                    <Microscope />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Research Excellence</h3>
                  <p className="text-neutral-600 text-sm">Supporting breakthrough research across diverse scientific disciplines and humanities.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-primary-600 text-2xl mb-3">
                    <Users />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Global Collaboration</h3>
                  <p className="text-neutral-600 text-sm">Facilitating partnerships with leading institutions and researchers worldwide.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-primary-600 text-2xl mb-3">
                    <GraduationCap />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Student Engagement</h3>
                  <p className="text-neutral-600 text-sm">Providing opportunities for students to participate in cutting-edge research.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-primary-600 text-2xl mb-3">
                    <Globe />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Knowledge Dissemination</h3>
                  <p className="text-neutral-600 text-sm">Sharing discoveries with the academic community and the general public.</p>
                </CardContent>
              </Card>
            </div>
            
            <Button size="lg">
              Learn More About Our Mission
            </Button>
          </div>
          
          <div className="flex flex-col space-y-4">
            <img 
              src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80" 
              alt="University research lab" 
              className="rounded-lg shadow-md w-full object-cover h-64" 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1590402494610-2c378a9114c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80" 
                alt="Student researchers" 
                className="rounded-lg shadow-md w-full object-cover h-40" 
              />
              
              <img 
                src="https://images.unsplash.com/photo-1573497701240-345a300b8d52?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80" 
                alt="Research presentation" 
                className="rounded-lg shadow-md w-full object-cover h-40" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
