import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    title: "LLM-Powered Agent System",
    description: "An autonomous agent system built with Python that uses LLMs for reasoning and decision-making. Features tool use, memory management, and multi-step planning.",
    tech: ["Python", "LLMs", "Agentic AI"],
    github: "https://github.com/janvavrina",
    demo: "#",
  },
  {
    title: "Prompt Engineering Toolkit",
    description: "A comprehensive toolkit for prompt engineering with templates, testing frameworks, and optimization tools. Built to help developers create better prompts.",
    tech: ["Python", "TypeScript", "Prompt Engineering"],
    github: "https://github.com/janvavrina",
    demo: "#",
  },
  {
    title: "NLP Analysis Platform",
    description: "A web application for analyzing text using various NLP models. Features sentiment analysis, entity extraction, and text summarization capabilities.",
    tech: ["Python", "TypeScript", "NLP"],
    github: "https://github.com/janvavrina",
    demo: "#",
  },
]

export function Projects() {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Some of my recent work in NLP, LLMs, and agentic AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.title} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Demo
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

