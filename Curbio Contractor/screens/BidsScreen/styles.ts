import { StyleSheet } from 'react-native';
import { colors, typography } from '../../config/theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  },
  filterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 40,
    marginRight: 20
  },
  activeFilterBtn: {
    backgroundColor: colors.primaryAccent7,
    borderColor: colors.primaryAccent,
  },
  activeFilterText: {
    color: colors.primaryAccent,
    ...typography.fontSemiBold
  }
});