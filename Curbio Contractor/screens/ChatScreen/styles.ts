import { StyleSheet } from 'react-native';
import { colors, fontWeights, shadow, typography } from '../../config/theme';

export const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20
  },
  chatWrapper: {
    backgroundColor: colors.primary3
  },
  listContent: {
    paddingBottom: 20
  },
  listEmptyWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  inputWrapper: {
    // height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: colors.separator,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  attachmentWrapper: {
    flex: 1,
    backgroundColor: colors.separator,
    borderRadius: 5
  },
  attachmentCloseBtn: {
    backgroundColor: colors.text,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: 20,
    position: 'absolute',
    top: -10,
    right: -15
  },
  attachmentCloseText: {
    fontSize: 18,
    color: colors.white,
    ...typography.fontMedium
  },
  attachmentOpenBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 10
  },
  input: {
    backgroundColor: colors.separator,
    width: '80%',
    borderRadius: 5,
    padding: 10,
    paddingTop: 15,
    maxHeight: 70
  },
  sendBtn: {
    marginLeft: 10,
    marginTop: 10
  }
});
