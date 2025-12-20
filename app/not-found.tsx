// app/not-found.tsx (Simpler Version)
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-2xl mx-auto">
        {/* Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <Frown className="h-16 w-16 text-blue-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
              404
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Lost Your Way?
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg bg-primary hover:bg-primary/90"
            asChild
          >
            <Link href="/" className="flex items-center gap-3">
              <Home className="h-5 w-5" />
              Go to Home
            </Link>
          </Button>
          
          {/* <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-6 text-lg"
            asChild
          >
            <Link href="javascript:history.back()" className="flex items-center gap-3">
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </Link>
          </Button> */}
        </div>

        {/* Helpful Links */}
        <div className="bg-gray-50 rounded-2xl p-6 max-w-lg mx-auto">
          <h3 className="font-semibold text-gray-700 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/users/rent" 
              className="p-4 bg-white rounded-lg border hover:border-primary hover:shadow transition-all"
            >
              <div className="font-medium text-gray-800">💳 Pay Rent</div>
              <div className="text-sm text-gray-600">Make rent payments</div>
            </Link>
            <Link 
              href="/users/communication" 
              className="p-4 bg-white rounded-lg border hover:border-primary hover:shadow transition-all"
            >
              <div className="font-medium text-gray-800">💬 Communication</div>
              <div className="text-sm text-gray-600">Chat & messages</div>
            </Link>
            <Link 
              href="/users/report" 
              className="p-4 bg-white rounded-lg border hover:border-primary hover:shadow transition-all"
            >
              <div className="font-medium text-gray-800">📊 Reports</div>
              <div className="text-sm text-gray-600">View your reports</div>
            </Link>
            <Link 
              href="/users/help" 
              className="p-4 bg-white rounded-lg border hover:border-primary hover:shadow transition-all"
            >
              <div className="font-medium text-gray-800">❓ Help Center</div>
              <div className="text-sm text-gray-600">Get assistance</div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>Need help? Contact support@tenantportal.com</p>
        </div>
      </div>
    </div>
  );
}