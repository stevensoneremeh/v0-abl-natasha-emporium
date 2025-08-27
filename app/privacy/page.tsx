import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, UserCheck } from "lucide-react"
import { PageLayout } from "@/components/page-layout"

export const metadata = {
  title: "Privacy Policy - ABL NATASHA ENTERPRISES",
  description: "Learn how ABL NATASHA ENTERPRISES protects and handles your personal information.",
}

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-luxury-gold mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-luxury-navy font-playfair mb-4">Privacy Policy</h1>
          <p className="text-xl text-luxury-charcoal">
            Your privacy is important to us. Learn how we protect your information.
          </p>
          <p className="text-sm text-luxury-charcoal mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-luxury-gold" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-luxury-navy mb-2">Personal Information</h3>
                <p className="text-luxury-charcoal">
                  We collect information you provide directly to us, such as when you create an account, make a
                  purchase, or contact us. This may include your name, email address, phone number, shipping address,
                  and payment information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-luxury-navy mb-2">Usage Information</h3>
                <p className="text-luxury-charcoal">
                  We automatically collect certain information about your device and how you interact with our services,
                  including your IP address, browser type, pages visited, and time spent on our site.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-luxury-gold" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-luxury-charcoal">
                <li>Process and fulfill your orders and transactions</li>
                <li>Provide customer service and support</li>
                <li>Send you important updates about your orders and account</li>
                <li>Improve our products and services</li>
                <li>Personalize your shopping experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-luxury-gold" />
                Information Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-luxury-charcoal">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. We use
                industry-standard encryption for sensitive data transmission and storage.
              </p>
              <div>
                <h3 className="font-semibold text-luxury-navy mb-2">Payment Security</h3>
                <p className="text-luxury-charcoal">
                  All payment transactions are processed through secure, PCI-compliant payment processors. We do not
                  store your complete payment card information on our servers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-luxury-charcoal">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-luxury-charcoal">
                <li>Access and update your personal information</li>
                <li>Request deletion of your personal data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Lodge a complaint with relevant authorities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-luxury-charcoal mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-luxury-charcoal">
                <p>Email: privacy@ablnatashaenterprises.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Luxury Avenue, Premium City, PC 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
