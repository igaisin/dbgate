import _ from 'lodash';
import React from 'react';
import useStorage from './useStorage';
import { useConnectionInfo, useConfig } from './metadataLoaders';
import usePrevious from './usePrevious';
import useNewQuery from '../query/useNewQuery';
import useShowModal from '../modals/showModal';
import useExtensions from './useExtensions';

function createGlobalState(defaultValue) {
  const Context = React.createContext(null);

  function Provider({ children }) {
    const [currentvalue, setCurrentValue] = React.useState(defaultValue);
    return <Context.Provider value={[currentvalue, setCurrentValue]}>{children}</Context.Provider>;
  }

  function useValue() {
    return React.useContext(Context)[0];
  }

  function useSetValue() {
    return React.useContext(Context)[1];
  }

  return [Provider, useValue, useSetValue];
}

function createStorageState(storageKey, defaultValue) {
  const Context = React.createContext(null);

  function Provider({ children }) {
    const [currentvalue, setCurrentValue] = useStorage(storageKey, localStorage, defaultValue);
    return <Context.Provider value={[currentvalue, setCurrentValue]}>{children}</Context.Provider>;
  }

  function useValue() {
    return React.useContext(Context)[0];
  }

  function useSetValue() {
    return React.useContext(Context)[1];
  }

  return [Provider, useValue, useSetValue];
}

const [CurrentWidgetProvider, useCurrentWidget, useSetCurrentWidget] = createGlobalState('database');
export { CurrentWidgetProvider, useCurrentWidget, useSetCurrentWidget };

const [CurrentDatabaseProvider, useCurrentDatabase, useSetCurrentDatabaseCore] = createGlobalState(null);

function useSetCurrentDatabase() {
  const setDb = useSetCurrentDatabaseCore();
  const db = useCurrentDatabase();
  return (value) => {
    if (_.get(db, 'name') !== _.get(value, 'name') || _.get(db, 'connection._id') != _.get(value, 'connection._id')) {
      setDb(value);
    }
  };
}

export { CurrentDatabaseProvider, useCurrentDatabase, useSetCurrentDatabase };

const [OpenedTabsProvider, useOpenedTabs, useSetOpenedTabs] = createStorageState('openedTabs', []);
export { OpenedTabsProvider, useOpenedTabs, useSetOpenedTabs };

export function useUpdateDatabaseForTab(tabVisible, conid, database) {
  const connection = useConnectionInfo({ conid });
  const setDb = useSetCurrentDatabase();
  const previousTabVisible = usePrevious(!!(tabVisible && connection));

  if (!conid || !database) return;

  if (!previousTabVisible && tabVisible && connection) {
    setDb({
      name: database,
      connection,
    });
  }
}

export function useAppObjectParams() {
  const setOpenedTabs = useSetOpenedTabs();
  const currentDatabase = useCurrentDatabase();
  const newQuery = useNewQuery();
  const openedTabs = useOpenedTabs();
  const setSavedSqlFiles = useSetSavedSqlFiles();
  const openedConnections = useOpenedConnections();
  const setOpenedConnections = useSetOpenedConnections();
  const currentArchive = useCurrentArchive();
  const showModal = useShowModal();
  const config = useConfig();
  const extensions = useExtensions();

  return {
    setOpenedTabs,
    currentDatabase,
    currentArchive,
    newQuery,
    openedTabs,
    setSavedSqlFiles,
    openedConnections,
    setOpenedConnections,
    config,
    showModal,
    extensions,
  };
}

const [SavedSqlFilesProvider, useSavedSqlFiles, useSetSavedSqlFiles] = createStorageState('savedSqlFiles', []);
export { SavedSqlFilesProvider, useSavedSqlFiles, useSetSavedSqlFiles };

const [OpenedConnectionsProvider, useOpenedConnections, useSetOpenedConnections] = createGlobalState([]);

export { OpenedConnectionsProvider, useOpenedConnections, useSetOpenedConnections };

const [LeftPanelWidthProvider, useLeftPanelWidth, useSetLeftPanelWidth] = createGlobalState(300);

export { LeftPanelWidthProvider, useLeftPanelWidth, useSetLeftPanelWidth };

const [CurrentArchiveProvider, useCurrentArchive, useSetCurrentArchive] = createGlobalState('default');

export { CurrentArchiveProvider, useCurrentArchive, useSetCurrentArchive };

const [CurrentThemeProvider, useCurrentTheme, useSetCurrentTheme] = createStorageState('selectedTheme', 'light');

export { CurrentThemeProvider, useCurrentTheme, useSetCurrentTheme };
