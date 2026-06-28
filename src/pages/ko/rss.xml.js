// Korean RSS feed (/ko/rss.xml).
import { buildFeed } from '../../utils/rss';

export const GET = (context) => buildFeed('ko', context);
