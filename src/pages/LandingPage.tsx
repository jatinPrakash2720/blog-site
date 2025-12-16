import Header1 from "../components/layout/Header1";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useTheme } from "../store/theme";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import textSpilt from "@/lib/spiltText";
import { useMediaQuery } from "../hooks/use-media-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const LandingPage = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const isLaptop = useMediaQuery("(min-width: 1820px)");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [showCarousel, setShowCarousel] = useState(!isMobile);

  // Keep elements visible after animation completes, even when theme changes
  useEffect(() => {
    if (animationComplete) {
      const header = containerRef.current?.querySelector(
        ".header-content"
      ) as HTMLElement;
      const main = containerRef.current?.querySelector(
        ".main-content"
      ) as HTMLElement;
      const footer = containerRef.current?.querySelector(
        ".footer-content"
      ) as HTMLElement;

      if (header) header.style.opacity = "1";
      if (main) main.style.opacity = "1";
      if (footer) footer.style.opacity = "1";

      // Ensure BlogLikho stays hidden after animation completes (only on mobile/tablet)
      const bloglikhoElement = document.querySelector(
        ".my-text"
      ) as HTMLElement;
      if (bloglikhoElement && !isLaptop) {
        bloglikhoElement.style.display = "none";
      }
    }
  }, [theme, animationComplete, isLaptop]);

  useEffect(() => {
    const text = textSpilt("BlogLikho");
    const element = document.querySelector(".my-text") as HTMLElement;
    if (element) element.innerHTML = text;

    // GSAP Animation
    const spans = element?.querySelectorAll("span");
    if (!spans || spans.length === 0) return;

    const tl = gsap.timeline();

    // Stage 1: Header appears
    tl.to(".header-content", {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    });

    // Stage 2: Main section appears
    tl.to(
      ".main-content",
      {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.4"
    );

    // Stage 3: BlogLikho appears at bottom
    gsap.set(spans, {
      opacity: 0,
      y: 200,
      display: "inline-block",
    });

    spans.forEach((span, index) => {
      tl.to(
        span,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        index * 0.1
      );
    });

    // Stage 4: Split BlogLikho - "Blog" goes left, "Likho" goes right (only on mobile/tablet)
    if (!isLaptop) {
      const blogLetters = Array.from(spans).slice(0, 5); // B-L-O-G and space/hyphen handling
      const likhoLetters = Array.from(spans).slice(4); // L-I-K-H-O

      tl.to(
        blogLetters,
        {
          x: -window.innerWidth,
          opacity: 0,
          duration: 1,
          ease: "power3.in",
        },
        "-=0.2"
      );

      tl.to(
        likhoLetters,
        {
          x: window.innerWidth,
          opacity: 0,
          duration: 1,
          ease: "power3.in",
          onComplete: () => {
            // Show carousel after BlogLikho disappears on mobile
            if (isMobile) {
              setShowCarousel(true);
            }
          },
        },
        "-=1"
      );
    }

    // Stage 5: Footer appears
    tl.to(".footer-content", {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        setAnimationComplete(true);
      },
    });
  }, [isLaptop, isMobile]);

  // Update showCarousel when isMobile changes
  useEffect(() => {
    if (!isMobile) {
      setShowCarousel(true);
    } else if (!animationComplete) {
      setShowCarousel(false);
    }
  }, [isMobile, animationComplete]);
  // useGSAP(
  //   () => {
  //     // Your animation code goes here
  //     gsap.to(".my-text", {
  //       opacity: 1,
  //       y: 100,
  //       duration: 1,
  //     });
  //   },
  //   { scope: container }
  // );
  return (
    <div
      key={theme}
      className="background min-h-screen bg-amber-200 dark:bg-amber-950 transition-colors duration-700 relative"
      ref={containerRef}
    >
      {/* Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[1] dark:opacity-[1] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix in='colorNoise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      <div className="flex flex-col min-h-screen">
        <div className="header-content" style={{ opacity: 0 }}>
          <Header1 />
        </div>

        {/* Background Text Animation */}
        <h1
          className="my-text fixed inset-0 flex items-end justify-center font-bold pointer-events-none -translate-y-[6%] sm:-translate-y-[5.5%] md:-translate-y-[4.5%] lg:-translate-y-[3.5%] xl:-translate-y-[2.5%] 2xl:-translate-y-[1.5%]"
          style={{
            zIndex: 100,
            opacity: 0.3,
            fontSize: "clamp(4rem, 15vw, 30rem)",
            lineHeight: 1,
            width: "100vw",
            height: "100vh",
          }}
        >
          BlogLikho
        </h1>

        {/* Main Content */}
        <div
          className="flex-1 overflow-y-auto main-content"
          style={{ opacity: 0 }}
        >
          {/* Empty div to offset header height */}
          <div className="h-12" />
          <main
            id="home"
            className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-6 py-12"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
              {/* Left Content */}
              <div className="text-left">
                <h1 className="text-6xl md:text-7xl font-serif font-bold text-black dark:text-white leading-tight mb-6">
                  Your Voice, Your Stories, Your Blog
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                  Create, share, and discover amazing stories with BlogLikho. A
                  modern blogging platform designed for writers who want to
                  focus on what matters most - their content.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black hover:text-white px-8 py-3 text-lg font-medium rounded-full"
                >
                  <Link to="/auth/register">Start reading</Link>
                </Button>
              </div>

              {/* Right Side - Carousel */}
              <div
                className={`relative w-full flex items-stretch transition-opacity duration-500 ${
                  showCarousel
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <Carousel
                  className="w-full h-full"
                  plugins={[
                    Autoplay({
                      delay: 3000,
                    }),
                  ]}
                >
                  <CarouselContent className="h-full">
                    <CarouselItem className="h-full">
                      <div
                        className="relative flex items-center justify-center w-full h-[400px] overflow-hidden border-6 rounded-3xl border-amber-500 dark:border-amber-900"
                        style={{
                          backgroundImage:
                            "url(https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1600)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
                        <div className="relative z-10 text-center p-8">
                          <h3 className="text-3xl font-bold mb-4 text-white">
                            Discover Stories
                          </h3>
                          <p className="text-white/90">
                            Explore amazing content from talented writers
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem className="h-full">
                      <div
                        className="relative flex items-center justify-center w-full h-[400px] overflow-hidden border-6 rounded-3xl border-amber-500 dark:border-amber-900"
                        style={{
                          backgroundImage:
                            "url(https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&cs=tinysrgb&w=1600)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
                        <div className="relative z-10 text-center p-8">
                          <h3 className="text-3xl font-bold mb-4 text-white">
                            Write Freely
                          </h3>
                          <p className="text-white/90">
                            Express your thoughts without limitations
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem className="h-full">
                      <div
                        className="relative flex items-center justify-center w-full h-[400px] overflow-hidden border-6 rounded-3xl border-amber-500 dark:border-amber-900"
                        style={{
                          backgroundImage:
                            "url(https://images.pexels.com/photos/320014/pexels-photo-320014.jpeg?auto=compress&cs=tinysrgb&w=1600)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
                        <div className="relative z-10 text-center p-8">
                          <h3 className="text-3xl font-bold mb-4 text-white">
                            Share Your Voice
                          </h3>
                          <p className="text-white/90">
                            Connect with readers around the world
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                </Carousel>
              </div>

              {/* Right Illustrations - Commented Out */}
              {/* <div className="relative h-[500px] lg:h-[600px]">
          <div className="w-20 h-20 bg-white rounded-full"></div>
        </div>

        
        <div className="absolute top-20 left-8 w-48 h-48 border-2 border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="absolute top-4 left-4 text-sm font-mono text-gray-600 dark:text-gray-400">
            B
          </div>
          <div className="absolute top-4 right-4 text-sm font-mono text-gray-600 dark:text-gray-400">
            N''
          </div>
          <div className="absolute bottom-4 left-4 text-sm font-mono text-gray-600 dark:text-gray-400">
            E
          </div>
          <div className="absolute bottom-4 right-4 text-sm font-mono text-gray-600 dark:text-gray-400">
            a''
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-gray-400 dark:border-gray-500 rounded-full"></div>
        </div>

        <div className="absolute bottom-0 right-8 w-40 h-32 bg-green-500 rounded-lg flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <div className="absolute top-32 left-16 w-2 h-2 bg-black dark:bg-white rounded-full"></div>
        <div className="absolute top-40 left-24 w-2 h-2 bg-black dark:bg-white rounded-full"></div>
        <div className="absolute top-48 left-20 w-2 h-2 bg-black dark:bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-2 h-2 bg-black dark:bg-white rounded-full"></div>
        <div className="absolute bottom-40 right-24 w-2 h-2 bg-black dark:bg-white rounded-full"></div>
      </div> */}
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer
          className="footer-content py-3 px-6 bg-white dark:bg-black "
          style={{ opacity: 0 }}
        >
          <div className="max-w-7xl mx-auto text-center footer-text">
            <p className="text-sm text-gray-600 dark:text-gray-100">
              Designed and Developed by{" "}
              <span className="font-semibold text-black dark:text-white">
                Jatin Prakash
              </span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
