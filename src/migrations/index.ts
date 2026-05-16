import * as migration_20260402_193639 from './20260402_193639';
import * as migration_20260408_181131_add_risk_table_and_faq from './20260408_181131_add_risk_table_and_faq';
import * as migration_20260506_020312 from './20260506_020312';
import * as migration_20260516_fix_news_articles_rels from './20260516_fix_news_articles_rels';

export const migrations = [
  {
    up: migration_20260402_193639.up,
    down: migration_20260402_193639.down,
    name: '20260402_193639'
  },
  {
    up: migration_20260408_181131_add_risk_table_and_faq.up,
    down: migration_20260408_181131_add_risk_table_and_faq.down,
    name: '20260408_181131_add_risk_table_and_faq'
  },
  {
    up: migration_20260506_020312.up,
    down: migration_20260506_020312.down,
    name: '20260506_020312'
  },
  {
    up: migration_20260516_fix_news_articles_rels.up,
    down: migration_20260516_fix_news_articles_rels.down,
    name: '20260516_fix_news_articles_rels'
  },
];
