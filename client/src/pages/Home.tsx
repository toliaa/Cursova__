import HeroSlider from "@/components/HeroSlider";
import FeaturedNews from "@/components/FeaturedNews";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import NewsSection from "@/components/NewsSection";
import ContactSection from "@/components/ContactSection";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturedNews />
      <AboutSection />
      <GallerySection />
      <NewsSection />
      <ContactSection />
      <Newsletter />
    </>
  );
}
