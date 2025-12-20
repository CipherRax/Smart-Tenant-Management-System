// components/footer.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  Home,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageSquare,
  Download,
  Users,
  FileText,
  HelpCircle,
  ChevronRight,
  ArrowUpRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Building className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">TenantFlow</h2>
                <p className="text-gray-400 text-sm">Professional Property Management</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Streamlining property management with modern solutions for landlords, 
              property managers, and tenants. Trusted by thousands of properties nationwide.
            </p>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Trusted Partner
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Shield className="h-3 w-3 mr-1" />
                Secure Platform
              </Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-blue-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/tenants" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Tenants
                </Link>
              </li>
              <li>
                <Link href="/documents" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-purple-400" />
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help-center" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Blog & Guides
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  System Status
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for updates and tips.
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@tenantflow.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Mon-Fri 9AM-6PM EST</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright & Legal */}
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {currentYear} TenantFlow Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/cookies" className="hover:text-gray-300 transition-colors">
                Cookie Policy
              </Link>
              <span>•</span>
              <Link href="/gdpr" className="hover:text-gray-300 transition-colors">
                GDPR Compliance
              </Link>
            </div>
          </div>

          {/* Social Media & Apps */}
          <div className="flex flex-col items-center md:items-end gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link 
                href="https://facebook.com" 
                target="_blank"
                className="h-10 w-10 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank"
                className="h-10 w-10 rounded-full bg-gray-800 hover:bg-blue-400 transition-colors flex items-center justify-center"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="https://instagram.com" 
                target="_blank"
                className="h-10 w-10 rounded-full bg-gray-800 hover:bg-pink-600 transition-colors flex items-center justify-center"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link 
                href="https://linkedin.com" 
                target="_blank"
                className="h-10 w-10 rounded-full bg-gray-800 hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link 
                href="https://youtube.com" 
                target="_blank"
                className="h-10 w-10 rounded-full bg-gray-800 hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>

            {/* Download Apps */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                App Store
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges & Certifications */}
      <div className="bg-gray-900 py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Trust Seals */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-400" />
                <div>
                  <p className="text-sm font-medium">256-bit SSL Encryption</p>
                  <p className="text-xs text-gray-500">Bank-level Security</p>
                </div>
              </div>
              <div className="hidden md:block h-6 w-px bg-gray-700" />
              <div className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-blue-400" />
                <div>
                  <p className="text-sm font-medium">99.9% Uptime</p>
                  <p className="text-xs text-gray-500">Reliable Service</p>
                </div>
              </div>
              <div className="hidden md:block h-6 w-px bg-gray-700" />
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-purple-400" />
                <div>
                  <p className="text-sm font-medium">GDPR Compliant</p>
                  <p className="text-xs text-gray-500">Data Protection</p>
                </div>
              </div>
            </div>

            {/* Back to Top */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}