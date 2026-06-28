// English RSS feed (/rss.xml). KO feed lives at /ko/rss.xml.
import { buildFeed } from '../utils/rss';

export const GET = (context) => buildFeed('en', context);
