import {
  Item,
  ItemActions,
  ItemContent,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { APP_CONFIG } from '@/lib/config'

import { SettingsSection } from './settings-section'

const APP_INFO = [
  { label: 'Aplicativo', value: APP_CONFIG.name },
  { label: 'Versão', value: APP_CONFIG.version },
  { label: 'Build', value: APP_CONFIG.build },
  {
    label: 'Fonte de dados',
    value: APP_CONFIG.dataSource === 'mock' ? 'Demonstração' : 'Remota',
  },
]

export function AppInfoSection() {
  return (
    <SettingsSection title="Aplicativo">
      {APP_INFO.map((info, index) => (
        <div key={info.label}>
          {index > 0 && <ItemSeparator />}
          <Item size="sm">
            <ItemContent>
              <ItemTitle>{info.label}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <span className="font-mono text-sm text-muted-foreground">
                {info.value}
              </span>
            </ItemActions>
          </Item>
        </div>
      ))}
    </SettingsSection>
  )
}
