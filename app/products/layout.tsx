import Nav from "@/components/product-nav";

export default function ProductPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-900 text-white max-w-screen-md mx-auto">
      <Nav />
      {children}
    </div>
  );
}
