import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background/50 backdrop-blur-sm mt-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-semibold text-lg tracking-tight font-onest">DeciVault</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              AI-powered decision and knowledge management platform for modern organizations. 
              Capture, track, and leverage institutional knowledge with complete audit trails.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-3">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DeciVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
