export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-inter bg-slate-50 min-h-screen text-slate-900">
      {children}
    </div>
  );
}
