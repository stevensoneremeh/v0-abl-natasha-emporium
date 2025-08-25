"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Settings } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    site_name: "ABL NATASHA ENTERPRISES",
    site_description: "Luxury real estate and premium products",
    contact_email: "info@ablnatashaenterprises.com",
    contact_phone: "+1 (555) 123-4567",
    address: "123 Luxury Avenue, Premium City, PC 12345",
    social_facebook: "",
    social_instagram: "",
    social_twitter: "",
    social_linkedin: "",
    paystack_public_key: "",
    paystack_secret_key: "",
    maintenance_mode: false,
    allow_guest_checkout: true,
    require_email_verification: true,
    auto_approve_reviews: false,
    default_currency: "USD",
    tax_rate: "0.00",
    shipping_rate: "0.00",
    free_shipping_threshold: "100.00",
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings((prev) => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error("Failed to update settings")

      toast.success("Settings updated successfully!")
    } catch (error) {
      toast.error("Failed to update settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Settings className="h-8 w-8 text-luxury-gold" />
        <div>
          <h1 className="text-3xl font-bold text-luxury-navy font-playfair">Site Settings</h1>
          <p className="text-luxury-charcoal mt-2">Configure your website settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => setSettings((prev) => ({ ...prev, site_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => setSettings((prev) => ({ ...prev, site_description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings((prev) => ({ ...prev, contact_email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone}
                  onChange={(e) => setSettings((prev) => ({ ...prev, contact_phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="social_facebook">Facebook URL</Label>
                <Input
                  id="social_facebook"
                  type="url"
                  value={settings.social_facebook}
                  onChange={(e) => setSettings((prev) => ({ ...prev, social_facebook: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="social_instagram">Instagram URL</Label>
                <Input
                  id="social_instagram"
                  type="url"
                  value={settings.social_instagram}
                  onChange={(e) => setSettings((prev) => ({ ...prev, social_instagram: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="social_twitter">Twitter URL</Label>
                <Input
                  id="social_twitter"
                  type="url"
                  value={settings.social_twitter}
                  onChange={(e) => setSettings((prev) => ({ ...prev, social_twitter: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                <Input
                  id="social_linkedin"
                  type="url"
                  value={settings.social_linkedin}
                  onChange={(e) => setSettings((prev) => ({ ...prev, social_linkedin: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="paystack_public_key">Paystack Public Key</Label>
                <Input
                  id="paystack_public_key"
                  value={settings.paystack_public_key}
                  onChange={(e) => setSettings((prev) => ({ ...prev, paystack_public_key: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="paystack_secret_key">Paystack Secret Key</Label>
                <Input
                  id="paystack_secret_key"
                  type="password"
                  value={settings.paystack_secret_key}
                  onChange={(e) => setSettings((prev) => ({ ...prev, paystack_secret_key: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="default_currency">Default Currency</Label>
                <Input
                  id="default_currency"
                  value={settings.default_currency}
                  onChange={(e) => setSettings((prev) => ({ ...prev, default_currency: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  step="0.01"
                  value={settings.tax_rate}
                  onChange={(e) => setSettings((prev) => ({ ...prev, tax_rate: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Store Settings */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shipping_rate">Shipping Rate ($)</Label>
                <Input
                  id="shipping_rate"
                  type="number"
                  step="0.01"
                  value={settings.shipping_rate}
                  onChange={(e) => setSettings((prev) => ({ ...prev, shipping_rate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="free_shipping_threshold">Free Shipping Threshold ($)</Label>
                <Input
                  id="free_shipping_threshold"
                  type="number"
                  step="0.01"
                  value={settings.free_shipping_threshold}
                  onChange={(e) => setSettings((prev) => ({ ...prev, free_shipping_threshold: e.target.value }))}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                  <Switch
                    id="maintenance_mode"
                    checked={settings.maintenance_mode}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, maintenance_mode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="allow_guest_checkout">Allow Guest Checkout</Label>
                  <Switch
                    id="allow_guest_checkout"
                    checked={settings.allow_guest_checkout}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, allow_guest_checkout: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="require_email_verification">Require Email Verification</Label>
                  <Switch
                    id="require_email_verification"
                    checked={settings.require_email_verification}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, require_email_verification: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto_approve_reviews">Auto Approve Reviews</Label>
                  <Switch
                    id="auto_approve_reviews"
                    checked={settings.auto_approve_reviews}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, auto_approve_reviews: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="card-luxury mt-6">
          <CardContent className="pt-6">
            <Button type="submit" className="btn-luxury" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
