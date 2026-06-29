import { AgencyPanel } from '@/components/panels/AgencyPanel';
import { GameLog } from '@/components/panels/GameLog';
import { HangarPanel } from '@/components/panels/HangarPanel';
import { MissionPanel } from '@/components/panels/MissionPanel';
import { ShopPanel } from '@/components/panels/ShopPanel';
import { SolarSystemBoard } from '@/components/board/SolarSystemBoard';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <AgencyPanel />
        <MissionPanel />
        <GameLog />
      </aside>

      <main className={styles.main}>
        <SolarSystemBoard />
      </main>

      <aside className={styles.rightbar}>
        <ShopPanel />
        <HangarPanel />
      </aside>
    </div>
  );
}
