import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, AlertCircle, Users } from "lucide-react"
import { PageLayout } from "@/components/page-layout"

export const metadata = {
  title: "Terms of Service - ABL NATASHA ENTERPRISES",
  description: "Terms and conditions for using ABL NATASHA ENTERPRISES services.",
}

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Scale className="h-16 w-16 text-luxury-gold mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-luxury-navy font-playfair mb-4">Terms of Service</h1>
          <p className="text-xl text-luxury-charcoal">Please read these terms carefully before using our services.</p>
          <p className="text-sm text-luxury-charcoal mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-luxury-gold" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-luxury-charcoal">
                By accessing and using ABL NATASHA ENTERPRISES website and services, you accept and agree to be bound by
                the terms and provision of this agreement. If you do not agree to abide by the above, please do not use
                this service.
              </p>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-luxury-gold" />
                User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-luxury-navy mb-2">Account Creation</h3>
                <p className="text-luxury-charcoal">
                  You may need to create an account to access certain features. You are responsible for maintaining the
                  confidentiality of your account credentials and for all activities that occur under your account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-luxury-navy mb-2">Account Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1 text-luxury-charcoal">
                  <li>Provide accurate and complete information</li>
                  <li>Keep your account information up to date</li>
                  <li>Maintain the security of your password</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Products and Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-luxury-navy mb-2">Product Information</h3>
                <p className="text-luxury-charcoal">
                  We strive to provide accurate product descriptions and pricing. However, we do not warrant that
                  product descriptions or other content is accurate, complete, reliable, current, or error-free.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-luxury-navy mb-2">Pricing and Availability</h3>
                <p className="text-luxury-charcoal">
                  All prices are subject to change without notice. We reserve the right to modify or discontinue any
                  product or service at any time without notice.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Orders and Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-luxury-navy mb-2">Order Acceptance</h3>
                <p className="text-luxury-charcoal">
                  We reserve the right to refuse or cancel any order for any reason, including but not limited to
                  product availability, errors in product or pricing information, or problems identified by our fraud
                  detection systems.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-luxury-navy mb-2">Payment Terms</h3>
                <p className="text-luxury-charcoal">
                  Payment is due at the time of purchase. We accept various payment methods as displayed during
                  checkout. All transactions are processed securely through our payment partners.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-luxury-gold" />
                Prohibited Uses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-luxury-charcoal mb-4">You may not use our services:</p>
              <ul className="list-disc list-inside space-y-2 text-luxury-charcoal">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>
                  To violate any international, federal, provincial, or state regulations, rules, laws, or local
                  ordinances
                </li>
                <li>
                  To infringe upon or violate our intellectual property rights or the intellectual property rights of
                  others
                </li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-luxury-charcoal mb-4">Questions about the Terms of Service should be sent to us at:</p>
              <div className="space-y-2 text-luxury-charcoal">
                <p>Email: legal@ablnatashaenterprises.com</p>
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
