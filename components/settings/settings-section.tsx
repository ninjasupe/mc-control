import { ItemGroup } from '@/components/ui/item'

interface SettingsSectionProps {
  title: string
  children: React.ReactNode
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="flex flex-col gap-2" aria-label={title}>
      <h2 className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <ItemGroup className="overflow-hidden rounded-xl border bg-card">
        {children}
      </ItemGroup>
    </section>
  )
}
