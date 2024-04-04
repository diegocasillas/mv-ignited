import { awaitUntil } from "./utils/promises";
import "../index.css";
import { injectTheme } from "./utils/theme";
import { trackForumVisits } from "./utils/tracking";
import { injectBrand, injectFont } from "./utils/brand";
import { injectConfiguration } from "./configuration";
import { injectThread } from "./thread";
import { injectHomepage } from "./homepage";
import {
  isFeaturedThreads,
  isHomepage,
  isSubForumThreads,
  isThread,
  showBody,
  showContent,
} from "./utils/loader";
import { injectThreads } from "./threads";
import { parseThreadsInPage } from "../domains/thread";

window.ignite = {
  isFirstRender: true,
  render: async () => {
    injectFont().then((customFont) => {
      if (customFont) {
        console.log(`MV-Ignited loaded font: ${customFont}`);
      }
    });

    // Await for page mounted before trying to modify anything
    await awaitUntil(() => !!document.getElementById("content"));

    // To prevent blink's the default CSS loads with opacity:0, we restore the opacity here.
    showBody();

    if (window.ignite.isFirstRender) {
      injectTheme();
      injectBrand();
    }

    trackForumVisits();

    // Configuration
    if (document.getElementById("usermenu")) {
      injectConfiguration();
    }

    // Homepage
    if (isHomepage()) {
      injectHomepage();
    }

    // Threads
    if (isSubForumThreads() || isFeaturedThreads()) {
      injectThreads();
    }

    // Thread
    if (isThread()) {
      injectThread();
    }

    parseThreadsInPage();
  },
};

window.ignite
  .render()
  .then(() => {
    window.ignite.isFirstRender = false;
    console.log("MV-Ignited🔥 successfully rendered ✅");
  })
  .catch((error) => {
    showContent();
    console.log("MV-Ignited🔥 errored 🔴");
    console.error(error);
    console.info(
      "⬆️ Por favor, comparte el mensaje anterior para que pueda solucionarlo. 🙏🏼",
    );
  });
