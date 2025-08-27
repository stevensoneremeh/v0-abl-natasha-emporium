import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, ShoppingCart, Truck, CreditCard, Home, Phone } from "lucide-react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Frequently Asked Questions - ABL NATASHA ENTERPRISES",
  description: "Find answers to common questions about our luxury products and services.",
}

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Orders & Shopping",
      icon: ShoppingCart,
      questions: [
        {
          question: "How do I place an order?",
          answer:
            "You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. You can shop as a guest or create an account for faster future purchases.",
        },
        {
          question: "Can I modify or cancel my order?",
          answer:
            "Orders can be modified or cancelled within 2 hours of placement. After this time, please contact our customer service team for assistance.",
        },
        {
          question: "Do you offer international shipping?",
          answer:
            "Currently, we ship within Nigeria and select international locations. Shipping options and costs will be displayed during checkout based on your location.",
        },
      ],
    },
    {
      title: "Payments & Pricing",
      icon: CreditCard,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards, debit cards, and bank transfers through our secure Paystack payment system. All transactions are encrypted and secure.",
        },
        {
          question: "Are prices inclusive of taxes?",
          answer:
            "Prices displayed include applicable taxes. Any additional fees such as shipping or handling charges will be clearly shown before you complete your purchase.",
        },
        {
          question: "Do you offer payment plans?",
          answer:
            "For high-value items like real estate, we offer flexible payment plans. Contact our sales team to discuss available options for your specific purchase.",
        },
      ],
    },
    {
      title: "Shipping & Delivery",
      icon: Truck,
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "Standard shipping takes 3-7 business days within Nigeria. Express shipping options are available for faster delivery. International shipping times vary by location.",
        },
        {
          question: "How can I track my order?",
          answer:
            "Once your order ships, you'll receive a tracking number via email. You can also track your orders by logging into your account and visiting the 'My Orders' section.",
        },
        {
          question: "What if my package is damaged or lost?",
          answer:
            "We're fully responsible for packages until they reach you. If your package arrives damaged or goes missing, contact us immediately and we'll resolve the issue promptly.",
        },
      ],
    },
    {
      title: "Real Estate",
      icon: Home,
      questions: [
        {
          question: "How do I schedule a property viewing?",
          answer:
            "You can schedule a viewing by clicking the 'Book Viewing' button on any property page, or contact our real estate team directly. We offer both in-person and virtual tours.",
        },
        {
          question: "What documents do I need for a property purchase?",
          answer:
            "Required documents include valid ID, proof of income, bank statements, and pre-approval letter if financing. Our team will guide you through the complete documentation process.",
        },
        {
          question: "Do you offer property management services?",
          answer:
            "Yes, we provide comprehensive property management services including tenant screening, rent collection, maintenance, and property marketing for our clients.",
        },
      ],
    },
  ]

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-luxury-gold mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-luxury-navy font-playfair mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-luxury-charcoal">
            Find answers to common questions about our luxury products and services.
          </p>
        </div>

        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5 text-luxury-gold" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left text-luxury-navy hover:text-luxury-gold">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-luxury-charcoal">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-luxury mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-luxury-gold" />
              Still Have Questions?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-luxury-charcoal mb-6">
              Can't find the answer you're looking for? Our customer service team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-luxury-gold text-luxury-navy hover:bg-luxury-gold/90">
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="mailto:support@ablnatashaenterprises.com">Email Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
