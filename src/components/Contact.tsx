import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Github, Linkedin, MessageSquare } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="py-20 px-4 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            I'm always interested in discussing NLP, LLMs, agentic AI, or potential collaborations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Let's Connect</CardTitle>
            <CardDescription>
              Reach out through any of these channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" size="lg" asChild className="justify-start">
                <a href="mailto:your.email@example.com">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Me
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="justify-start">
                <a href="https://github.com/janvavrina" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="justify-start">
                <a href="https://linkedin.com/in/janvavrina" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="justify-start">
                <a href="#contact">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Let's Chat
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

