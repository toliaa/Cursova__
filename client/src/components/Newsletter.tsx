import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section className="py-12 px-4 bg-primary-700">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-primary-100">Stay updated with the latest research news and opportunities.</p>
          </div>
          
          <div className="w-full md:w-1/2">
            <form className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow bg-white text-neutral-800"
              />
              <Button variant="secondary" type="submit" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
