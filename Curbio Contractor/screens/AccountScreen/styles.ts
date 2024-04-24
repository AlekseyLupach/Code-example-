import { StyleSheet } from 'react-native';
import { colors, typography } from '../../config/theme';

export const styles = StyleSheet.create({
  hedaer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingHorizontal: 24,
    paddingVertical: 18
  },
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 50
  },
  name: {
    marginTop: 16,
    height: 32
  },
  company: {
    fontSize: 14,
    marginTop: 4,
    color: colors.primaryAccent,
    ...typography.fontBold,
    marginBottom: 30
  }
});
