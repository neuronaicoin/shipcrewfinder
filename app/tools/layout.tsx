export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        overflowX: 'hidden',
        width: '100%',
        maxWidth: '100vw',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      {children}
    </div>
  );
}
