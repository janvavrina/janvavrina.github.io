import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Code2, Brain, Sparkles, Bot, FileText } from "lucide-react"

const skills = [
  {
    name: "Python",
    icon: Code,
    description: "Primary language for ML/AI development",
    level: "Expert",
  },
  {
    name: "TypeScript",
    icon: Code2,
    description: "Building modern web applications",
    level: "Intermediate",
  },
  {
    name: "NLP",
    icon: Brain,
    description: "Natural Language Processing",
    level: "Expert",
  },
  {
    name: "LLMs",
    icon: Sparkles,
    description: "Large Language Models",
    level: "Expert",
  },
  {
    name: "Agentic AI",
    icon: Bot,
    description: "Autonomous AI agents",
    level: "Advanced",
  },
  {
    name: "Prompt Engineering",
    icon: FileText,
    description: "Optimizing prompts for performance",
    level: "Expert",
  },
]

export function Skills() {
  return (
    <section id="skills" className="py-20 px-4 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Technologies and domains I work with
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => {
            const Icon = skill.icon
            return (
              <Card key={skill.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{skill.name}</CardTitle>
                      <CardDescription>{skill.level}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {skill.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

