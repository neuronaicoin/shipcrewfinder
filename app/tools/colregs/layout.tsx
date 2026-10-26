import type { Metadata } from 'next';
import ToolSeo from '@/app/components/tool-seo';
import { toolMetadata } from '@/lib/tool-seo';

export const metadata: Metadata = toolMetadata('colregs');

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeo slug="colregs" />
    </>
  );
}
