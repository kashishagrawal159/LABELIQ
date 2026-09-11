import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';

// Layouts & Guards
import RootLayout from './layouts/RootLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public & Auth Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import RuleMatrixPage from './pages/RuleMatrixPage';
import LabelVerificationPage from './pages/LabelVerificationPage';

// Login Pages per role
import ConsumerLogin from './pages/consumer/ConsumerLogin';
import InspectorLogin from './pages/inspector/InspectorLogin';
import ManufacturerLogin from './pages/manufacturer/ManufacturerLogin';

// Consumer Pages
import ConsumerDashboard from './pages/consumer/ConsumerDashboard';
import ConsumerCheck from './pages/consumer/ConsumerCheck';
import ConsumerPassport from './pages/consumer/ConsumerPassport';
import ConsumerHistory from './pages/consumer/ConsumerHistory';
import ConsumerSaved from './pages/consumer/ConsumerSaved';
import ConsumerProfile from './pages/consumer/ConsumerProfile';

// Inspector Pages
import InspectorDashboard from './pages/inspector/InspectorDashboard';
import InspectorCaseDetail from './pages/inspector/InspectorCaseDetail';
import InspectorEvidence from './pages/inspector/InspectorEvidence';
import InspectorViolations from './pages/inspector/InspectorViolations';
import InspectorRiskMap from './pages/inspector/InspectorRiskMap';
import InspectorInspections from './pages/inspector/InspectorInspections';
import InspectorManufacturers from './pages/inspector/InspectorManufacturers';
import InspectorReports from './pages/inspector/InspectorReports';
import InspectorAudit from './pages/inspector/InspectorAudit';
import InspectorTriangulation from './pages/inspector/InspectorTriangulation';

// Manufacturer Pages
import ManufacturerDashboard from './pages/manufacturer/ManufacturerDashboard';
import PrePublishChecker from './pages/manufacturer/PrePublishChecker';
import FixRecheck from './pages/manufacturer/FixRecheck';
import RegulatoryAlerts from './pages/manufacturer/RegulatoryAlerts';
import ManufacturerProducts from './pages/manufacturer/ManufacturerProducts';
import ManufacturerIssues from './pages/manufacturer/ManufacturerIssues';
import ManufacturerVersions from './pages/manufacturer/ManufacturerVersions';
import ManufacturerReports from './pages/manufacturer/ManufacturerReports';

// Gateway Redirects
function ConsumerGateway() {
  const { user } = useAuth();
  return user?.role === 'consumer' ? <Navigate to="/consumer/dashboard" replace /> : <Navigate to="/consumer/login" replace />;
}

function InspectorGateway() {
  const { user } = useAuth();
  return user?.role === 'inspector' ? <Navigate to="/inspector/dashboard" replace /> : <Navigate to="/inspector/login" replace />;
}

function ManufacturerGateway() {
  const { user } = useAuth();
  return user?.role === 'manufacturer' ? <Navigate to="/manufacturer/dashboard" replace /> : <Navigate to="/manufacturer/login" replace />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootLayout />}>
                
                {/* Public Routes */}
                <Route index element={<LandingPage />} />
                <Route path="rules" element={<div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"><RuleMatrixPage /></div>} />
                <Route path="login" element={<LoginPage />} />
                <Route path="role-selection" element={<RoleSelectionPage />} />
                <Route path="label-verification" element={<div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"><LabelVerificationPage /></div>} />

                {/* Portal Gateways */}
                <Route path="consumer" element={<ConsumerGateway />} />
                <Route path="consumer/login" element={<ConsumerLogin />} />

                <Route path="inspector" element={<InspectorGateway />} />
                <Route path="inspector/login" element={<InspectorLogin />} />

                <Route path="manufacturer" element={<ManufacturerGateway />} />
                <Route path="manufacturer/login" element={<ManufacturerLogin />} />

                {/* Consumer Protected Routes */}
                <Route path="consumer/dashboard" element={
                  <ProtectedRoute allowedRole="consumer">
                    <ConsumerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="consumer/check" element={
                  <ProtectedRoute allowedRole="consumer">
                    <ConsumerCheck />
                  </ProtectedRoute>
                } />
                <Route path="consumer/passport" element={
                  <ProtectedRoute allowedRole="consumer">
                    <ConsumerPassport />
                  </ProtectedRoute>
                } />
                <Route path="consumer/history" element={
                  <ProtectedRoute allowedRole="consumer">
                    <ConsumerHistory />
                  </ProtectedRoute>
                } />
                <Route path="consumer/saved" element={
                  <ProtectedRoute allowedRole="consumer">
                    <ConsumerSaved />
                  </ProtectedRoute>
                } />
                <Route path="consumer/profile" element={
                  <ProtectedRoute allowedRole="consumer">
                    <ConsumerProfile />
                  </ProtectedRoute>
                } />

                {/* Inspector Protected Routes */}
                <Route path="inspector/dashboard" element={
                  <ProtectedRoute allowedRole="inspector">
                    <InspectorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="inspector/triangulation" element={
                  <ProtectedRoute allowedRole="inspector">
                    <InspectorTriangulation />
                  </ProtectedRoute>
                } />
                <Route path="inspector/cases" element={
                  <ProtectedRoute allowedRole="inspector">
                    <InspectorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="inspector/cases/:id" element={
                  <ProtectedRoute allowedRole="inspector">
                    <InspectorCaseDetail />
                  </ProtectedRoute>
                } />
                <Route path="inspector/inspections" element={
                  <ProtectedRoute allowedRole="inspector">
                    <InspectorInspections />
                  </ProtectedRoute>
                } />
                <Route path="inspector/violations" element={
                  <ProtectedRoute allowedRole="inspector">
                    <InspectorViolations />
                  </ProtectedRoute>
                } />
                <Route path="inspector/evidence" element={
                  <ProtectedRoute allowedRole="inspector">
                    <InspectorEvidence />
                  </ProtectedRoute>
                } />
                <Route path="inspector/risk-map" element={
                  <ProtectedRoute allowedRole="inspector">
                    <InspectorRiskMap />
                  </ProtectedRoute>
                } />
                <Route path="inspector/manufacturers" element={
                  <ProtectedRoute allowedRole="inspector">
                    <InspectorManufacturers />
                  </ProtectedRoute>
                } />
                <Route path="inspector/reports" element={
                  <ProtectedRoute allowedRole="inspector">
                    <InspectorReports />
                  </ProtectedRoute>
                } />
                <Route path="inspector/audit" element={
                  <ProtectedRoute allowedRole="inspector">
                    <InspectorAudit />
                  </ProtectedRoute>
                } />

                {/* Manufacturer Protected Routes */}
                <Route path="manufacturer/dashboard" element={
                  <ProtectedRoute allowedRole="manufacturer">
                    <ManufacturerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="manufacturer/products" element={
                  <ProtectedRoute allowedRole="manufacturer">
                    <ManufacturerProducts />
                  </ProtectedRoute>
                } />
                <Route path="manufacturer/pre-publish" element={
                  <ProtectedRoute allowedRole="manufacturer">
                    <PrePublishChecker />
                  </ProtectedRoute>
                } />
                <Route path="manufacturer/issues" element={
                  <ProtectedRoute allowedRole="manufacturer">
                    <ManufacturerIssues />
                  </ProtectedRoute>
                } />
                <Route path="manufacturer/fix-recheck" element={
                  <ProtectedRoute allowedRole="manufacturer">
                    <FixRecheck />
                  </ProtectedRoute>
                } />
                <Route path="manufacturer/passport" element={
                  <ProtectedRoute allowedRole="manufacturer">
                    <ConsumerPassport />
                  </ProtectedRoute>
                } />
                <Route path="manufacturer/versions" element={
                  <ProtectedRoute allowedRole="manufacturer">
                    <ManufacturerVersions />
                  </ProtectedRoute>
                } />
                <Route path="manufacturer/regulatory-alerts" element={
                  <ProtectedRoute allowedRole="manufacturer">
                    <RegulatoryAlerts />
                  </ProtectedRoute>
                } />
                <Route path="manufacturer/reports" element={
                  <ProtectedRoute allowedRole="manufacturer">
                    <ManufacturerReports />
                  </ProtectedRoute>
                } />
                <Route path="manufacturer/profile" element={
                  <ProtectedRoute allowedRole="manufacturer">
                    <ConsumerProfile />
                  </ProtectedRoute>
                } />

                {/* Shared */}
                <Route path="passport" element={<ConsumerPassport />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
