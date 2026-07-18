import { seedProchoice } from "../lib/seedProchoice";
import { processTranslationQueue } from "../lib/translateReview";
import { logger } from "../lib/logger";

async function main(): Promise<void> {
  await seedProchoice();
  const result = await processTranslationQueue();
  logger.info(result, "ProChoice seed + translations finished");
  process.exit(0);
}

main().catch((err) => {
  logger.error({ err }, "seed:prochoice failed");
  process.exit(1);
});
