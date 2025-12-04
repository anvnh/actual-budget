import React, { type ReactNode, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { Input } from '@actual-app/components/input';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { tokens } from '@actual-app/components/tokens';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';

import { listen } from 'loot-core/platform/client/fetch';
import { isElectron } from 'loot-core/shared/environment';

import { AuthSettings } from './AuthSettings';
import { Backups } from './Backups';
import { BudgetTypeSettings } from './BudgetTypeSettings';
import { CurrencySettings } from './Currency';
import { EncryptionSettings } from './Encryption';
import { ExperimentalFeatures } from './Experimental';
import { ExportBudget } from './Export';
import { FormatSettings } from './Format';
import { LanguageSettings } from './LanguageSettings';
import { RepairTransactions } from './RepairTransactions';
import { ForceReload, ResetCache, ResetSync } from './Reset';
import { ThemeSettings } from './Themes';
import { AdvancedToggle, Setting } from './UI';

import { closeBudget } from '@desktop-client/budgetfiles/budgetfilesSlice';
import {
  Checkbox,
  FormField,
  FormLabel,
} from '@desktop-client/components/forms';
import { MOBILE_NAV_HEIGHT } from '@desktop-client/components/mobile/MobileNavTabs';
import { Page } from '@desktop-client/components/Page';
import { useFeatureFlag } from '@desktop-client/hooks/useFeatureFlag';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { loadPrefs } from '@desktop-client/prefs/prefsSlice';
import { useDispatch } from '@desktop-client/redux';

export function Settings() {
  const { t } = useTranslation();
  const [floatingSidebar] = useGlobalPref('floatingSidebar');
  const [budgetName] = useMetadataPref('budgetName');
  const dispatch = useDispatch();
  const isCurrencyExperimentalEnabled = useFeatureFlag('currency');
  const isForceReloadEnabled = useFeatureFlag('forceReload');
  const [_, setDefaultCurrencyCodePref] = useSyncedPref('defaultCurrencyCode');

  const onCloseBudget = () => {
    dispatch(closeBudget());
  };

  useEffect(() => {
    const unlisten = listen('prefs-updated', () => {
      dispatch(loadPrefs());
    });

    dispatch(loadPrefs());
    return () => unlisten();
  }, [dispatch]);

  useEffect(() => {
    if (!isCurrencyExperimentalEnabled) {
      setDefaultCurrencyCodePref('');
    }
  }, [isCurrencyExperimentalEnabled, setDefaultCurrencyCodePref]);

  const { isNarrowWidth } = useResponsive();

  return (
    <Page
      header={t('Settings')}
      style={{
        marginInline: floatingSidebar && !isNarrowWidth ? 'auto' : 0,
      }}
    >
      <View
        data-testid="settings"
        style={{
          marginTop: 10,
          flexShrink: 0,
          maxWidth: 530,
          width: '100%',
          gap: 30,
          paddingBottom: MOBILE_NAV_HEIGHT,
        }}
      >
        {isNarrowWidth && (
          <View
            style={{
              gap: 10,
              flexDirection: 'row',
              alignItems: 'flex-end',
              width: '100%',
            }}
          >
            {/* The only spot to close a budget on mobile */}
            <FormField style={{ flex: 1 }}>
              <FormLabel title={t('Budget name')} />
              <Input
                value={budgetName}
                disabled
                style={{ color: theme.buttonNormalDisabledText }}
              />
            </FormField>
            <Button onPress={onCloseBudget} style={{ flexShrink: 0 }}>
              <Trans>Switch file</Trans>
            </Button>
          </View>
        )}
        <ThemeSettings />
        <FormatSettings />
        {isCurrencyExperimentalEnabled && <CurrencySettings />}
        <LanguageSettings />
        <AuthSettings />
        <EncryptionSettings />
        <BudgetTypeSettings />
        {isElectron() && <Backups />}
        <ExportBudget />
        <AdvancedToggle>
          {isForceReloadEnabled && <ForceReload />}
          <ResetCache />
          <ResetSync />
          <RepairTransactions />
          <ExperimentalFeatures />
        </AdvancedToggle>
      </View>
    </Page>
  );
}
