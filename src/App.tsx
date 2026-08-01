import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import FeedScreen from './screens/FeedScreen';
import AlertsScreen from './screens/AlertsScreen';
import SavedScreen from './screens/SavedScreen';
import SettingsScreen from './screens/SettingsScreen';
import { useHackathons } from './hooks/useHackathons';
import { useBookmarks } from './hooks/useBookmarks';
import { useAlerts } from './hooks/useAlerts';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    hackathons,
    trendingIndia,
    loading,
    domain,
    setDomain,
    indianSource,
    setIndianSource,
    globalSource,
    setGlobalSource,
    search,
    setSearch,
    refresh,
  } = useHackathons();

  const {
    toggle: toggleBookmark,
    isBookmarked,
    bookmarkedHackathons,
    sort,
    setSort,
  } = useBookmarks();

  const {
    alerts,
    toggleAlert,
    deleteAlert,
    addAlert,
    updateAlert,
    activeCount,
  } = useAlerts();

  const activeAlerts = alerts.filter((a) => a.enabled);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <AppLayout
              activeAlerts={activeAlerts}
              unreadCount={activeCount}
            />
          }
        >
          <Route
            index
            element={
              <FeedScreen
                hackathons={hackathons}
                trendingIndia={trendingIndia}
                loading={loading}
                domain={domain}
                setDomain={setDomain}
                indianSource={indianSource}
                setIndianSource={setIndianSource}
                globalSource={globalSource}
                setGlobalSource={setGlobalSource}
                search={search}
                setSearch={setSearch}
                refresh={refresh}
                isBookmarked={isBookmarked}
                toggleBookmark={toggleBookmark}
              />
            }
          />
          <Route
            path="alerts"
            element={
              <AlertsScreen
                alerts={alerts}
                toggleAlert={toggleAlert}
                deleteAlert={deleteAlert}
                addAlert={addAlert}
                updateAlert={updateAlert}
              />
            }
          />
          <Route
            path="saved"
            element={
              <SavedScreen
                bookmarkedHackathons={bookmarkedHackathons}
                sort={sort}
                setSort={setSort}
                isBookmarked={isBookmarked}
                toggleBookmark={toggleBookmark}
              />
            }
          />
          <Route path="settings" element={<SettingsScreen theme={theme} toggleTheme={toggleTheme} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
