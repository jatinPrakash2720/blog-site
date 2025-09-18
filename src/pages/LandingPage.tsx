import Header from "../components/layout/Header";
import { Link } from "react-router-dom";
import { ArrowRight, Edit2, BookOpen, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import ParticleBackground from "../components/common/background/ParticeBackground";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <Header />

      {/* Hero Section */}
      <main className="overflow-hidden">
        <section className="pt-24 md:pt-36">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              {/* Announcement Badge */}
              <Link
                to="#"
                className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
              >
                <span className="text-foreground text-sm">
                  Introducing AI-Powered Blog Writing
                </span>
                <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
                <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Main Heading */}
              <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent leading-tight md:leading-tight">
                Your Voice, Your Stories, Your Blog
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-foreground">
                Create, share, and discover amazing stories with BlogLikho. A
                modern blogging platform designed for writers who want to focus
                on what matters most - their content.
              </p>

              {/* CTA Buttons */}
              <div className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                <Button asChild size="lg" className="rounded-xl px-8 text-base">
                  <Link to="/auth/register" className="flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    <span>Start Writing</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="rounded-xl px-8"
                >
                  <Link to="/blogs">
                    <span>Explore Stories</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Image */}
          <div className="relative -mr-56 mt-16 overflow-hidden px-2 sm:mr-0 sm:mt-20 md:mt-24">
            <div
              aria-hidden
              className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
            />
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border bg-background/50 p-4 shadow-lg shadow-zinc-950/15 ring-1 ring-border backdrop-blur">
              <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="w-20 h-20 mx-auto text-primary/60 mb-4" />
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    Beautiful Writing Experience
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Rich editor, distraction-free writing, and powerful
                    publishing tools
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-background pb-16 pt-16 md:pb-32">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose BlogLikho?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to share your stories with the world
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center p-6 rounded-xl border bg-card/50 backdrop-blur">
                <Edit2 className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Rich Editor</h3>
                <p className="text-muted-foreground">
                  Write with our intuitive editor featuring markdown support,
                  media embeds, and real-time preview.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center p-6 rounded-xl border bg-card/50 backdrop-blur">
                <Users className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  Connect with fellow writers, get feedback, and grow your
                  audience in our vibrant community.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center p-6 rounded-xl border bg-card/50 backdrop-blur">
                <BookOpen className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Discover</h3>
                <p className="text-muted-foreground">
                  Explore trending topics, follow your favorite authors, and
                  never miss great content.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
    </div>
  );
};

export default LandingPage;
