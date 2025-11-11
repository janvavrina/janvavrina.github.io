import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Code, Zap } from "lucide-react"

export function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Passionate about pushing the boundaries of what's possible with AI and language models
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-primary mb-2" />
              <CardTitle>NLP & LLMs</CardTitle>
              <CardDescription>
                Deep expertise in natural language processing and large language models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                I work extensively with transformer architectures, fine-tuning models, 
                and building applications that leverage the power of modern LLMs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Agentic AI</CardTitle>
              <CardDescription>
                Building autonomous agents that can reason and act
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                I'm excited about the agentic AI revolution, creating systems that can 
                autonomously solve complex problems through reasoning and tool use.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Prompt Engineering</CardTitle>
              <CardDescription>
                Crafting effective prompts for optimal model performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Specialized in prompt engineering techniques, from basic prompting to 
                advanced methods like chain-of-thought and few-shot learning.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

