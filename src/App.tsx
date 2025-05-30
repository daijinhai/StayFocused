import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { Timer } from './components/Timer';
import { SoundButton } from './components/SoundButton';
import { SavedMixes } from './components/SavedMixes';
import { useThemeStore } from './store/useThemeStore';
import { sounds } from './data/sounds';
import { categoryToKey } from './data/categoryMap';
import { useTranslation } from 'react-i18next';

function App() {
  const { getTheme } = useThemeStore();
  const theme = getTheme();
  const { t, ready } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (ready) {
      setIsLoading(false);
    }
  }, [ready]);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme.colors.background} flex items-center justify-center`}>
        <div className={`${theme.colors.textPrimary}`}>Loading...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧声音类别 */}
          <div className="lg:col-span-2 space-y-6">
            {Array.from(new Set(sounds.map(sound => sound.category))).map(category => (
              <div
                key={category}
                className={`${theme.colors.foreground} rounded-xl p-6 shadow-lg`}
              >
                <h2 className={`text-xl font-semibold mb-4 ${theme.colors.text}`}>
                  {t(`categories.${categoryToKey[category]}`)}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {sounds
                    .filter(sound => sound.category === category)
                    .map(sound => (
                      <SoundButton key={sound.id} sound={sound} />
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* 右侧控制面板 */}
          <div className="space-y-6">
            {/* 专注时间 */}
            <Timer />

            {/* 我的混音 */}
            <div className={`${theme.colors.foreground} rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme.colors.text}`}>
                {t('mixes.title')}
              </h2>
              <SavedMixes />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;