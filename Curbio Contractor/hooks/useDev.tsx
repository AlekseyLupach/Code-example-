import { getValue, storeValue } from '../utils/common';
import { StorageKeys } from '../constants/storage';
import { createContext, useContext, useEffect, useState } from 'react';

export enum DevSettings {
  isImpersonating = 'isImpersonating'
}

const DevToolContext = createContext(null);

const useDev = () => {
  const { isImpersonatingLocation, setIsImpersonating } =
    useContext(DevToolContext);

  const setDevSetting = (config: { setting: string; enabled: boolean }) => {
    switch (config.setting) {
      case DevSettings.isImpersonating:
        setIsImpersonating(config.enabled);
        break;
      default:
        return;
    }
  };

  return {
    isImpersonatingLocation,
    setDevSetting
  };
};

export const DevToolProvider = ({ children }) => {
  const [isImpersonatingLocation, setIsImpersonating] = useState(false);

  useEffect(() => {
    const getInitial = async () => {
      const storedValue = await getValue(StorageKeys.isImpersonatingLocation);
      setIsImpersonating(storedValue === 'true');
    };

    getInitial();
  }, []);

  useEffect(() => {
    const updateStorage = async () => {
      await storeValue(
        StorageKeys.isImpersonatingLocation,
        isImpersonatingLocation ? 'true' : 'false'
      );
    };

    updateStorage();
  }, [isImpersonatingLocation]);

  return (
    <DevToolContext.Provider
      value={{ isImpersonatingLocation, setIsImpersonating }}>
      {children}
    </DevToolContext.Provider>
  );
};

export default useDev;
