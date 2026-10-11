export default function Header() {
  return (
    <header className="top-0 z-50 flex min-w-screen flex-col">
      <nav className="bg-background text-muted flex items-center gap-8 px-4 py-2 text-sm">
        <div>File</div>
        <div>Edit</div>
        <div>View</div>
        <div>Help</div>
      </nav>
    </header>
  );
}
