import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Skills } from "@/components/Skills"
import { Projects } from "@/components/Projects"
import { Contact } from "@/components/Contact"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <footer className="py-8 px-4 text-center text-sm text-muted-foreground border-t">
          <p>© {new Date().getFullYear()} Jan Vavřina. Built with React, TypeScript, and shadcn/ui.</p>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App

