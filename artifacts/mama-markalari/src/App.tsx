import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HomePage } from "@/pages/HomePage";
import { BrandPage } from "@/pages/BrandPage";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminReviewsPage } from "@/pages/admin/AdminReviewsPage";
import { AdminBrandsPage } from "@/pages/admin/AdminBrandsPage";
import { AdminSettingsPage } from "@/pages/admin/AdminSettingsPage";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { DataProvider } from "@/contexts/DataContext";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <Redirect to="/admin/login" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/marka/:slug" component={BrandPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminDashboardPage} />}
      </Route>
      <Route path="/admin/markalar">
        {() => <ProtectedRoute component={AdminBrandsPage} />}
      </Route>
      <Route path="/admin/yorumlar">
        {() => <ProtectedRoute component={AdminReviewsPage} />}
      </Route>
      <Route path="/admin/yorum-ayarlari">
        {() => <ProtectedRoute component={AdminSettingsPage} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DataProvider>
          <AdminAuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </AdminAuthProvider>
        </DataProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
